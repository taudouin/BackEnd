const commentsController = {};

const Article = require('../models/article.model');
const Comment = require('../models/comment.model');

commentsController.createComment = async (req, res) => {
    const errors = [];
    const { comment, articleId } = req.body;
    if (comment === "") {
        errors.push({text: `Le commentaire est vide !`});
    } else if (comment.length < 2) {
        errors.push({text: 'Le commentaire est trop court !'});
    }
    if (errors.length > 0) {
        const article = await Article.findById(req.params.id).lean();
        const commentData = await Comment.find({articleId: req.params.id}).sort({createdAt: 'desc'}).lean();
        res.render('article', {
            errors,
            article,
            commentData
        })
    } else {
        const newComment = new Comment({
            comment: comment,
            articleId: articleId,
        });
        const user = res.locals.connect;
        console.log(user.user);
        console.log(req.user._id);
        console.log(req.user.fullname);
        newComment.userId = user.user;
        newComment.user = req.user.fullname;
        await newComment.save();
        req.flash('success_msg', 'Le commentaire a bien été créé !');
        res.redirect(`${newComment.articleId}`);
    }
}

commentsController.updateComment = async (req, res) => { // TODO faire en popup si pas possible
    const errors = [];
    const { comment } = req.body;
    if (comment === "") {
        errors.push({text: `Le commentaire est vide !`});
    } else if (comment.length < 3) {
        errors.push({text: 'Le commentaire est trop court !'});
    } else if (comment.length > 250) {
        errors.push({text: 'Le commentaire est trop long !'});
    }
    if (errors.length > 0) {
        const commentId = await Comment.findById(req.params.id)
        const article = await Article.findById(commentId.articleId).lean();
        const commentData = await Comment.find({articleId: article._id}).sort({createdAt: 'desc'}).lean();
        res.render('article', {
            errors,
            article,
            commentData
        })
    } else {
        await Comment.findByIdAndUpdate(req.params.id, { comment: comment });
        req.flash('success_msg', `Le commentaire a bien été mis à jour !`);
        res.redirect('back');
    }
}

commentsController.deleteComment = async (req, res) => {
    Comment.findByIdAndRemove(req.params.id, (err, Comment) => {
        if (err) {
            console.log('Error:' + err);
        } else {
            req.flash('success_msg', `Le commentaire a bien été supprimé !`);
            res.redirect('back');
          }
    })
}

module.exports = commentsController;