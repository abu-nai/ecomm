Project Objectives:
    build out Node JS Web Server -running program hosted on local computer. make our server accessible from browser.

    any time we try to access our server from inside the browser, we will make a request to it

    configure server to receive network requests

    inspect request to see what user is looking for

    generate HTML and send back to browser

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
        for hosts other than localhost (most any website), OS then reaches out to some network device (DNS server) to get IP address.
        once DNS server returns IP address, OS will send a second request to that web server and eventually get a response back.

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
    We call these classes REPOSITORIES

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


Authentication
    Being able to sign-up or log-in to anything revolves around the server being able to identify who is making requests to the server.
    Cookies are used to identify who is making requests.
    Cookie contains some identifying info inside ENCRYPTED FORMAT. Users should never exchange cookies!
    Cookies are unique for each domain.

    cookieSession library
        automatically encrypts cookies for us using the encryption key we establish in app.use

        adds on 'req.session' property to our req object
            req.session is an object that we can add properties to
            whenever we call res.send, cookieSession library will look at req.session object for any info changed and encode it into a string. it then attaches this string to outgoing response as cookie that should be stored on user's browser.

Hashing Algorithms
    takes a string and spits out a "random" series of number and letters
    ex: sha256 calculator
    one character change to input results in vastly different output
    can not decipher by just reversing

Rainbow Table Attack
    malicious user gets list of common passwords and computes the respective hash for each of them

Salting Passwords
    adding an extra randomly generated string of characters to each password, different for each user

SUBROUTER - essentially the same kind of router that is built in the app we created, but we can create a separate router in auth.js, export it, then require it into index.js and link it up to app.

Express-Validator library
    Middleware for express.js
    *reminder* ctrl c to exit program, then install library, then run "npm run dev" to restart
    Results from Express-Validator methods are returned to the req object
    
    Validation
        Goal: check that user input matches information we have
        Validators (ValidatorJS) can be chained on to check()

    Sanitization
        Goal: massage/change the income value that a user has provided
        Example: .trim() to remove accidental leading/trailing spaces or some other unintentional characters
        Example: Standardise an incoming email
        Typically sanitize before validating.

Custom Validators
    Custom function we will add to validation change.
    Runs custom validation logic.
    Throws errors that Express Validator will interpret.
    .custom()

Public
    Files that are intended to be executed by the browser

Object Oriented Approach
    Parent Class

Understanding Multi-Part Forms
    Method value indicates HOW information is going to be communicated to the backend server.

    Default value for method for a form is GET.
        Browser will take all of the information of the form, add it into the URL of the request, and make the request to the backend server with that URL.

    Must indicate method="POST" if necessary.
        Browser will take all of the information of the form, stick it into the body of a post-request (req.body), and then make that request to the backend server.
        Network > Click on request > Headers > Form Data contains all of the information in the body of the request
    
    enctype=""
        Stands for "encoding type".
        Describes how to take information out of the form and get it ready to be transmitted.

        Default value is "application/x-www-form-urlencoded"
            Take all the information out of the form (specifically the inputs), look at the name properties of each input, take a look at the values of each, and put them together in a query string format.

            Under Form Data, click "view source" to see what information is actually being transmitted as.

            When using an input with type "file", we may have files that have data inside them that can not be turned into a string and thus, can not be transmitted safely or efficiently using URL encoding scheme.
    
    enctype="multipart/form-data"
        Can handle raw data for file inputs.

        Separately sends each input.

        Chrome will not longer try to parse and show information in post-request Form Data. This is for performance concerns.

        Content-Type under Request Header section will tell the server about the format of data it's about to receive. "boundary" property is a string that describes what is separating all the fields inside of our form.

Multer middleware
    Will take care of images/files uploaded.
        upload.single('image') where image is the value of the name property of the input type of file.
    Will also parse different text fields inside of the post-request body!
    req.file is an object that has the diffent properties of the image file that was uploaded.
    the raw image data is located in req.file.buffer.
    converting to base64 will allow the image information to be safely encoded in a string


Optional Lecture: Different Methods of Image Storage

    Scalability
        Load Balancers are servers whose sole responsibility is to take incoming requests and randomly forward them to one of a number of servers.

Local Hard Drive (Co-Located Disk)
    Generally a bad idea unless you KNOW there will only be one server running.

Database
    Generally expensive.

Outside Data Store for Files
    Generally requires that server has some extra oopmh?

Presigned URL (Stephen's first choice)
    Seems more Dev Ops than Eng. Cost effective, but requires extra set up.
    Outside Data Store holds files.
    Browser sends initial request to server through Load Balancer to upload file.
    Server sends presignedURL back to browser.
    Presigned URL has configuration stuffed into it and gives browser permission to 
    upload the FILE directly into outside data sfore.
    Browser ends up doing the least work in this method.

Requiring Authentication
    req.session is an object that eventually gets stored on the user's cookie. if the user is signed in, we will see req.session.userId on all follow-up requests.

ids in URLs
    router.get('/admin/products/:id/edit')
    Whenever a request comes into the above path, any string of characters in ":id" will be received as a variable on the request object.
    Inside out route handler, we can reference our req object and see what id was provided using 'req.params.id'.

Form Elements
    Only support GET and POST requests as means of submission.
    Deleting is a POST request.
    the "action" attribute specifies the URL that we're going to make the POST request to.