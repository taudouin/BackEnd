const usersController = {};

const passport = require('passport');
const validator = require('validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');

const { EMAIL_SMTP_SERVER, PORT_SMTP_SERVER, EMAIL_USER, EMAIL_PASSWORD, WEBSITE_HOST, WEBSITE_PORT } = process.env;

usersController.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersController.signUp = async (req, res) => { // Ajouter question secrète avec réponse
    const errors = [];
    const { fullname, password, confirm_password } = req.body;
    const email = req.body.email.toLowerCase();
    const uniqueString = randString(100);
    const isValid = false;
    if (fullname === "" || email === "" || password === "" || confirm_password === "") {
        errors.push({text: `Au moins l'un des champs est vide !`});
    } else if (fullname.length < 3) {
        errors.push({text: 'Le nom est trop court !'});
    } else if (fullname.length > 30) {
        errors.push({text: 'Le nom est trop long !'});
    } else if (email.length < 8) {
        errors.push({text: `L'adresse email est trop courte !`});
    } else if (email.length > 40) {
        errors.push({text: `L'adresse email est trop longue !`});
    } else if (!validator.isEmail(email)) {
        errors.push({text: `L'adresse email n'est pas conforme !`});
    } else if (!/\d/.test(password)) {
        errors.push({text: 'Le mot de passe doit contenir au moins un chiffre !'});
    } else if (!/[a-z]/.test(password)) {
        errors.push({text: 'Le mot de passe doit contenir au moins une minuscule !'});
    } else if (!/[A-Z]/.test(password)) {
        errors.push({text: 'Le mot de passe doit contenir au moins une majuscule !'});
    } else if (!/[!@#\$%\^&\*]/.test(password)) {
        errors.push({text: 'Le mot de passe doit contenir au moins un caractère spécial !'});
    } else if (password.length < 8) {
        errors.push({text: 'Le mot de passe est trop court !'});
    } else if (password.length > 15) {
        errors.push({text: 'Le mot de passe est trop long !'});
    } else if (password != confirm_password) {
        errors.push({text: 'Les mots de passe ne correspondent pas !'});
    }
    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            fullname,
            email,
        })
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'Cet email est déjà utilisé !');
            res.redirect('/users/signup');
        } else {
            const username = await User.findOne({fullname: fullname});
            if (username) {
                req.flash('error_msg', 'Ce nom est déjà utilisé !');
                res.redirect('/users/signup');
            } else {
                const newUser = new User({fullname, email, password, uniqueString, isValid});
                newUser.password = await newUser.encrypPassword(password)
                await newUser.save();
                newUser.id = newUser._id;
                await newUser.save();
                const imgLogo = '/public/img/logo.png'
                sendEmail(fullname, email, uniqueString, imgLogo);
                req.flash('info_msg', 'Votre inscription a bien été prise en compte ! Un email de confirmation vous a été envoyé !')
                res.redirect('/users/signin');
            }
        }
    }
};

const randString = () => {
    // Considering a 8 length string
    const len = 8;
    let randStr = '';
    for (let i=0; i<len; i++) {
        //ch = a number between 1 to 10
        const ch = Math.floor((Math.random() * 10) + 1);
        randStr += ch;
    }
    return randStr;
};
// randString = (length) => {               // TODO avoir une string plutôt que des nombres /\ :id dans les routes
//     let result           = '';
//     let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let charactersLength = characters.length;
//     for ( let i = 0; i < length; i++ ) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

const sendEmail = (fullname, email, uniqueString, imgLogo) => {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 't.audouin@gmail.com',
            pass: 'tlyjndpyrncrydvg'
        },
    });

    const mailOptions = {
        from: `Lorem Ipsum <${EMAIL_USER}> `,
        to: email,
        subject: 'Validation de votre adresse email',
        html: `<div style="text-align: center;">
                <img src="https://zupimages.net/up/22/51/ju54.png" alt="${imgLogo}" style="border-radius: 50%; width: 100px">
            </div>
            <p style="text-align: center;">Bonjour <strong>${fullname}</strong>,</p>
            <hr>
            <p style="text-align: center;">
                Cliquez sur ce <a href="${WEBSITE_HOST}:${WEBSITE_PORT}/users/verify/${uniqueString}" style="text-decoration:none"><strong>lien</strong></a> pour valider votre email !
            </p>
        `
    };

    transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + res.response);
        }
    })
}

