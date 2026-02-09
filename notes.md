Project Objectives:
    build out Node JS Web Server -running program hosted on local computer. make our server accessible from browser.

    any time we try to access our server from inside the browser, we will make a request to it

    configure server to receive network requests

    inspect request to see what user is looking for

    generate HTML and sent back to browser

    build out file-based data store

General Notes
    Browser will make HTTP requests to NodeJS Server > NodeJS will run web server and handle HTTP request out of the box, but is limited in features > express dependency helps to fill in those gaps

    a ROUTE HANDLER tells our web server what it should do when handling a HTTP request from the browser

        .get('/', (req, res) => { callback function });

        call back function always takes in two arguments: request and response

            request: object that represents the incoming request from our browser into our web server

            response: object that represents the outgoing response from our web server to the browser

    a route handler is registed with a ROUTER (object), which is responsible for looking at the incoming request and calling the appropriate callback function 
        
    we must tell application to start listening for incoming network information on a particular port on our machine

    can access port in browser:
        localhost:port# (ex: localhost:3000)

    Behind the Scenes of Requests
        browser formulates network request, but is not responsible for actually issuing the network request
        request is handed off to operating system. HTTP request properties include:
            Host: 'localhost'
                the domain we are trying to access
            Port: 3000
                HTTP: 80
                HTTPS: 443
            Path: '/'
            Method: 'GET'
                indicates the intent of the request
                    'POST'
                associated with getting record of some kind
                information is not displayed in URL and is instead located in REQUEST BODY property
        for hosts other than localhost (most any website), OS then reaches out to some nerwork device (DNS server) to get IP address
        once DNS server returns IP address, OS will send a second request to that web server and eventually get a response back

        for localhost, OS handles request on its own since it hosts the server.
        OS will look at port in request.

    Express server will listen on the port configured.
        Express cares about the path and method properties.
        Will send request to router and return response to whoever sent the request (in our case, the browser)

    Understanding Form Submissions
        When you click a button inside of a form or hit enter inside of an input, the browser will complete an 'automatic submission' in which it collects data from any inputs with a NAME property assigned.
        From this information, the browser creates a QUERY STRING and makes a GET request (default, can be changed in form method property) to the same URL 

    Parsing Data Forms
        Information in requests is sent over in packets
        Browser sends HTTP header (path, method, and any relevant headers) to server >
        Server sees request with path and method >
        Server runs appropriate callback method >
        THEN the browser starts transmitting info from body of request >
        Browser sends a little chunk of info to server, waits for confirmation that information was received ... repeat however many times >
        All chunks sent! Request complete!

JSON Package Notes
    create a JSON package
        npm init -y
    writing scripts
        helps other engineers looking at your project understand how to utilise your project
    executing scripts in the terminal
        npm run scriptname 
        npm run dev whenever we start up the proj!!

Express
    Middleware Function
        does some pre-processing on the 'req' and 'res' objects
        are executed before we call a final route handler
        primary means of code reuse in Express
        is always called with three arguments (req, res, next)
            req and res 
                can be inspected and modified
                modifications will be received in later request handlers which receive the same req and res objects
            next
                callback func being given to us from Express handler itself
                basically the sign that our middleware function is complete
        can be used as arguments in request handlers

EXAMPLE CODE (diy bodyParser):

// Middleware Function

const bodyParser = (req, res, next) => {
    // we can think of req object as being like an HTML element that will emit an event at some point in time
    // .on is very similar to .addEventListener
    // the event we are waiting for is the 'data' event aka when some data is received
    // data is received in a BUFFER, which is essentially an array that contains raw information/hex values. we use .toString(utf8) to translate the info to human-friendly language.
    // that data is then passed in as the first arg to the callback func

    // check statement
    if (req.method === 'POST') {
        req.on('data', data => {
            // parsed will be an array of strings
            const parsed = data.toString('utf8').split('&');
            const formData = {};
            for (let pair of parsed) {
                // ES2015 destructuring to get back an array of two strings
                const [key, value] = pair.split('=');
                // adding key-value pairs to our previously empty formData object
                formData[key] = value;
            }
            req.body = formData;
            next();
        });
    } else {
        next();
    }
};

Nodemon
    dev tool that automatically restarts web server any time any of our project files change
    this is what we did with out nls proj

Why WOULDN'T we want to use a data store that stores information on our hard drive in a production application?
    Will error if we try to open/write to the same file twice at the same time
    Wont work if we have multiple servers running on different machines
    We have to write to the File System every time we want to update some data

Data Store
    Will take the form of multiple classes that have their own collection of objects
    We call this classes REPOSITORIES

Approaches for Managing Data
    Reposity Approach
        Single class (repository) is responsible for data access. All records are stored and used as plain JS objects.

    Active Record Approach (Named based on Ruby on Rails)
        Every record is an instance of a 'model' class that has methods to save, update, and delete this record.

users.js notes
    Reminder: constructor functions get called immediately whenever we create a new instance of a class. constructor functions are NOT allowed to be asynchronous in nature!
    filename: name of the file that we will eventually store all of our users into
    continuously error check and test along the way

    fs.access: used to check to see if a file exists
        fs.accessSync: does same thing as access, but executes synchronously. no callback involved! not great from a performance/time standpoint, but useful in some corner cases, such as when making the users repository, which we do ONCE.

        if file does not exist, access throws an error. use try-catch to address and create file if it does not exist.

Crypto Module
    used to help securely store passwords
    crypto.randomBytes(size[, callback])
        can be used asynchronously w/ callback
        or synchronously w/o callback
        returns buffer
            use .toString('hex') to return in string hex format