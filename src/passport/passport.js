const { use } = require('passport');
const passport = require('passport');
const { connect } = require('../app');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../datacon')
const helpers = require('../helpers/helpers')
const { body,validationResult } = require("express-validator");


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'Contraseña',
    passReqToCallback: true
    
}, async (req,username,password,done) => {
    const {Nombre , Apellido } = req.body
    const usuario = {
        Nombre,
        Apellido,
        username,
        password
    };
    let bandera = false
    let banderas = 0
    let msg = []
    const usuarioscons = await pool.query('SELECT username FROM usuarios')
    for (let i = 0; i< usuarioscons.length;i++){
        if (usuarioscons[i].username == username){
            banderas++
        }
    } 

    //Validacion DEL NOMBRE
    if (usuario.Nombre.length < 4){
        bandera = true
        msg.push('El campo nombre debe tener al menos 4 caracteres/')
    }
    if (usuario.Nombre.includes("1") || usuario.Nombre.includes("2") || usuario.Nombre.includes("3")|| usuario.Nombre.includes("4") || usuario.Nombre.includes("5") || usuario.Nombre.includes("6") || usuario.Nombre.includes("7") || usuario.Nombre.includes("8") || usuario.Nombre.includes("9") || usuario.Nombre.includes("0")){
        bandera = true
        msg.push('El campo NOMBRE no debe contener números ')
    }
    //VALIDACION DEL APELLIDO
    if (usuario.Apellido.length < 4){
        bandera = true
        msg.push('El campo APELLIDO debe tener al menos 4 caracteres')
    }
    if (usuario.Apellido.includes("1") || usuario.Apellido.includes("2") || usuario.Apellido.includes("3")|| usuario.Apellido.includes("4") || usuario.Apellido.includes("5") || usuario.Apellido.includes("6") || usuario.Apellido.includes("7") || usuario.Apellido.includes("8") || usuario.Apellido.includes("9") || usuario.Apellido.includes("0")){
        bandera = true
        msg.push('El campo APELLIDO no debe contener números')
    }
    if(banderas != 0){
        msg.push('El NOMBRE DE USUARIO Elegido no se encuentra disponible')
        bandera = true
    }

    if (bandera === true){
        console.log(msg)
        done(null,false,req.flash('warning', msg))
    }

    /* if (usuario.Apellido == "" || helpers.contNum(usuario.Apellido)){
        console.log('fallo apellido')
         done(null,false,req.flash('warning', 'El campo Apellido es obligatorio y no puede tener numeros'))
    }if (bandera != 0){
        console.log('usuario no disponible')
         done(null,false,req.flash('warning', `El username ${username} no esta disponible`)) 
    }if (username === ""){
        done(null, false, req.flash('warning', 'El campo username es obligatorio')) 
    }
    else{
        const result = await pool.query('INSERT INTO usuarios set ?', [usuario])
        usuario.id = result.insertId
        return done(null,usuario,req.flash('success','El usuario fue creado correctamente'))    
    } */
    
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'Contraseña',
    passReqToCallback: true
}, async (req,username,password,done)=>{
      const row = await pool.query('select * from usuarios where username = ?',[username])
      const user = row[0]
      if (row.length > 0){
        if (user.username === username){
            if(user.password === password){
                
                done(null,user,req.flash('success',"welcome" + user.username))
            }else{
                
                done(null,false,req.flash('warning','*contraseña incorrecta'))
            }
        }
    }else{
        done(null,false,req.flash('warning','*Este usuario no se encuentra en la base de datos')) 
    }  
}))


passport.serializeUser((usuario,done) =>{
        done(null,usuario.id);
})

passport.deserializeUser( async (id,done) =>{
    try{
        const rows = await pool.query("select * from usuarios where id = ?",[id] ) 
        done(null,rows[0]);
    } catch(e){
        console.log(e)
    }
     
})