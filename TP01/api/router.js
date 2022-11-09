const express = require('express')
const router = express.Router()

const index = require('./controllers/index')
const article = require('./controllers/article')
const createArticle = require('./controllers/create_article')
const inscription = require('./controllers/inscription')
const login = require('./controllers/login')



router.route('/')
    .get(index.get)

router.route('/article')
    .get(article.get)

router.route('/create_article')
    .get(createArticle.get)
    .post(createArticle.post)

router.route('/inscription')
    .get(inscription.get)
    .post(inscription.post)

router.route('/login')
    .get(login.get)


module.exports = router
