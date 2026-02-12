const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        // store filename inside of an instance variable
        this.filename = filename;

        // check that file exists on hard drive *see notes for default method vs Sync*
        // if the file does not exist, create a new file with that name and inside it, write an empty array
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async create(attrs) {
        attrs.id = this.randomId();
        
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);

        return attrs;
    }

    async getAll() {
        // Open the file called this.filename (really the file that it's pointing to)
        // Parse the contents because the contents of our file are thusfar a STRING that contains the array contents and not an actual array
        // Return the parsed data
        return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf8' }));
    }

    async writeAll(records) {
        // write updated 'records'array back to this.filename
        // the third arg to JSON.stringify sets the indentation of the string
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        // generate list of all users
        // loop through and look for user with specified id
        // return user if exists

        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        // iterate through records to find the one that matches our id
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        // takes key-value pairs in attrs and copies to record
        Object.assign(record, attrs);

        // write back to JSON file
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        // for-of loop iterates over ARRAYS
        for (let record of records) {
            let found = true;

            // for-in loop iterates over OBJECTS
            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }
}