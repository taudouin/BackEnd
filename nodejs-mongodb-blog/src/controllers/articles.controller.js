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

articlesController.deleteArticle = async (req, res) => {
    const image = await Article.findById(req.params.id).lean();
    const directoryPath = 'src/public/img/uploads/';
    const filenameImg = image.formFile;
    fs.unlink(directoryPath + filenameImg, (err) => {
        if (err) {
            console.log(`Error :` + err);
            return;
        }
    })
    await Comment.deleteMany({articleId: req.params.id}).lean();
    await Article.findByIdAndRemove(req.params.id);
    req.flash('success_msg', `L'article et les commentaires liés ont bien été supprimés !`);
    res.redirect("/admin/articles");
};

articlesController.renderAllArticles = async (req, res) => {
    const perPage = 9; // Number of articles in one page
    const page = req.query.p;
    Article
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({createdAt: 'desc'})
    .lean()
    .exec((err, articles) => {
        Article.countDocuments().lean().exec((err, count) => {
            if (err)
                return next(err)
            if (page > 1) {
                res.render('index', {
                    pagination: {
                        page: page || 1,
                        pageCount: Math.ceil(count / perPage)
                    },
                    articles: articles,
                })
            } else {
                res.render('index', {
                    pagination: {
                        page: page || 1,
                        pageCount: Math.ceil(count / perPage)
                    },
                    articles: articles.splice(3),
                    articlesCarousel: articles.splice(0,3),
                    count
                })
            }
        })
    })
};

articlesController.renderOneArticle = async (req, res) => {
    const article = await Article.findById(req.params.id).lean();
    const perPage = 6; // Number of comments in one page
    const page = req.query.p;
    Comment
    .find({articleId: req.params.id})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .sort({createdAt: 'desc'})
    .lean()
    .exec((err, commentData) => {
        Comment.countDocuments({articleId: req.params.id}).lean().exec((err, count) => {
            if (err)
                return next(err)
            res.render('article', {
                pagination: {
                    page: page || 1,
                    pageCount: Math.ceil(count / perPage)
                },
                commentData,
                article,
                count
            })
         })
    })
};


module.exports = articlesController;