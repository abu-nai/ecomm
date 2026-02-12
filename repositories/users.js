const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

// calling promisify on scrypt allows us to avoid using callback functions in later code (ex: create())
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async comparePasswords(saved, supplied) {
        // saved -> password saved in database. 'hashed.salt'
        // supplied -> password submitted by user signing in.

        // // result will be an array with two strings inside. [hashed password, result]
        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];

        // this line of code is identical to the three above, but cleaner
        const [hashed, salt] = saved.split('.');

        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        // returns true or false
        return hashed === hashedSuppliedBuf.toString('hex');
    }

    // overriding existing create() from repository
    async create(attrs) {
        // attrs = { email: '', password: ''}
        // generate random Id for each user
        attrs.id = this.randomId();

        // generate salt
        const salt = crypto.randomBytes(8).toString('hex');

        // generate hashed password + salt using util.promisified scrypt
        const buf = await scrypt(attrs.password, salt, 64);

        // call existing users.json file
        const records = await this.getAll();
        const record = {
            // ... syntax writes copies existing attr properties to new object and then overwrites properties specified afterwards
            ...attrs,
            // the '.' delineates where hashed password ends and salt begins
            password: `${buf.toString('hex')}.${salt}`
        };
        // push new user attributes w/ hashed + salted pw to users.json array
        records.push(record);

         // write updated 'records' array back to this.filename using writeAll func
        await this.writeAll(records);

        // whenever we call create(), we will return the record object that contains the id of the user we just made and the hashed + salted pw
        return record;
    }
}

// export an instance of the class UsersRepository('nameofrepositorywewillsavedatato')
// whenever we import something from this file, we will receive an instance of UsersRepository that we can start calling methods on immediately
module.exports = new UsersRepository('users.json');

// const test = async () => {
//     const repo = new UsersRepository('users.json');

//     // // test to create user
//     // await repo.create({ email: 'test@test.com', password: 'password' });
//     // const users = await repo.getAll();
//     // console.log(users);

//     // // test to find user w/ id
//     // const user = await repo.getOne('3b7d2ba0');
//     // console.log(user)

//     // // test to delete user
//     // await repo.delete('b2ff5b0b');

//     // // test to update user info
//     // await repo.update('179b01bd', { lastLogin: 'February 6th, 2026'});

//     const user = await repo.getOneBy({ lastLogin: 'February 6th, 2026' });
//     console.log(user);
// };

// test();