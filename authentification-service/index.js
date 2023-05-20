const express = require("express");
const app = express();

const PORT = process.env.PORT_ONE || 4002;

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Utilisateur = require("./Utilisateur");

require("dotenv").config()

mongoose.set('strictQuery', true);
mongoose.connect(
    "mongodb://127.0.0.1:27017/user-service",
              {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
              })
    .then(() => {
      console.log(`Authentification-Service DB Connected`);
    })
    .catch(err=>console.log(err))
    
app.use(express.json());

// la méthode regiter permettera de créer et d'ajouter un nouvel utilisateur à la base de données
app.post("/auth/register", async (req, resp) => {    
    const {nom , email , password} = req.body //Le password est en clair
    //Vérifier si le login existe déjà
    const userFind = await Utilisateur.findOne({email})
    if (userFind) {
      resp.status(406)
          .json({message : "Login existe déjà"})  ;
    } else {
      //save sur la base avec le mot de passe crypté
      const pwdCrypt = bcrypt.hashSync(password,10) //salt : 2**10 itérations--> ce qui est recommandé : 12
      const userNew = new Utilisateur({
        nom ,
        email, 
        password : pwdCrypt
      });
      userNew.save()
            .then((user)=>resp.json(user))
            .catch(err=>resp.status(407).json({message : err}))
    }

});

//la méthode login permettra de retourner un token après vérification de l'email et du mot de passe
app.post("/auth/login", async (req, resp) => {     
    const {email, password} = req.body
    //Vérifier si le login est OK
    const userFind = await Utilisateur.findOne({email})
    if (!userFind) {
      resp.status(408).json({message : "Login incorrect"})
    } else {
      //Vérifier le mot de passe
      const flag = bcrypt.compareSync(password,userFind.password)
      if (!flag) {
        resp.status(409).json({message : "Mot de passe incorrect"})
      } else {
        //OK : générer le token
        const payload = {//Données de l'utilisateur à exploiter
          userId : userFind._id,
          email,
          nom : userFind.nom
        }
        const token = jwt.sign(payload,process.env.SECRET,{expiresIn : "1h"}) //Clé private : SECRET
        resp.json({token}) //resp.json({token})
      }
    }
});

app.listen(PORT, () => {
    console.log(`Auth-Service at ${PORT}`);
    });
    


