const RequestsController = {};
const Request = require('../../models/Request/Request')
const User = require('../../models/User/User')
const chileanTime = require('../../utils/cl_time/cl_time')
const mongoose = require('mongoose')
RequestsController.index =  async (req,res) => {
    try{
        let userByEmail = await User.findByEmail(req.query.Email)
        
        let solicitudesFiltradas = []
        if(userByEmail.IsHaulier){
          let solicitudesStatusEnCurso = await Request.find({Status:3, Haulier: userByEmail._id})
          let solicitudesStatusDisponibles = await Request.find({Status:2})
          let solicitudesStatusEnCursoFinal = await Request.find({Status:5, Haulier: userByEmail._id})
          let solicitudesStatusFinalizadas = await Request.find({Status:4, Haulier: userByEmail._id})
          solicitudesFiltradas = solicitudesFiltradas.concat(solicitudesStatusEnCurso, solicitudesStatusDisponibles, solicitudesStatusEnCursoFinal, solicitudesStatusFinalizadas)
        }else {
          let solicitudesStatusEnCurso = await Request.find({Status:3, Cliente: userByEmail._id})
          let solicitudesStatusDisponibles = await Request.find({Status:2, Cliente: userByEmail._id})
          let solicitudesStatusEnCursoFinal = await Request.find({Status:5, Cliente: userByEmail._id})
          let solicitudesStatusFinalizadas = await Request.find({Status:4, Cliente: userByEmail._id})
          solicitudesFiltradas = solicitudesFiltradas.concat(solicitudesStatusEnCurso, solicitudesStatusDisponibles, solicitudesStatusEnCursoFinal, solicitudesStatusFinalizadas)
        }
        res.status(200).json(solicitudesFiltradas)
    } catch(error){
      console.log(error)
      res.status(400).json({error: "Ha ocurrido un error", status: 400})
    }
}
RequestsController.create = async (req, res) => {
    try {
        console.log("body: ",req.body)
        const solicitud = new Request(req.body)
        console.log("Request: ", solicitud)
  
        const cliente = await User.findOne({_id: req.body.Cliente}).select('-tokens')
        console.log("cliente", cliente)
        solicitud.Cliente = cliente

        if(cliente.IsHaulier){
          console.log("Transportista no puede crear solicitudes")
          res.status(400).json({error: "Transportista no puede crear solicitudes"})
        }

        if(solicitud.Estado == 1){
          solicitud.DateFrom = chileanTime(new Date(req.DateFrom)).toLocaleDateString("en-GB")
          solicitud.DateFromString = req.DateFrom
          solicitud.DateTo = chileanTime(new Date(req.DateTo)).toLocaleDateString("en-GB")
          solicitud.DateToString = req.DateTo
        }
        await cliente.save()
        await solicitud.save()
  
        // if(solicitudNueva.Estado == 1){
        //     solicitud.notificacion_nueva_solicitud(solicitud)
        // }
  
        res.status(200).send(solicitud)
    } catch (error) {
        console.log(error)
        console.log(error)
        res.status(400).json({error: "Ha ocurrido un error", status: 400})
    }
};
RequestsController.start_request = async (req, res) => {
    try {
        const id = req.query.Id;
        console.log(id)
        const Email = req.query.Email
        console.log(Email)
        const haulier = await User.findOne({Email: Email})
        const request = await Request.findOne({_id: id})
      
        if(request.Status != 2){
          console.log("request no esta en estado disponible")
          res.status(400).json({error: "request no esta en estado disponible"})
        }
        console.log(haulier.IsHaulier)
        if(!haulier && !haulier.IsHaulier){
          res.status(400).json({error: "usuario no es transportista"})
        }
        request.Haulier = haulier
        request.Status = 3
        await request.save()
      
        res.status(200).json({
          message: 'Request updated',
          request: request
        });
    } catch(err) {
        console.log(err)
        res.status(400).json({error: "Ha ocurrido un error", status: 400})
    }
}
RequestsController.final_dir = async (req, res) => {
    const id = req.query.Id;
    const solicitud = await Request.findOne({_id: id})
  
    if(solicitud.Status != 3){
      console.log("solicitud no esta en estado en curso")
      res.status(400).json({error: "solicitud no esta en estado en curso"})
    }
  
    solicitud.Status = 5
    await solicitud.save()
    res.status(200).json({
      message: 'Solicitud updated',
      solicitud: solicitud
    });
}
RequestsController.stop_request = async (req, res) => {
    const id = req.query.Id;
    const user = await User.findOne({Email: req.query.Email})
    const solicitud = await Request.findOne({_id: id})
  
    if(solicitud.Status != 5){
      console.log("solicitud no esta en estado en curso final")
      res.status(400).json({error: "solicitud no esta en estado en curso final"})
    }
    user.Income.push({
      date: req.query.Date,
      income: req.query.Income
    })
    solicitud.Status = 4
    await user.save()
    await solicitud.save()
  
    res.status(200).json({
      message: 'Solicitud updated',
      solicitud: solicitud
    });
}
RequestsController.set_as_disponible = async (req, res) => {
    const id = req.query.Id;
    const solicitud = await Request.findOne({_id: id})
  
    if(solicitud.Estado != 1){
      console.log("solicitud no esta en estado en borrador")
      res.status(400).json({error: "solicitud no esta en estado en estado borrador"})
    }
  
    solicitud.Estado = 2
    await solicitud.save()
  
    res.status(200).json({
      message: 'Solicitud updated',
      solicitud: solicitud
    });
}
module.exports = RequestsController