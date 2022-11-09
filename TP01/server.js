//On appele express
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose')

require('dotenv').config()


// bodyParser (ou 'express') pour parser les données des formulaires application/x-www-form-urlencoded
// const urlencodedParser = express.urlencoded({ extended: true });

//initialisation d'express
const app = express();
//on declare le port
const port = 3000;

// Handlebars
// Precise a l'engine quel extension nous allons utilisé. Defintit ensuite le layout utilisé
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }));
// Precise l'extention des vue qui sera utilisé
app.set('view engine', 'hbs');
// Precise le dossier ou sont les vues
app.set('views', './views');

// On crée le lien vers les fichier bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js/')))
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/public', express.static(path.join(__dirname, 'assets')))

const router = require('./api/router');

app.use(express.urlencoded({ extended: false }));

// // Les données obtenues avec POST envoyées vers `/welcome` sont parsées avec 'body-parser' ou 'express'
// app.post("/welcome", urlencodedParser, function(req, res) {
//     console.log(req.body);
//     res.send(`Bienvenue ! Votre email est: '${req.body.email}' et votre mot de passe est: '${req.body.password}'`);
// });


// app.post('/welcome', (req, res) => {
//     res.send({
//         data: req.body
//     })
//     console.log(req.body);
// })

// DataBase
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'database'
})
.then(() => {
    console.log("Connexion à la BDD avec succès");
})
.catch((err) => {
    console.log(err);
})


// app.post('/welcome', (req, res) => {
//     let newUser = new User({
//         email: req.body.email,
//         password: req.body.password,
//     })
//     newUser.save();
//     res.redirect('/inscription')
// })

const ArticleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    formFile:{
        type: String,
    },
})

const Article = mongoose.model('Article', ArticleSchema)

app.post('/success_article', (req, res) => {
    let newArticle = new Article({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        formFile: req.body.formFile
    })
    newArticle.save();
    res.redirect('/create_article')
})

app.use("/", router)

// On lance l'ecoute sur le port déclaré plus haut
app.listen(port, () => {
    console.log(`le serveur ecoute à l'adresse http://localhost:${port}`);
})