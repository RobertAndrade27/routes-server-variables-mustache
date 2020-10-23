exports.UserMiddleware = (req, res, next) => {

    let info = {name:'Rick', id:123}
    req.userInfo = info;
    next();
};


exports.index = (req, res)=>{
    let obj ={
        paginatit:'INICIO DE UM SONHO',
        userInfo:req.userInfo

    };

    res.render('home', obj);

}