const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const Handlebars = require('handlebars');
const helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const UNIQUE_TOKEN = process.env;
const MomentHandler = require('handlebars.moment');
const back = require('express-back');
const paginate = require('handlebars-paginate');

const cspConfig = {
    directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://cookieconsent.popupsmart.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cookieconsent.popupsmart.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://cookieconsent.popupsmart.com']
    }
};

// Initializations
const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.WEBSITE_PORT || 8081 );
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs',
}))
app.set('view engine', 'hbs')

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: `${UNIQUE_TOKEN}`,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'strict',
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet.contentSecurityPolicy(cspConfig));
app.use(flash());
app.use(back());

// RegisterHelpers
MomentHandler.registerHelpers(Handlebars);
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 == v2) {
        return options.fn(this);
    }
    return options.inverse(this);
  });
Handlebars.registerHelper('ifDiff', function (v1, v2, options) {
    if (v1 < v2) {
        return options.fn(this);
    }
    return options.inverse(this);
  });

Handlebars.registerHelper('ifAdmin', function (v1, options) {
    let v2 = 'admin';
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('paginate', paginate);

// Function to generate CSRF Token
function generateCsrfToken() {
    return crypto.randomBytes(16).toString('hex');
}

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.info_msg = req.flash('info_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.connect = req.session.passport;
    res.locals.csrf = req.session.csrfToken || (req.session.csrfToken = generateCsrfToken());
    next();
});

// Routes
app.use(require('./routes/articles.routes'));
app.use(require('./routes/comments.routes'));
app.use(require('./routes/contact.routes'));
app.use(require('./routes/users.routes'));

// Static Files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img', 'uploads')));

app.use((req, res) => {
    res.status(404).render('404');
});

module.exports = app;