const hasAccess = function hasAccess(accessLevel) {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === accessLevel) {
            return next()
        }
        return req.flash('error_msg', `Accès non autorisé !`),
        res.redirect('/');
    }
}

module.exports = hasAccess;