const express = require('express');
// destructure off the functions we care about
const { check, validationResult } = require('express-validator');

// whenever we require in a file that we wrote, we must provide a relative path from our current file to the file we want access to
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, passwordConfirm, requirePassword, requireEmailExists, requireValidPasswordforUser } = require('./validators');

// router is essentially an object that will keep track of all of the route handlers we set up. can be linked to app in index.js file.
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post('/signup', 
    [
        requireEmail, 
        requirePassword,
        passwordConfirm
    ],
    async (req, res) => {
        const errors = validationResult(req);

        // check if errors occurred
        if (!errors.isEmpty()) {
            return res.send(signupTemplate({ req, errors }));
        }

        // destructure info from req.body into variables
        const { email, password, passwordConfirmation } = req.body;

        // Create a user in our user repo to represent this person
        const user = await usersRepo.create({email, password}); 

        // Store the id of that user inside the user's cookie
        req.session.userId = user.id;

        res.send('Account created!!!');
    }
);

router.get('/signout', (req, res) => {
    // to sign out, clear cookie
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post('/signin', [
    requireEmailExists,
    requireValidPasswordforUser
], async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
        return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    // this authenticates user
    req.session.userId = user.id;

    res.send('You are signed in!');
});

// make all of our route handlers available to other files in the project
module.exports = router;