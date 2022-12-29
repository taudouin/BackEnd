const nodemailer = require('nodemailer');
const validator = require('validator');

const { EMAIL_SMTP_SERVER, EMAIL_USER, EMAIL_PASSWORD, EMAIL_TO } = process.env;

const contactController = {};

contactController.renderContactForm = (req, res) => {
    res.render('contact')
};

contactController.sendContactForm = (req, res) => {

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 't.audouin@gmail.com',
            pass: 'tlyjndpyrncrydvg'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    // Message object
    const errors = [];
    const { name, subject, content } = req.body;
    const email = req.body.email.toLowerCase();

    if (name === "" || email === "" || subject === "" || content === "" ) { // TODO regex name subject
        errors.push({text: `Au moins l'un des champs est vide !`});
    } else if (name.length < 3) {
        errors.push({text: 'Le nom est trop court !'});
    } else if (name.length > 30) {
        errors.push({text: 'Le nom est trop long !'});
    } else if (email.length < 8) {
        errors.push({text: `L'adresse email est trop courte !`});
    } else if (email.length > 40) {
        errors.push({text: `L'adresse email est trop longue !`});
    } else if (!validator.isEmail(email)) {
        errors.push({text: `L'adresse email n'est pas conforme !`});
    } else if (subject.length < 3) {
        errors.push({text: `Le sujet du message est trop court !`});
    } else if (subject > 40) {
        errors.push({text: `Le sujet du message est trop long !`});
    } else if (content.length < 10) {
        errors.push({text: `Le contenu du message est trop court !`});
    } else if (content > 500) {
        errors.push({text: `Le contenu du message est trop long !`})
    }
    if (errors.length > 0) {
        res.render('contact', {
            errors,
            name,
            email,
            subject,
            content
        })
    } else {
        const mailOptions = {
            from: `<${EMAIL_USER}> ${name} ${email}`,
            to: EMAIL_TO,
            subject: `${subject}`,
            text: `${content}`
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
                // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                req.flash('success_msg', `Le message a bien été envoyé !`);
                res.redirect('back');
            }
        })
    }
}

module.exports = contactController;