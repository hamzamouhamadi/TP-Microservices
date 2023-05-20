const { default: axios } = require("axios");
const express = require("express");
const app = express();

require("dotenv").config()

const PORT = process.env.PORT || 4001;
const mongoose = require("mongoose");
const commande = require("./commande");
const isConnected = require("./isAuthenticated");

app.use(express.json());

//Connection à la base de données MongoDB « produit-service »
//(Mongoose créera la base de données s'il ne le trouve pas)
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://127.0.0.1:27017/commande-service",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
  .then(() => {
    console.log(`Commande-Service DB Connected`);
  })
  .catch(err=>console.log(err))
  
const prixTotal = (produits)=>{
  return produits.reduce((total,prod)=>total+=prod.prix,0)
}

//Communication synchrone
const httpRequest = async (liste_ids)=>{
  try {
    const response = await axios.get("http://localhost:4000/produit/acheter",{
    headers:{"Content-Type":"application/json"},
    data : { "ids" : liste_ids }
  });
  return (prixTotal(response.data))
  } catch (error) {
    console.log(error);
  }
  
}
//Définir l'API à exposer avec gestion des erreurs
app.post("/commande/ajouter", isConnected, async (req, resp) => {
  const {_id, produits} = req.body
  //const total = await httpRequest(produits)
  httpRequest(produits).then(total=>{
    const newCommande = new commande({
      _id, produits, email_utilisateur : req.user.email,
      prix_total : total
    });
    newCommande.save()
    .then(result=>resp.json(result))
    .catch(err=>resp.status(403).json({message:err}))     

  })
  .catch(err=>resp.status(403).json({message:err}))
  
});

app.listen(PORT,()=>{
    console.log(`Service Commande démarré sur le port ${PORT}`);
});


