const express = require('express');
const router = express.Router();
const passport = require('passport')
const {isNotloggedIn, isloggedIn} = require("../funcRes")


router.get('/signin', isNotloggedIn,(req,res) =>{
    res.render("signin.ejs")
})

router.post('/signin',isNotloggedIn,(req,res,next) =>{
    passport.authenticate('local.signin', {
        successRedirect:'/perfil',
        failureRedirect: '/signin'
    })(req,res,next)
})
const {msg} = require("../passport/passport")

router.get('/signup',isNotloggedIn, (req,res) =>{
    const data = msg
    res.render('signup.ejs', [data])
})

router.post('/signup', passport.authenticate('local.signup',{
    successRedirect : '/perfil',
    failureRedirect: '/signup',
}))

router.get ('/perfil', isloggedIn, (req,res)=>{
    res.render('perfil.ejs')
})

router.get('/logout', isloggedIn ,(req,res) =>{
    req.logOut((err) =>{
        if (err){
            return next(err)
        }
        res.redirect('/signin')
    });
})

module.exports= router