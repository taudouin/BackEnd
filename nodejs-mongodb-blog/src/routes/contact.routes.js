const { Router } = require('express');
const router = Router();

const { renderContactForm,
        sendContactForm,
     } = require('../controllers/contact.controller');

router.get('/contact', renderContactForm);
router.post('/contact', sendContactForm);

module.exports = router;