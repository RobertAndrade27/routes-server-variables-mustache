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
        posts: [],
        tags: [],
        tag: ''
    };

    responseJson.tag =req.query.t;

    const tags = await Post.getTagsList();
    for(let i in tags) {
        if(tags[i]._id ==responseJson.tag) {
            tags[i].class = "selected";
        }
    }
    responseJson.tags = tags;

    console.log(tags);
    
    const posts = await Post.find();
    responseJson.posts = posts;

    res.render('home', responseJson);
}


