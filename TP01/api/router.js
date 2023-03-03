const express = require('express')
const router = express.Router()

const index = require('./controllers/index')
const article = require('./controllers/article')
const addUpdateArticle = require('./controllers/addupdate_article')
const inscription = require('./controllers/inscription')
const login = require('./controllers/login')
const listeArticles = require('./controllers/liste_articles')



router.route('/')
    .get(index.get)

router.route('/article')
    .get(article.get)

router.route('/addupdate_article')
    .get(addUpdateArticle.get)
    .post(addUpdateArticle.post)

router.route('/:id')
    .get(addUpdateArticle.get)

router.route('/inscription')
    .get(inscription.get)
    .post(inscription.post)

router.route('/login')
    .get(login.get)

router.route('/liste_articles')
    .get(listeArticles.get)

module.exports = router
