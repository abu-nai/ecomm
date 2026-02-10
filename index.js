const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

// app is an object that describes all of the things that the web server can do
const app = express();

// .use func allows us to apply a middleware function to all route handlers to have that middleware func applied
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ['aff8ds78a6sdas']
}))

app.get('/signup', (req, res) => {
    res.send(`
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign up</button>
            </form>
        </div>
        `);
});

app.post('/signup', async (req, res) => {
    // destructure info from req.body into variables
    const { email, password, passwordConfirmation } = req.body;

    // can condense object values since key and value are the same
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({email, password}); 

    // Store the id of that user inside the user's cookie
    req.session.userId = user.id;

    res.send('Account created!!!');
});

app.get('/signout', (req, res) => {
    // to sign out, clear cookie
    req.session = null;
    res.send('You are logged out');
});

app.get('/signin', (req, res) => {
    res.send(`
            <div>
                <form method="POST">
                    <input name="email" placeholder="email" />
                    <input name="password" placeholder="password" />
                    <button>Sign In</button>
                </form>
            </div>
        `);
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    )

    if (!validPassword) {
        return res.send('Invalid password');
    }

    // this authenticates user
    req.session.userId = user.id;

    res.send('You are signed in!');
});

app.listen(3000, () => {
    console.log('Listening');
});