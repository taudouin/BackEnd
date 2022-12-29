const { Router } = require('express');
const router = Router();

const {
    createComment,
    deleteComment,
    updateComment,
 } = require('../controllers/comments.controller');

 // Create comment
router.post('/article/:id', createComment); // TODO isAuthenticated

// Update one comment
router.post('/article/comment/:id', updateComment); // TODO isAuthenticated

// Delete one comment
router.get('/article/comment/:id', deleteComment); // TODO isAuthenticated

module.exports = router;