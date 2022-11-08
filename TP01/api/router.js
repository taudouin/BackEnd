const express = require('express')
const router = express.Router()

const index = require('./controllers/index')
const article = require('./controllers/article')
const createArticle = require('./controllers/create_article')
const inscription = require('./controllers/inscription')
const login = require('./controllers/login')
const welcome = require('./controllers/welcome')
const successArticle = require('./controllers/success_article')


router.route('/')
    .get(index.get)

router.route('/article')
    .get(article.get)

router.route('/create_article')
    .get(createArticle.get)

router.route('/inscription')
    .get(inscription.get)

router.route('/login')
    .get(login.get)

router.route('/welcome')
    .get(welcome.get)

router.route('/success_article')
    .get(successArticle.get)

module.exports = router
