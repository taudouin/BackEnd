const fs = require("fs");

const articlesController = {};

const Article = require('../models/article.model');
const Comment = require('../models/comment.model')

articlesController.renderArticleForm = (req, res) => {
    res.render('admin/articles/new-article')
};

articlesController.createNewArticle = async (req, res) => {
    const errors = [];
    const { title, content, description } = req.body;
    const formFile = req?.file?.filename;
    if (title === "" || content === "" || description === "") {
        errors.push({text: `Au moins l'un des champs est vide !`});
    } else if (title.length < 3) {
        errors.push({text: 'Le titre est trop court !'});
    } else if (title.length > 50) {
        errors.push({text: 'Le titre est trop long !'});
    } else if (content.length < 15) {
        errors.push({text: 'Le contenu est trop court !'});
    } else if (description.length < 3) {
        errors.push({text: 'La description est trop courte !'});
    } else if (description.length > 150) {
        errors.push({text: 'La description est trop longue !'});
    }
    if (errors.length > 0) {
        res.render('admin/articles/new-article', {
            errors,
            title,
            content,
            description
        })
    } else {
        const newArticle = new Article({
            title: title,
            content: content,
            description: description,
            formFile,
        });
        newArticle.user = req.user.id;
        newArticle.author = req.user.fullname;
        await newArticle.save();
        newArticle.id = newArticle._id;
        await newArticle.save();
        req.flash('success_msg', `L'article a bien été créé !`);
        res.redirect('/admin/articles');
    }
};

articlesController.renderArticles = async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'}).lean(); // TODO Pour n'avoir que par 'user' => const articles = await Article.find({user: req.user.id, author:req.user.fullname}).sort({createdAt: 'desc'}).lean();

    res.render('admin/articles/all-articles', { articles });
};

articlesController.renderEditForm = async (req, res) => {
    const article = await Article.findById(req.params.id).lean();
    if (article.user != req.user.id) {
        req.flash('error_msg', `Accès non autorisé !`);
    }
    res.render('admin/articles/edit-article', { article });
};

articlesController.updateArticle = async (req, res, next) => {
    const errors = [];
    const { title, content, description } = req.body;
    const formFile = req?.file?.filename;
    if (title === "" || content === "") {
        errors.push({text: `Au moins l'un des champs est vide !`});
    } else if (title.length < 3) {
        errors.push({text: 'Le titre est trop court !'});
    } else if (title.length > 30) {
        errors.push({text: 'Le titre est trop long !'});
    } else if (content.length < 15) {
        errors.push({text: 'Le contenu est trop court !'});
    } else if (description.length < 3) {
        errors.push({text: 'La description est trop courte !'});
    } else if (description.length > 150) {
        errors.push({text: 'La description est trop longue !'});
    }
    if (errors.length > 0) {
        const article = await Article.findById(req.params.id).lean()
        res.render('admin/articles/edit-article', {
            errors,
            article
        })
    } else {
        await Article.findById(req.params.id, (err, Article) => {
            if (!err) {
                const directoryPath = 'src/public/img/uploads/';
                const filenameImg = Article.formFile;
                fs.unlink(directoryPath + filenameImg, (err) => {
                    console.log(`Error:` + err);
                })
            }
        })
        await Article.findByIdAndUpdate(req.params.id, { title: title, content: content, description: description, formFile });
        req.flash('success_msg', `L'article a bien été mis à jour !`);
        res.redirect('/admin/articles');
    }
};

articlesController.deleteArticle = (req, res) => {
    Article.findByIdAndRemove(req.params.id, (err, Article) => {
        if (!err) {
          const directoryPath = 'src/public/img/uploads/';
          const filenameImg = Article.formFile;
          fs.unlink(directoryPath + filenameImg, (err) => {
            if (err) {
                console.log(`Error :` + err);
            }
            req.flash('success_msg', `L'article a bien été supprimé !`);
            res.redirect("/admin/articles");
          })
        }
    });
}

articlesController.renderAllArticles = async (req, res) => {
    let articlesCarousel = [];
    const perPage = 15; // Number of articles in one page
    const page = req.query.page;
    Article
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({createdAt: 'desc'})
    .lean()
    .exec((err, articles) => {
        Article.count().exec((err, count) => {
            if (err)
                return next(err)
            res.render('index', {
                current: page,
                pages: Math.ceil(count / perPage),
                articles: articles.splice(3),
                articlesCarousel: articles.splice(0,3),
            });
        });
    });
};

articlesController.renderOneArticle = async (req, res) => {
    const article = await Article.findById(req.params.id).lean();
    const commentData = await Comment.find({articleId: req.params.id}).sort({createdAt: 'desc'}).lean();
    res.render('article', { article, commentData });
};

module.exports = articlesController;