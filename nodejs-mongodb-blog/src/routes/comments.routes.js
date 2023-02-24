const { Router } = require('express');
const router = Router();

const {
    createComment,
    deleteComment,
    updateComment,
} = require('../controllers/comments.controller');

const { isValidated } = require('../controllers/users.controller');

const { isAuthenticated } = require('../helpers/auth');

 // Create comment
router.post('/article/:id', isValidated, isAuthenticated, createComment);

// Update one comment
router.post('/article/comment/:id', isValidated, isAuthenticated, updateComment);

// Delete one comment
router.get('/article/comment/:id', isValidated, isAuthenticated, deleteComment);

module.exports = router;