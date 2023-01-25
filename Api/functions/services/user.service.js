require("dotenv").config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { db } = require('../db');

const authRegister = async (data) => {

    const user = await (await db.collection('Users').where("email", "==", data.email).get())

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(data.password, salt);

        if(!user.docs[0]){
        //crear usuario
        try{
            await db.collection("Users").doc(data.email).set({email:data.email, password: pass, list:[]})
            return true
        }
        catch{
            return "error"
        }
    } else return false


    }

const authLogin = async (data) => {
    
    const user = await (await db.collection('Users').where("email", "==", data.email).get()).docs[0].data()

    if (!user) throw Error('Usuario no encontrado');
    
    const validPassword = await bcrypt.compare(data.password, user.password);

    if (validPassword) console.log("validacion correcta")
    if (!validPassword) throw Error('contraseña no válida');

    const token = jwt.sign({
        email : data.email,
        id: user.id
    }, "Osjqbgk1brk1krncblqjgow91827461");

    return token;
    
};

module.exports = {
    authLogin,
    authRegister
};