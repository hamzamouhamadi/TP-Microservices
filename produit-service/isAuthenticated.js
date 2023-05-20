const jwt = require("jsonwebtoken")
//handler qui permet de protéger les routes
const isConnected = async (req, resp, next)=>{    
    const token = req.headers.authorization
    if (!token) {
        resp.status(405).json({message : "Connexion Obligatoire pour continuer"})
    } else {
        try {
            //Vérifier le token
        const payload = jwt.verify(token,process.env.TOKEN_SECRET)
        req.user = payload 
        next()
        } catch (error) {
            return resp.status(405).json({message : "Invalid Token"})
        }
    }
}

module.exports = isConnected