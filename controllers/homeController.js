const mongoose = require('mongoose');
const Post  =  mongoose.model('Post');


exports.UserMiddleware = (req, res, next) => {

    let info = {name:'uSER', id:123}
    req.userInfo = info;
    next();
};


exports.index = async (req, res)=>{
    let  responseJson = {
        paginatit:'HOME',
        posts: []
    };
    const posts = await Post.find();
    responseJson.posts = posts;

    res.render('home', responseJson);
}