usersController.verifyEmail = async (req, res) => {
    // getting the string
    const { uniqueString } = req.params;
    // Check is there is anyone with this string
    const user = await User.findOne({uniqueString: uniqueString});
    if (!user) {
        req.flash('error_msg', `L'utilisateur n'a pas été trouvé !`);
        res.redirect('/users/signup');
    } else {
        // If there is anyone mark them verified
        user.isValid = true;
        user.uniqueString = "";
        await user.save();
        req.flash('success_msg', `L'adresse email a bien été validée !`);
        res.redirect('/');
    }
};

usersController.isValidated = async (req, res, next) => {
    const user = res.locals.user
    const userId = await User.findById(user?.id)
    if (!user) {
        req.flash('error_msg', `Vous avez été déconnecté !`);
        res.redirect('/users/signin');
    } else if (userId.isValid === false) {
        req.flash('error_msg', `L'adresse email n'a pas encore été validée !`);
        res.redirect('/users/signin');
    } else {
        return next();
    }
    // ANCIEN CODE, LE TEMPS DE VOIR SI LE NOUVEAU TIENT MIEUX LA ROUTE
    // if (user === null || user.id === null) {
    //     req.flash('error_msg', `Vous avez été déconnecté !`); // TODO if pas connecté
    //     res.redirect('/users/signin');
    // }
    // const userId = await User.findById(user.id); // TODO Voir si ça fonctionne avec else if
    // if (userId === null || userId.isValid === false) {
    //     req.flash('error_msg', `L'adresse email n'a pas encore été validée !`);
    //     res.redirect('/users/signin');
    // }
    // return next();
}

usersController.renderSignInForm = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        req.flash('info_msg', `Vous êtes déjà connecté !`);
        res.redirect('back');
    } else {
        res.render('users/signin', {referer: req.headers.referer.slice(21)});
    }
};

usersController.signIn = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/',                                         // TODO Double 'back' => redirect to 'referer'
    failureFlash: true
}), (req, res, next) => {
    console.log('0');
    if ( req.method == 'POST' && req.url == '/users/signin' ) {
        if ( req.body.rememberme ) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            console.log('1');
        } else {                                                  // TODO checkbox rester connecté avec cookie = 1 mois
            req.session.cookie.expires = false;
            console.log('2');
        }
    }
    next();
};

usersController.renderEditForm = async (req, res) => {
    const user = await User.findById(req.params.id).lean();
    res.render('users/profile', { user });
};

usersController.updateUser = async (req, res, next) => {
    const errors = [];
    const { fullname } = req.body;
    const email = req.body.email.toLowerCase();

    if (fullname === "" || email === "" ) {
        errors.push({text: `Au moins l'un des champs est vide !`});
    } else if (fullname.length < 3) {
        errors.push({text: 'Le nom est trop court !'});
    } else if (fullname.length > 30) {
        errors.push({text: 'Le nom est trop long !'});
    } else if (email.length < 8) {
        errors.push({text: `L'adresse email est trop courte !`});
    } else if (email.length > 40) {
        errors.push({text: `L'adresse email est trop longue !`});
    } else if (!validator.isEmail(email)) {
        errors.push({text: `L'adresse email n'est pas conforme !`});
    }
    if (errors.length > 0) {
        let { fullname, email} = req.user;
        res.render('users/profile', {
            errors,
            fullname,
            email,
        })
    } else {
        const username = await User.findOne({fullname: fullname});
        if (username && username.fullname != req.user.fullname) {
            errors.push({text: `Ce nom est déjà utilisé !`});
            res.render('users/profile', {
                errors,
                fullname,
                email,
            })
        } else {
            let emailUser = await User.findOne({email: email});
            if (emailUser && emailUser.email != req.user.email) {
                errors.push({text: `Cet email est déjà utilisé !`});
                res.render('users/profile', {
                    errors,
                    fullname,
                    email,
                })
            } else {
                await User.findByIdAndUpdate(req.params.id, { fullname: fullname, email: email });
                req.flash('success_msg', `L'utilisateur a bien été mis à jour !`);
                res.redirect('/');
            }
        }
    }
};

