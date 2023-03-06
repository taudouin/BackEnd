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

usersController.signUp = async (req, res) => { // TODO Ajouter question secrète avec réponse
    const errors = [];
    const { fullname, password, confirm_password, isHuman } = req.body;
    const email = req.body.email.toLowerCase();
    const uniqueString = randString(128);
    // if (fullname === "" || email === "" || password === "" || confirm_password === "") {
    //     errors.push({text: `Au moins l'un des champs est vide !`});
    // } else if (fullname.length < 3) {
    //     errors.push({text: 'Le nom est trop court !'});
    // } else if (fullname.length > 30) {
    //     errors.push({text: 'Le nom est trop long !'});
    // } else if (email.length < 8) {
    //     errors.push({text: `L'adresse email est trop courte !`});
    // } else if (email.length > 40) {
    //     errors.push({text: `L'adresse email est trop longue !`});
    // } else if (!validator.isEmail(email)) {
    //     errors.push({text: `L'adresse email n'est pas conforme !`});
    // } else if (!/\d/.test(password)) {
    //     errors.push({text: 'Le mot de passe doit contenir au moins un chiffre !'});
    // } else if (!/[a-z]/.test(password)) {
    //     errors.push({text: 'Le mot de passe doit contenir au moins une minuscule !'});
    // } else if (!/[A-Z]/.test(password)) {
    //     errors.push({text: 'Le mot de passe doit contenir au moins une majuscule !'});
    // } else if (!/[!@#\$%\^&\*]/.test(password)) {
    //     errors.push({text: 'Le mot de passe doit contenir au moins un caractère spécial !'});
    // } else if (password.length < 8) {
    //     errors.push({text: 'Le mot de passe est trop court !'});
    // } else if (password.length > 15) {
    //     errors.push({text: 'Le mot de passe est trop long !'});
    // } else if (password != confirm_password) {
    //     errors.push({text: 'Les mots de passe ne correspondent pas !'});
    // }
    switch (true) {
        case fullname === "" || email === "" || password === "" || confirm_password === "":
            errors.push({text: `Au moins l'un des champs est vide !`});
            break;
        case fullname.length < 3:
            errors.push({text: 'Le nom est trop court !'});
            break;
        case fullname.length > 30:
            errors.push({text: 'Le nom est trop long !'});
            break;
        case email.length < 8:
            errors.push({text: `L'adresse email est trop courte !`});
            break;
        case email.length > 40:
            errors.push({text: `L'adresse email est trop longue !`});
            break;
        case !validator.isEmail(email):
            errors.push({text: `L'adresse email n'est pas conforme !`});
            break;
        case !/\d/.test(password):
            errors.push({text: 'Le mot de passe doit contenir au moins un chiffre !'});
            break;
        case !/[a-z]/.test(password):
            errors.push({text: 'Le mot de passe doit contenir au moins une minuscule !'});
            break;
        case !/[A-Z]/.test(password):
            errors.push({text: 'Le mot de passe doit contenir au moins une majuscule !'});
            break;
        case !/[!@#\$%\^&\*]/.test(password):
            errors.push({text: 'Le mot de passe doit contenir au moins un caractère spécial !'});
            break;
        case password.length < 8:
            errors.push({text: 'Le mot de passe est trop court !'});
            break;
        case password.length > 15:
            errors.push({text: 'Le mot de passe est trop long !'});
            break;
        case password != confirm_password:
            errors.push({text: 'Les mots de passe ne correspondent pas !'});
            break;
        case isHuman != "":
            errors.push({text: 'Vous n\'êtes pas humain !'});
            break;
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
                const csrfToken = req.session.csrfToken;
                const _csrfToken = req.body._csrfToken;
                if (!csrfToken || csrfToken !== _csrfToken) {
                    return res.status(403).render('403');
                }
                const newUser = new User({fullname, email, password, uniqueString, role: 'user'});
                newUser.password = await newUser.encrypPassword(password)
                await newUser.save();
                const imgLogo = '/public/img/logo.png'
                sendEmail(fullname, email, uniqueString, imgLogo);
                req.flash('info_msg', 'Votre inscription a bien été prise en compte ! Un email de confirmation vous a été envoyé !')
                res.redirect('/users/signin');
            }
        }
    }
};

