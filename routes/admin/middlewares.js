const { validationResult } = require('express-validator');

// we return a function because all middlewares must be functions
// we take a templateFunc as an arg because we want to render a different template for each place an error can occur
module.exports = {
    handleErrors(templateFunc) {
        return (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.send(templateFunc({ errors }))
            }

            next();
        };
    }
};