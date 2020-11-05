const User = require ('../models/User');
const crypto = require ('crypto');
const mailHandler = require('../handlers/mailHandler');

exports.login = (req, res) => {
        res.render('login');
};

exports.loginAction =(req, res) => {
        const auth = User.authenticate();

        auth(req.body.email, req.body.password, (error, result) =>{
                if(!result){
                        req.flash('error', 'Email ou senha incorretos!');
                        res.redirect('/users/login');
                        return;
                }

                req.login(result, ()=>{});

                req.flash('success', 'Login efetuado com sucesso!');
                res.redirect('/')
        });
};

exports.register = (req, res) => {
        res.render('register')
};

exports.registerAction = (req, res) => {
        const newUser = new User (req.body);
        User.register(newUser, req.body.password, (error) =>{
                if(error) {
                req.flash('error', 'Ocorreu um erro, tente novamente mais tarde.');
                res.redirect('/users/register');
                return;
        }
        req.flash('success', 'Registro efetuado com sucesso. Faça o login.')
        res.redirect('/users/login');
        });

};

exports.logout = (req, res) => {
        req.logout();
        res.redirect('/');
}

exports.profile = (req,res) => {
        
        res.render('profile', {});
}

exports.profileAction = async (req, res) =>{
        try {
        const user = await User.findOneAndUpdate(
                { _id:req.user._id },
                { name:req.body.name, email:req.body.email },
                { new: true, runValidators:true}
        );
        }catch (e) {

        req.flash('error', 'Ocorreu algum erro!'+e.message);
        res.redirect('/profile');
        return;

        }
        req.flash('success', 'Dados atualizados com sucesso!');
        res.redirect('/');

};

exports.forget = (req, res) => {
        res.render('forget');
}

exports.forgetAction = async(req, res) => {
        //1. Verificar se o user existe
        const user = await User.findOne({email:req.body.email}).exec();
        if(!user){
                req.flash('error', 'Email não cadastrado');
                res.redirect('/users/forget');
                return;
        }

        //2. gerar um token (com data de expiração) e salvar no banco 
        user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordExpires = Date.now() + 3600000; //1hora

        await user.save();

        //3. Gerar link com token para trocar a senha
        const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;

        const to = `${user.name}<${user.email}>`;
       
        const html = `Testando email com link: <br/><a href="${resetLink}">Resetar Sua Senha</a>`;
        const text = `Testando email com link: ${resetLink}`;
        //4. Enviar link para o email.
        mailHandler.send({
                to,
                subject:'Reset de senha',
                html,
                text
        });

        //5. Usuario vai acessar o link e trocar a senha.
        req.flash('success', 'Enviamos um email para redefinir a senha ');
        res.redirect('/users/login');


}

exports.forgetToken = async (req, res) => {
        const user = await User.findOne ({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
        }).exec();

        if(!user){
                req.flash('error', 'Token expirado!');
                res.redirect('/users/forget');
                return;
        }
        res.render('forgetPassword');
};

exports.forgetTokenAction = async(req, res) =>{
        const user = await User.findOne ({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
        }).exec();

        if(!user){
                req.flash('error', 'Token expirado!');
                res.redirect('/users/forget');
                return;
        }
        if(req.body.password != req.body ['password-confirm']) {
                req.flash('error', 'Senhas não Conrrespondem');
                res.redirect('back');
                return;
            }
            //2. Procurar o usuário e trocar a senha dele.
           user.setPassword (req.body.password, async () =>{
                await user.save();
        
                req.flash('success', 'Senha alterada com sucesso!');
                res.redirect('/')
            });
        
};
