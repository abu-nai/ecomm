const express = require('express');
const bodyParser = require('body-parser');

// app is an object that describes all of the things that the web server can do
const app = express();

// .use func allows us to apply a middleware function to all route handlers to have that middleware func applied
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordconfirmation" placeholder="password confirmation" />
                <button>Sign up</button>
            </form>
        </div>
        `);
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Account created!!!');
});

app.listen(3000, () => {
    console.log('Listening');
});