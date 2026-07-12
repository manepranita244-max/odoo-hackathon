function checkRole(...roles) {

    return function (req, res, next) {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({

                message: "Access Forbidden"

            });

        }

        next();

    };

}

module.exports = checkRole;