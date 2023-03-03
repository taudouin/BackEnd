//On appele express
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose')

require('dotenv').config()
require('./api/models/article');

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

app.use(express.urlencoded({ extended: true }));

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

// app.use('/liste_articles', (req, res) => {
//      Article.find({})
//          .then(articles => res.status(200).json(articles))
//          .catch(err => res.status(400).json({err}))
// })

app.use("/", router)

// On lance l'ecoute sur le port déclaré plus haut
app.listen(port, () => {
    console.log(`le serveur ecoute à l'adresse http://localhost:${port}`);
})