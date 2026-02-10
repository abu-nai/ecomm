const express = require('express');
// whenever we require in a file that we wrote, we must provide a relative path from our current file to the file we want access to
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

// router is essentially an object that will keep track of all of the route handlers we set up. can be linked to app in index.js file.
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
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

router.get('/signout', (req, res) => {
    // to sign out, clear cookie
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
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

// make all of our route handlers available to other files in the project
module.exports = router;