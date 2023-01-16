const { Router } = require('express');
const router = Router();

const {
    createComment,
    deleteComment,
    updateComment,
 } = require('../controllers/comments.controller');

 const {isAuthenticated} = require('../helpers/auth');

 // Create comment
router.post('/article/:id', isAuthenticated, createComment); // TODO isAuthenticated

// Update one comment
router.post('/article/comment/:id', isAuthenticated, updateComment); // TODO isAuthenticated

// Delete one comment
router.get('/article/comment/:id', isAuthenticated, deleteComment); // TODO isAuthenticated

module.exports = router;