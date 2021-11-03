const UsersController = {};
const User = require('../../models/User/User')
const Verifications = require('../../models/Verifications/Verifications')
const Emailer = require('../../services/sending_emails.ts/sending_emails')

UsersController.newUser = async (req, res) => {
  try {
      const user = new User(req.body)
      console.log(req.body)
      user.emailVerified = false
      user.activo = false

      if(user.EsConductor){
        user.emailVerified = true
        user.Valoracion = {valor: 0, numero: 1}
        user.password = user.username.substring(0,5)
        user.EstadoDocumentos = 0
        user.Estado="No operativo"
        console.log(user.password)
      }else{


        if(user.EsTransportista){
          user.Valoracion = {valor: 0, numero: 1}
        }
        if(user.EsCliente && user.TipoDePago != null){
          user.TipoDePago = '1'
        }

        if(user.EsCliente){
          user.CamposFacturacion = ["Identificador Adicional"]
        }

        //enviar mail confirmacion correo
        var code = new Verifications({
          rut:user.username
        })
        await code.save()
        var enlace = process.env.FRONTEND_URL+'/verificar_email?rut='+user.username+'&code='+code._id
        console.log("enlace", enlace)
        Emailer.sendEmail(user.email,
          {
            title: "Verificacion de email",
            subtitle: "<br/> haga click en el siguiente link para activar su cuenta: <a href='"+ enlace+"' >Activar cuenta</a>"
          },
          "Verificacion de email"
        )
      }
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
  } catch (error) {
    console.log("catch", error)
    res.status(400).json({error: "Ha ocurrido un error", msg: error ,status: 400})
  }
}
UsersController.index = async (req, res) => {
  try{
      const result = await User.find({});
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