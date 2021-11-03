const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema
const model = mongoose.model
const UserSchema = new Schema({
    Avatar: String,
    Nombre: String,
    Apellido: String,
    username:{
      type: String,
      unique: true,
      lowercase: true
    },
    Ingresos: String,
    Rut: String,
    email: {
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
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    Valoracion: {
      valor: Number,
      numero: Number
    },
  },{
  timestamps: true,
  collection: "_User"
});

UserSchema.pre('validate', async function(next){
    let user = this
    console.log("user is new", user.isNew)
    if(user.isNew){
        if (!user.EsConductor){
            console.log ("no es conductor")
            if(!user.email){
                next(new Error('Email es requerido'))
            }
            const otro_email = await mongoose.model("User").findOne({email: user.email})
            console.log("otro email:", otro_email)
            if(otro_email){
                next(new Error('Email debe ser unico'))
            }
        }
    }
         
    next()
})
UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        console.log("se ha modificado la clave")
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
UserSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, "jwt_fastgo_prod")
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

UserSchema.statics.findByCredentials = async function (username, password) {
    // Search for a user by email and password.
    const user = await this.findOne({ username: username} )
    if (!user) {
        throw new Error('Invalid login credentials')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials')
    }
    return user
}

module.exports = model('User',UserSchema);