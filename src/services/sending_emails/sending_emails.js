const transporter = require('../mailer/mailer')
const fs = require('fs')
const handlebars = require('handlebars')
const util = require('util')
const promisify = util.promisify
//import { chileanTime } from "../../utils/cl_time/cl_time";
const readFile = promisify(fs.readFile);

handlebars.registerHelper("link", (restext, resurl) => {
    let url = handlebars.escapeExpression(resurl),
        text = handlebars.escapeExpression(restext)
        
   return new handlebars.SafeString("<a href='" + url + "'>" + text +"</a>");
});

const sendEmail = async (email_sending, params, subject_data, con_copia=true) => {
  let html, replacements
    
  html = await readFile("../../templates/register-email-template/register.html", "utf8");
  replacements = {
    title: params.title,
    subtitle: params.subtitle,
  };

  let htmltemplate = handlebars.compile(html);
      
  const htmlToSend = htmltemplate(replacements);
  let sending = null
  try {
    sending = await transporter.sendMail({
      from: "no-reply@fastgo.com",
      to: email_sending,
      subject: subject_data,
      html: htmlToSend,
      bcc: con_copia ? 'validacion@fastgo.com': []
    });
    console.log("sending", sending)
    return sending;
  } catch (error) {
    console.log("error sending email:", error)
    return sending;
  }
}
module.exports = {sendEmail};
  