randString = (length) => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const sendEmail = (fullname, email, uniqueString, imgLogo) => {
    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
        host: EMAIL_SMTP_SERVER,
        port: PORT_SMTP_SERVER,
        secure: false,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
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
            <br>
            <p style="overflow-wrap: break-word">
                Si le lien ne fonctionne pas, veuillez recopier ce lien dans votre navigateur :
                <br>
                ${WEBSITE_HOST}:${WEBSITE_PORT}/users/verify/${uniqueString}
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

usersController.renderSignInForm = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        req.flash('info_msg', `Vous êtes déjà connecté !`);
        res.redirect('back');
    } else if (!req.headers.referer) {
        res.render('users/signin')
    } else {
        res.render('users/signin', {referer: req.headers.referer.slice(21)});
    }
};

usersController.signIn = (req, res, next) => {
    const authFunction = passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err);
        } else {
            req.logIn(user, (err) => {
                if (err) {
                    req.flash('error_msg', info.message);
                    res.redirect('/users/signin');
                } else {
                    if (req.body.rememberMe) {
                        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 1 month
                    } else {
                        req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour
                    }
                    if (req.body.referer === '/users/signup' || req.body.referer === '/users/signin') {
                        res.redirect('/')
                    } else {
                        res.redirect(req.body.referer || '/');
                    }
                }
            })
        }
    });
    authFunction(req, res, next);
};

usersController.renderEditForm = async (req, res) => {
    const user = await User.findById(req.params.id).lean();
    const userConnected = res.locals.connect;
    res.render('users/profile', { user, userConnected });
};

