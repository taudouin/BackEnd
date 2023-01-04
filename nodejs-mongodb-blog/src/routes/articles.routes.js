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
const hasAccess = require('../helpers/hasAccess');

// New article
router.get('/admin/articles/add', isValidated, isAuthenticated, hasAccess('admin'), renderArticleForm);
router.post('/admin/articles/new-article',upload.single("formFile"), isValidated, isAuthenticated, hasAccess('admin'), createNewArticle);

// Get all articles for admin
router.get('/admin/articles', isValidated, isAuthenticated, hasAccess('admin'), renderArticles);

// Edit article
router.get('/admin/articles/edit/:id', isValidated, isAuthenticated, hasAccess('admin'), renderEditForm);
router.post('/admin/articles/edit/:id', upload.single("formFile"), isValidated, isAuthenticated, hasAccess('admin'), updateArticle);

// Delete article
router.get('/admin/articles/delete/:id', isValidated, isAuthenticated, hasAccess('admin'), deleteArticle);

// All articles for visitors
router.get('/', renderAllArticles);

// One article for visitors
router.get('/article/:id', renderOneArticle);

module.exports = router;