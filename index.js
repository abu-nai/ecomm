const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

// app is an object that describes all of the things that the web server can do
const app = express();

// .use func allows us to apply a middleware function to all route handlers to have that middleware func applied
app.use(
    bodyParser.urlencoded({extended: true})
);
app.use(
    cookieSession({
    keys: ['aff8ds78a6sdas']
    })
);
app.use(authRouter);

app.listen(3000, () => {
    console.log('Listening');
});