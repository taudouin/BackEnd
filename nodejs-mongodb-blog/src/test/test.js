const Article = require('../models/article.model');
const assert = require('assert');

describe('crud  article', () => {
    it('article créé et trouvé', () => {
        const test =  new Article({
            title: 'testArticle',
            content: 'testContent',
            description: 'testDescription',
            user: '0123456789',
            author: 'testAuthor',
            formFile: 'img.jpg'
        });
        console.log(test);
        test.save().then(() => {
            assert(test.isNew);
            done();
         });
    }),

    it('article effacé et non trouvé', () => {
        const article = Article.findOneAndRemove({title: 'testArticle'})
        .lean()
        .then(() => {
            assert(article.title === 'testArticle');
            done()
        });
    });
});