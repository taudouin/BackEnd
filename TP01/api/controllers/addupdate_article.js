const mongoose = require('mongoose');
const Article = mongoose.model('Article')

module.exports = {
    get: (req, res) => {
        res.render('addupdate_article')
    },

    post: (req, res) => {
        if (req.body._id == '')
            insertArticle(req, res)
        else
            updateArticle(req, res)
    }
}

function insertArticle(req, res) {
    let article = new Article() 

    article.title = req.body.title
    article.author = req.body.author
    article.content = req.body.content
    article.formFile = req.body.formFile

    article.save((err, doc) => {
        if (!err)
            res.redirect('/liste_articles')
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("addupdate_article", {
                    viewTitle: "Create Article",
                    article: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    })
}

function updateArticle(req, res) {
    Article.updateOne({ _id: req.body._id}, req.body, { new:true }, (err, doc) => {
        if (!err) {
            res.redirect('liste_articles')
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("addupdate_article", {
                    viewTitle: 'Update Article',
                    employee: req.body
                });
            }
            else
                console.log('Error during record edit : ' + err);
        }
    })
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'title':
                body['titleError'] = err.errors[field].message;
                break;
            case 'author':
                body['authorError'] = err.errors[field].message;
                break;
            case 'content':
                body['contentError'] = err.errors[field].message;
                break;
            case 'formFile':
                body['formFileError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}