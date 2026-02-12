const { validationResult } = require('express-validator');

// we return a function because all middlewares must be functions
// we take a templateFunc as an arg because we want to customise the middleware for each function and render a different template for each place an error can occur
module.exports = {
    handleErrors(templateFunc, dataCallBack) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // initialise data object variable outside of inner if statement so that it's accessible
                // default to empty object to avoid submitting undefined later
                let data = {};

                // since dataCallBack is an optional arg, we need to check if it was provided first.
                if (dataCallBack) {
                    data = await dataCallBack(req);
                }

                // ...data says take keys and values inside data object and merge with this object
                return res.send(templateFunc({ errors, ...data }));
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