usersController.renderChangePasswordForm = async (req, res) => {
    const user = await User.findById(req.params.id).lean();
    res.render('users/change-password', { user });
};

usersController.changePassword = async (req, res) => {
    const errors = [];
    let { actual_password, password, confirm_password } = req.body;
    const user = await User.findById(req.params.id).lean();
    const match = await bcrypt.compare(actual_password, user.password);
    const matchNewPassword = await bcrypt.compare(password, user.password);

    if (actual_password === "" || password === "" || confirm_password === "" ) {
        errors.push({text: `Au moins l'un des champs est vide !`});
    } else if (!match) {
        errors.push({text: `Le mot de passe actuel ne correspond pas !`});
    } else if (!/\d/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins un chiffre !'});
    } else if (!/[a-z]/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins une minuscule !'});
    } else if (!/[A-Z]/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins une majuscule !'});
    } else if (!/[!@#\$%\^&\*]/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins un caractère spécial !'});
    } else if (password.length < 8) {
        errors.push({text: 'Le nouveau mot de passe est trop court !'});
    } else if (password.length > 15) {
        errors.push({text: 'Le nouveau mot de passe est trop long !'});
    } else if (matchNewPassword) {
        errors.push({text: `Le nouveau mot de passe doit être différent de l'ancien !`});
    } else if (password != confirm_password) {
        errors.push({text: 'Les mots de passe ne correspondent pas !'});
    }
    if (errors.length > 0) {
        res.render('users/change-password', {
            errors,
            user
        })
    } else {
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(req.params.id, { password: newPassword });
        req.flash('success_msg', `Le mot de passe a bien été mis à jour ! Veuillez vous reconnecter !`);
        res.redirect('/users/signin');
    }
};

usersController.forgotPasswordForm = (req, res) => {
    res.render('users/forgot-password');
};

usersController.forgotPasswordCheckEmail = async (req, res) => {
    const errors = [];
    const email = req.body.email.toLowerCase();
    if (email === "" ) {
        errors.push({text: `Veuillez indiquer une adresse email`});
    } else if (email.length < 8) {
        errors.push({text: `L'adresse email est trop courte !`});
    } else if (email.length > 40) {
        errors.push({text: `L'adresse email est trop longue !`});
    } else if (!validator.isEmail(email)) {
        errors.push({text: `L'adresse email n'est pas conforme !`});
    }
    if (errors.length > 0) {
        let { fullname, email} = req.user;
        res.render('users/forgot-password', {
            errors,
            email,
        })
    } else {
        let emailUser = await User.findOne({email: email});
        if (!emailUser) {
            errors.push({text: `L'adresse email est introuvable !`});
            res.render('users/forgot-password', {
                errors,
                email,
            });
        } else {
            const imgLogo = '/public/img/logo.png'
            const uniqueString = randStringCheckEmail();
            await User.findByIdAndUpdate(emailUser.id, { uniqueString: uniqueString });
            sendEmailCheckEmail(email, uniqueString, imgLogo);
            req.flash('info_msg', 'Un email pour réinitialiser votre mot de passe vous a été envoyé !');
            res.redirect('/');
        }
    }
};

const randStringCheckEmail = () => {
    // Considering a 8 length string
    const len = 8;
    let randStr = '';
    for (let i=0; i<len; i++) {
        //ch = a number between 1 to 10
        const ch = Math.floor((Math.random() * 10) + 1);
        randStr += ch;
    }
    return randStr;
};

const sendEmailCheckEmail = (email, uniqueString, imgLogo) => {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 't.audouin@gmail.com',
            pass: 'tlyjndpyrncrydvg'
        },
    });

    const mailOptions = {
        from: `Lorem Ipsum <${EMAIL_USER}> `,
        to: email,
        subject: 'Réinitialisation du mot de passe',
        html: `<div style="text-align: center;">
            <img src="https://zupimages.net/up/22/51/ju54.png" alt="${imgLogo}" style="border-radius: 50%; width: 100px">
        </div>
        <p style="text-align: center;">Bonjour <strong>${email}</strong>,</p>
        <hr>
        <p style="text-align: center;">
            Cliquez sur ce <a href="${WEBSITE_HOST}:${WEBSITE_PORT}/users/check-email/${uniqueString}" style="text-decoration:none"><strong>lien</strong></a> réinitialiser votre mot de passe !
        </p>
  </video>
  `
    };

    transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + res.response);
        }
    })
}

