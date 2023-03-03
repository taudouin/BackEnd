const mongoose = require('mongoose');
const Article = mongoose.model('Article')

module.exports = {
    get: (req, res) => {
        Article.find((err, docs) => {
            if (!err) {
                res.render('liste_articles', {
                    articleList: docs
                })
            }
            else {
                console.log('Error in retrieving articles list :' + err);
            }
        })
    }
}

