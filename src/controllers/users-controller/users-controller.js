const UsersController = {};
const User = require('../../models/User/User')
const Verifications = require('../../models/Verifications/Verifications')
const Emailer = require('../../services/sending_emails/sending_emails')
const bcrypt = require('bcryptjs');

UsersController.newUser = async (req, res) => {
  try {
      const user = new User(req.body)
      console.log(req.body)
      user.Valoracion = {valor: 0, numero: 1}
      user.Password = await bcrypt.hash(user.Password, 8)
      console.log(user.Password)
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
  } catch (err) {
    console.log("catch", err)
    res.status(400).json({error: "Ha ocurrido un error", msg: err ,status: 400})
  }
}
UsersController.index = async (req, res) => {
  try{
      const result = await User.find(req.query.Email, req.query.Password);
      console.log(req.query)
      if(!result){
          return res.status(401).send({error: "un error"})
      }
      const token = await result.generateAuthToken()
      res.status(200).json({result, token})
  } catch(error){
      console.log(error)
      res.status(400).json({error: "Ha ocurrido un error", status: 400})
  }
}
UsersController.getInfo = async (req, res) => {
  try{
      console.log(req.query.Id)
      const result = await User.findById(req.query.Id).select("-tokens");
      console.log(req.query)
      if(!result){
          return res.status(401).send({error: "un error"})
      }
      res.status(200).json(result)
  } catch(error){
      console.log(error)
      res.status(400).json({error: "Ha ocurrido un error", status: 400})
  }
}
module.exports = UsersController