module.exports = {
    get: (req, res) => {
        res.render('create_article')
    },

    post: (req, res) => {
        let newArticle = new Article({
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
            formFile: req.body.formFile
        })
        newArticle.save();
        res.redirect('/create_article')
    }
}