usersController.updateUser = async (req, res, next) => {
    const errors = [];
    const { fullname } = req.body;
    const email = req.body.email.toLowerCase();

    switch (true) {
        case fullname === '' || email === '':
            errors.push({text: `Au moins l'un des champs est vide !`});
            break;
        case fullname.length < 3:
            errors.push({text: 'Le nom est trop court !'});
            break;
        case email.length > 30:
            errors.push({text: 'Le nom est trop long !'});
            break;
        case email.length < 8:
            errors.push({text: `L'adresse email est trop courte !`});
            break;
        case email.length > 40:
            errors.push({text: `L'adresse email est trop longue !`});
            break;
        case !validator.isEmail(email):
            errors.push({text: `L'adresse email n'est pas conforme !`});
            break;
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
        if (username && username.fullname != fullname) {
            errors.push({text: `Ce nom est déjà utilisé !`});
            res.render('users/profile', {
                errors,
                fullname,
                email,
            })
        } else {
            const emailUser = await User.findOne({email: email});
            if (emailUser && emailUser.email != email) {
                errors.push({text: `Cet email est déjà utilisé !`});
                res.render('users/profile', {
                    errors,
                    fullname,
                    email,
                })
            } else {
                const csrfToken = req.session.csrfToken;
                const _csrfToken = req.body._csrfToken;
                if (!csrfToken || csrfToken !== _csrfToken) {
                    return res.status(403).render('403');
                }
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

    // if (actual_password === "" || password === "" || confirm_password === "") {
    //     errors.push({text: `Au moins l'un des champs est vide !`});
    // } else if (!match) {
    //     errors.push({text: `Le mot de passe actuel ne correspond pas !`});
    // } else if (!/\d/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins un chiffre !'});
    // } else if (!/[a-z]/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins une minuscule !'});
    // } else if (!/[A-Z]/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins une majuscule !'});
    // } else if (!/[!@#\$%\^&\*]/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins un caractère spécial !'});
    // } else if (password.length < 8) {
    //     errors.push({text: 'Le nouveau mot de passe est trop court !'});
    // } else if (password.length > 15) {
    //     errors.push({text: 'Le nouveau mot de passe est trop long !'});
    // } else if (matchNewPassword) {
    //     errors.push({text: `Le nouveau mot de passe doit être différent de l'ancien !`});
    // } else if (password != confirm_password) {
    //     errors.push({text: 'Les mots de passe ne correspondent pas !'});
    // }

    switch (true) {
        case actual_password === "" || password === "" || confirm_password === "":
            errors.push({text: `Au moins l'un des champs est vide !`});
            break;
        case !match:
            errors.push({text: `Le mot de passe actuel ne correspond pas !`});
            break;
        case !/\d/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins un chiffre !'});
            break;
        case !/[a-z]/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins une minuscule !'});
            break;
        case !/[A-Z]/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins une majuscule !'});
            break;
        case !/[!@#\$%\^&\*]/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins un caractère spécial !'});
            break;
        case password.length < 8:
            errors.push({text: 'Le nouveau mot de passe est trop court !'});
            break;
        case password.length > 15:
            errors.push({text: 'Le nouveau mot de passe est trop long !'});
            break;
        case matchNewPassword:
            errors.push({text: `Le nouveau mot de passe doit être différent de l'ancien !`});
            break;
        case password != confirm_password:
            errors.push({text: 'Les mots de passe ne correspondent pas !'});
            break;
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
        req.logout((err) => {
            if (err) {
                return next(err)
            }
            req.flash('success_msg', `Le mot de passe a bien été mis à jour ! Veuillez vous reconnecter !`);
            res.redirect('/users/signin');
        });
    }
};

usersController.forgotPasswordForm = (req, res) => {
    res.render('users/forgot-password');
};

usersController.forgotPasswordCheckEmail = async (req, res) => {
    const errors = [];
    const email = req.body.email.toLowerCase();
    // if (email === "") {
    //     errors.push({text: `Veuillez indiquer une adresse email`});
    // } else if (email.length < 8) {
    //     errors.push({text: `L'adresse email est trop courte !`});
    // } else if (email.length > 40) {
    //     errors.push({text: `L'adresse email est trop longue !`});
    // } else if (!validator.isEmail(email)) {
    //     errors.push({text: `L'adresse email n'est pas conforme !`});
    // }
    switch (true) {
        case email === "":
            errors.push({text: `Veuillez indiquer une adresse email`});
            break;
        case email.length < 8:
            errors.push({text: `L'adresse email est trop courte !`});
            break;
        case email.length > 40:
            errors.push({text: `L'adresse email est trop longue !`});
            break;
        case !validator.isEmail(email):
            errors.push({text: `L'adresse email n'est pas conforme !`});
            break;
    }
    if (errors.length > 0) {
        let { email} = req.user;
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
            const uniqueString = randStringCheckEmail(128);
            await User.findByIdAndUpdate(emailUser._id, { uniqueString: uniqueString });
            sendEmailCheckEmail(email, uniqueString, imgLogo);
            req.flash('info_msg', 'Un email pour réinitialiser votre mot de passe vous a été envoyé !');
            res.redirect('/');
        }
    }
};

randStringCheckEmail = (length) => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const sendEmailCheckEmail = (email, uniqueString, imgLogo) => {
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: EMAIL_SMTP_SERVER,
        port: PORT_SMTP_SERVER,
        secure: false,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
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
        <br>
        <p style="overflow-wrap: break-word">
            Si le lien ne fonctionne pas, veuillez recopier ce lien dans votre navigateur :
            <br>
            ${WEBSITE_HOST}:${WEBSITE_PORT}/users/check-email/${uniqueString}
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
    const userId = await User.findOne(req.params).lean();
    res.render('users/reset-password', { userId });
};

usersController.resetPassword = async (req, res) => {
    const errors = [];
    let { password, confirm_password } = req.body;
    const userId = await User.findOne(req.params).lean();
    const matchNewPassword = await userId.compare(password, userId.password);

    // if (password === "" || confirm_password === "") {
    //     errors.push({text: `Au moins l'un des champs est vide !`});
    // } else if (!/\d/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins un chiffre !'});
    // } else if (!/[a-z]/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins une minuscule !'});
    // } else if (!/[A-Z]/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins une majuscule !'});
    // } else if (!/[!@#\$%\^&\*]/.test(password)) {
    //     errors.push({text: 'Le nouveau mot de passe doit contenir au moins un caractère spécial !'});
    // } else if (password.length < 8) {
    //     errors.push({text: 'Le nouveau mot de passe est trop court !'});
    // } else if (password.length > 15) {
    //     errors.push({text: 'Le nouveau mot de passe est trop long !'});
    // } else if (matchNewPassword) {
    //     errors.push({text: `Le nouveau mot de passe doit être différent de l'ancien !`});
    // } else if (password != confirm_password) {
    //     errors.push({text: 'Les mots de passe ne correspondent pas !'});
    // }
    switch (true) {
        case password === "" || confirm_password === "":
            errors.push({text: `Au moins l'un des champs est vide !`});
            break;
        case !/\d/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins un chiffre !'});
            break;
        case !/[a-z]/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins une minuscule !'});
            break;
        case !/[A-Z]/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins une majuscule !'});
            break;
        case !/[!@#\$%\^&\*]/.test(password):
            errors.push({text: 'Le nouveau mot de passe doit contenir au moins un caractère spécial !'});
            break;
        case password.length < 8:
            errors.push({text: 'Le nouveau mot de passe est trop court !'});
            break;
        case password.length > 15:
            errors.push({text: 'Le nouveau mot de passe est trop long !'});
            break;
        case matchNewPassword:
            errors.push({text: `Le nouveau mot de passe doit être différent de l'ancien !`});
            break;
        case password != confirm_password:
            errors.push({text: 'Les mots de passe ne correspondent pas !'});
            break;
    }
    if (errors.length > 0) {
        res.render('users/reset-password', {
            errors,
            userId
        })
    } else {
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(password, salt);
        let uniqueString = "";
        await User.findByIdAndUpdate(userId._id, { password: newPassword, uniqueString: uniqueString });
        req.flash('success_msg', `Le mot de passe a bien été mis à jour ! Veuillez vous reconnecter !`);
        res.redirect('/users/signin');
    }
};

usersController.renderUsers = async (req, res) => {
    const perPage = 10; // Number of users in one page
    const page = req.query.p;
    User
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({role: 'asc'})
    .lean()
    .exec((err, users) => {
        User.countDocuments().lean().exec((err, count) => {
            if (err)
                return next(err)
            if (page > 1) {
                res.render('admin/users/all-users', {
                    pagination: {
                        page: page || 1,
                        pageCount: Math.ceil(count / perPage)
                    },
                    users: users,
                })
            } else {
                res.render('admin/users/all-users', {
                    pagination: {
                        page: page || 1,
                        pageCount: Math.ceil(count / perPage)
                    },
                    users: users,
                    count
                })
            }
        })
    })
};

usersController.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, User) => {
        if (err) {
            console.log(`Erreur lors de la suppression de l'utilisateur :` + err);
        } else {
            req.flash('success_msg', `L'utilisateur ${User.fullname} a bien été supprimé !`);
            res.redirect('/admin/users/all-users');
        }
    })
};

usersController.deleteUserByUser = (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, User) => {
        if (err) {
            console.log(`Erreur lors de la suppression de l'utilisateur :` + err);
        } else {
            req.logout((err) => {
                if (err) {
                    console.log(`Erreur lors de la suppression de l'utilisateur :` + err);
                    req.flash('error_msg', `Erreur lors de la suppression de votre compte utilisateur !`);

                } else {
                    req.flash('success_msg', `Votre compte utilisateur ${User.fullname} a bien été supprimé !`);
                    res.redirect('/');
                }
            });
        }
    });
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