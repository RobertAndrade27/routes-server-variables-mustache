const mongoose = require ('mongoose');
const slug = require ('slug');
mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,  
        required:'Digite o titulo' //obrigatorio
    },
    slug:String,
    body:{
        type:String,
        trim:true
    },
    tags:[String]
    
});

postSchema.pre('save', function(next) {
    if(this.isModified('title')) {
        this.slug = slug( this.title );
    }

    next();
})


module.exports = mongoose.model('Post', postSchema);

/*
Titulo
Corpo
Tags
Slug
*/