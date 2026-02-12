const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

// app is an object that describes all of the things that the web server can do
const app = express();

// tells express to look inside current directory, find 'public', and make accessible to outside world
app.use(express.static('public'));

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
app.use(productsRouter);

app.listen(3000, () => {
    console.log('Listening');
});