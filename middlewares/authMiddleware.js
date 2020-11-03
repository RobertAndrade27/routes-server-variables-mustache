module.exports.isLogged = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Ops! Vai pra onde, minha filha?')
        res.redirect('/users/login');
        return;
    }

    next();
}