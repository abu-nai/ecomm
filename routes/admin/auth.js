const express = require('express');

// whenever we require in a file that we wrote, we must provide a relative path from our current file to the file we want access to
const { handleErrors } = require('./middlewares');
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
    handleErrors(signupTemplate),
    async (req, res) => {
         // destructure info from req.body into variables
        const { email, password } = req.body;

        // Create a user in our user repo to represent this person
        const user = await usersRepo.create({email, password}); 

        // Store the id of that user inside the user's cookie
        req.session.userId = user.id;

        res.redirect('/admin/products');
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

router.post('/signin', 
    [ requireEmailExists,
    requireValidPasswordforUser], 
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        // this authenticates user
        req.session.userId = user.id;

        res.redirect('/admin/products');
    });

// make all of our route handlers available to other files in the project
module.exports = router;