const Article = require('../models/article.model');
const assert = require('assert');

describe('crud  article', () => {
    it('article created', () => {
        const article =  new Article({
            title: 'testArticle',
            content: 'testContent',
            description: 'testDescription',
            user: '63cbe77e1550b903d3430d2d',
            author: 'testAuthor',
            formFile: 'img.jpg'
        });
        console.log(article);
        article.save().then(() => {
            done();
         })
    });
    it('article find & updated', () => {
        const article = Article.findOne({title: 'testArticle'}).lean();
        console.log(article._conditions);
        article.updateOne({
            title: 'titleUpdated'
        });
        console.log(article._update);
        article.then(() => {
            done();
        });
    });
    it('article removed', () => {
        const article = Article.findOne({title: 'titleUpdated'}).lean();
        console.log(article._conditions);
        article.remove().then(() => {
            assert(article === undefined);
            done();
        })
    });
});