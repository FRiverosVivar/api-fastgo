const moment = require('moment-timezone')
//excel solicitudes
const chileanTime = (fecha) => {
    if(!fecha)
        return ""
    let now = moment(fecha).tz('America/Santiago');
    let date = now.add(now.utcOffset(), 'minutes').toDate();
    return date; 
}
module.exports = chileanTime
//export {chileanTime}