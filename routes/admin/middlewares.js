const { validationResult } = require('express-validator');

// we return a function because all middlewares must be functions
// we take a templateFunc as an arg because we want to customise the middleware for each function and render a different template for each place an error can occur
module.exports = {
    handleErrors(templateFunc) {
        return (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.send(templateFunc({ errors }))
            }

            next();
        };
    },
    // there is no customisation required here
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin');
        }

        next();
    }
};