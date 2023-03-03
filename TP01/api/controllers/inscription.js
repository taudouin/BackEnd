const {User} = require('../models/user')

module.exports = {
    get: (req, res) => {
        res.render('inscription')
    },

    post: (req, res) => {
        let newUser = new User({
            email: req.body.email,
            password: req.body.password,
        })
        newUser.save();
        res.redirect('/inscription')
    }
}

