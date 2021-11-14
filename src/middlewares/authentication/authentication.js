const jwt = require('jsonwebtoken')
const User = require('../../models/User/User')
const auth = async(req, res, next) => {
    console.log("headers: ", req.headers)
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return res.status(401).send("Access denied. No token provided.");
  
    try {
        const data = jwt.verify(token,"jwt_fastgo_prod")
        user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }  
        const new_token =  await user.ChangeAuthToken(token);
        req.user = user;
        req.token = new_token;
        res.header({"x-access-token": req.token })
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }  
}
module.exports = auth ;