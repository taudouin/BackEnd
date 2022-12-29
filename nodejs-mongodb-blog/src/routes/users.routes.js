const { Router } = require('express');
const router = Router();

const {
    renderSignUpForm,
    renderSignInForm,
    signUp,
    signIn,
    logout,
    renderEditForm,
    updateUser,
    renderUsers,
    deleteUser,
    verifyEmail,
    isValidated,
    renderChangePasswordForm,
    changePassword,
    deleteUserByUser,
    forgotPasswordForm,
    forgotPasswordCheckEmail,
    verifyEmailResetEmail,
    resetPasswordForm,
    resetPassword,
} = require('../controllers/users.controller');

const {isAuthenticated} = require('../helpers/auth');

// New users
router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', signUp);

// All users
router.get('/admin/users/all-users', isValidated, isAuthenticated, renderUsers);

// Log in
router.get('/users/signin', renderSignInForm);
router.post('/users/signin', signIn);

// Verify email user
router.get('/users/verify/:uniqueString', verifyEmail)

// Edit user
router.get('/users/profile/:id', isValidated, isAuthenticated, renderEditForm);
router.post('/users/profile/:id', isValidated, isAuthenticated, updateUser);
    // Change password
router.get('/users/change-password/:id', renderChangePasswordForm);
router.post('/users/change-password/:id', changePassword);
    // Forgot password
router.get('/users/forgot-password', forgotPasswordForm);
router.post('/users/forgot-password', forgotPasswordCheckEmail);
    // Verify email before reset password
router.get('/users/check-email/:uniqueString', verifyEmailResetEmail);
    // Reset password
router.get('/users/reset-password/:uniqueString', resetPasswordForm);
router.post('/users/reset-password/:uniqueString', resetPassword);

// Delete user
    // By the admin
router.get('/users/delete/:id', isValidated, isAuthenticated, deleteUser);
    // By the user
router.get('/users/delete-user/:id', isValidated, isAuthenticated, deleteUserByUser);

// Log out
router.get('/users/logout', logout);

module.exports = router;deleteUserByUser