usersController.verifyEmailResetEmail = async (req, res) => {
    // getting the string
    const { uniqueString } = req.params;
    // Check is there is anyone with this string
    const user = await User.findOne({uniqueString: uniqueString});
    if (!user) {
        req.flash('error_msg', `L'utilisateur n'a pas été trouvé !`);
        res.redirect('/');
    } else {
        // If there is anyone mark them verified
        res.redirect(`/users/reset-password/${uniqueString}`);
    }
};

usersController.resetPasswordForm = async (req, res) => {
    const user = await User.findOne(req.params).lean();
    res.render('users/reset-password', { user });
};

usersController.resetPassword = async (req, res) => {
    const errors = [];
    let { password, confirm_password } = req.body;
    const user = await User.findOne(req.params).lean();
    const matchNewPassword = await bcrypt.compare(password, user.password);

    if ( password === "" || confirm_password === "" ) {
        errors.push({text: `Au moins l'un des champs est vide !`});
    } else if (!/\d/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins un chiffre !'});
    } else if (!/[a-z]/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins une minuscule !'});
    } else if (!/[A-Z]/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins une majuscule !'});
    } else if (!/[!@#\$%\^&\*]/.test(password)) {
        errors.push({text: 'Le nouveau mot de passe doit contenir au moins un caractère spécial !'});
    } else if (password.length < 8) {
        errors.push({text: 'Le nouveau mot de passe est trop court !'});
    } else if (password.length > 15) {
        errors.push({text: 'Le nouveau mot de passe est trop long !'});
    } else if (matchNewPassword) {
        errors.push({text: `Le nouveau mot de passe doit être différent de l'ancien !`});
    } else if (password != confirm_password) {
        errors.push({text: 'Les mots de passe ne correspondent pas !'});
    }
    if (errors.length > 0) {
        res.render('users/reset-password', {
            errors,
            user
        })
    } else {
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(password, salt);
        let uniqueString = "";
        await User.findByIdAndUpdate(user.id, { password: newPassword, uniqueString: uniqueString });
        req.flash('success_msg', `Le mot de passe a bien été mis à jour ! Veuillez vous reconnecter !`);
        res.redirect('/users/signin');
    }
};

usersController.renderUsers = async (req, res) => {
    const users = await User.find().sort({fullname: 'desc'}).lean();
    res.render('admin/users/all-users', { users });
};

usersController.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, User) => {
        if (err) {
            console.log(`Erreur lors de la suppression de l'utilisateur :` + err);
        } else {
            req.flash('success_msg', `L'utilisateur a bien été supprimé !`);
            res.redirect("/users/signup");
        }
    })
};

usersController.deleteUserByUser = (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, User) => {
        req.logout((err) => {
            if (err) {
                console.log(`Erreur lors de la suppression de l'utilisateur :` + err);
                req.flash('error_msg', `Erreur lors de la suppression de votre compte utilisateur !`);

            } else {
                req.flash('success_msg', `Votre compte utilisateur a bien été supprimé !`);
                res.redirect('/');
            }
        })
    })
};

usersController.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success_msg', 'Vous êtes bien déconnecté !');
        res.redirect('/users/signin');
    });

};

module.exports = usersController;