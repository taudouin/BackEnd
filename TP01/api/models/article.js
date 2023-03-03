const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
    },
    content:{
        type: String,
    },
    formFile:{
        type: String,
    },
})

mongoose.model('Article', ArticleSchema)