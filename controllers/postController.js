const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.add = (req, res) => {
    res.render('postAdd');    
};


exports.consult = async (req, res) => {
    let responseJson ={
        paginatit:'PROGRAMAS INICIAIS',
        posts: []
      
    };
    const posts = await Post.find();
    responseJson.posts = posts;

    res.render('consultaPost', responseJson);
    //res.render('consultarPost');    
};

exports.addAction = async (req, res) => {
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
    const post = new Post (req.body);

    try {
        await post.save();
    } catch(error) {
        req.flash('error', 'Erro: '+error.message);
        return res.redirect('/post/add');
 }

    req.flash('success', 'Post salvo com sucesso!');
    
    res.redirect('/');

};
       
exports.edit = async (req, res) => {
    //1. Pegar as informações do post
    const post = await Post.findOne ({ slug:req.params.slug });
    //2. Carrega o formulario em edição
    res.render('postEdit', { post });
};
   
exports.editAction = async (req, res) => {
req.body.slug =require('slug')(req.body.title, {lower:true});

    //procurar item enviado.
    try {
    const post = await Post.findOneAndUpdate(
        {slug:req.params.slug }, 
        req.body,
        {
            new:true,
            runValidators:true
        }

    );
    }   catch(error) {
        req.flash('errpr', 'Ocorreu um erro');
        return res.redirect('/post/'+req.params.slug+'/edit');
    }

    req.flash('success', 'Post atualizado com sucesso!');
    //Pegar os dados e atualizar

    res.redirect('/');

};
