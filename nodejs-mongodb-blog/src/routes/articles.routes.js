const { Router } = require('express');
const router = Router();

const {
    renderArticleForm,
    createNewArticle,
    renderArticles,
    renderEditForm,
    updateArticle,
    deleteArticle,
    renderAllArticles,
    renderOneArticle,
 } = require('../controllers/articles.controller');

const { isValidated } = require('../controllers/users.controller');

const upload = require('../middlewares/multer.middleware');

const {isAuthenticated} = require('../helpers/auth');

// New article
router.get('/admin/articles/add', isValidated, isAuthenticated, renderArticleForm);
router.post('/admin/articles/new-article',upload.single("formFile"), isValidated, isAuthenticated, createNewArticle);

// Get all articles
router.get('/admin/articles', isValidated, isAuthenticated, renderArticles);

// Edit article
router.get('/admin/articles/edit/:id', isValidated, isAuthenticated, renderEditForm);
router.post('/admin/articles/edit/:id', upload.single("formFile"), isValidated, isAuthenticated, updateArticle);

// Delete article
router.get('/admin/articles/delete/:id', isValidated, isAuthenticated, deleteArticle);

// All articles for visitors
router.get('/', renderAllArticles);

// One article for visitors
router.get('/article/:id', renderOneArticle);

module.exports = router;