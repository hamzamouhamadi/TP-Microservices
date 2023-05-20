const express = require("express");
const app = express();

require("dotenv").config()

const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const produit = require("./produit");
const isConnected = require("./isAuthenticated");

app.use(express.json());

//Connection à la base de données MongoDB « produit-service »
//(Mongoose créera la base de données s'il ne le trouve pas)
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://127.0.0.1:27017/produit-service",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
  .then(() => {
    console.log(`Produit-Service DB Connected`);
  })
  .catch(err=>console.log(err))
  

//Définir l'API à exposer avec gestion des erreurs
app.post("/produit/ajouter",isConnected, async (req, resp) => {
    const newProduit = new produit(req.body);
    await newProduit.save()
                    .then(result=>resp.json(result))
                    .catch(err=>resp.status(401).json({message:err}))
        
});

//Recherche par lot
app.get("/produit/acheter", async (req, resp) => { 
  await produit.find({_id : {$in : req.body.ids}})
                .then(result=>resp.json(result))
                .catch(err=>resp.status(401).json({message:err}))     
});

app.listen(PORT,()=>{
    console.log(`Service Produit démarré sur le port ${PORT}`);
});


