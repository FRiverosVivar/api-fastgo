const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema
const model = mongoose.model

const UserSchema = new Schema({
    Avatar: {type: String, required: false},
    Names: {type: String, required: true},
    Lastnames: {type: String, required: true},
    Income: Number,
    Dni: {type: String, required: true},
    IsHaulier: {type: Boolean, required: true},
    CuentaBanco: {type: String, required: true},
    CorreoBanco: {type: String, required: true},
    NombreBanco: {type: String, required: true},
    TipoCuenta: {type: String, required: true},
    Email: {
        type: String,
        required: false,
        // unique: true,
        lowercase: true,
        validate: value => {
            if (value)
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    Password: {
        type: String,
        required: true,
        minLength: 5
    },
    tokens: [{
        _id:false,
        token: {
            type: String,
            required: true,
        }
    }],
    Valoracion: [{
      valor: Number,
      numero: Number
    }],
  },{
  timestamps: true,
  collection: "_FG_USERS"
});

UserSchema.pre('validate', async function(next){
    let user = this
    console.log("user is new", user.isNew)
    console.log("user is new", user.Email)
    if(user.isNew){
            if(!user.Email){
                next(new Error('Email es requerido'))
            }
            const otro_email = await mongoose.model("User").findOne({Email: user.Email})
            console.log("otro email:", otro_email)
            if(otro_email){
                next(new Error('Email debe ser unico'))
            }
    }
         
    next()
})
UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    console.log(user)
    if (user.isModified('password')) {
        console.log("se ha modificado la clave")
        user.Password = await bcrypt.hash(user.Password, 8)
    }
    next()
})
UserSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, "jwt_fastgo_prod")
    console.log(token)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
UserSchema.methods.ChangeAuthToken = async function(bad_token) {
    const user = this;
    user.tokens = user.tokens.filter((token) =>{
        return token.token != bad_token;
    });
    await user.save();
    const new_token = await user.generateAuthToken();
    return new_token
}
UserSchema.statics.findByEmail = async function (Email) {
    const user = await this.findOne({ Email: Email} )
    if (!user) {
        throw new Error({ error: 'Invalid email' })
    }
    return user
}
UserSchema.statics.find = async function (Email, Password) {
    // Search for a user by email and password.
    try {
        const user = await this.findOne({ Email: Email} )
        if (!user) {
            throw new Error('Invalid Email credentials')
        }
        console.log(user)
        console.log(Password)
        console.log(user.Password)
        let isPasswordMatch = await bcrypt.compare(Password, user.Password)
        console.log(isPasswordMatch)
        if (!isPasswordMatch) {
            throw new Error('Invalid Password credentials')
        }
        return user
    } catch(err) {
        console.log(err)
    }
}

module.exports = model('User',UserSchema);