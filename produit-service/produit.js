const { default: mongoose } = require("mongoose");

//Définir le schéma de la collection
const ProduitSchema = mongoose.Schema({
    _id : { //_id sera contrôlé par le développeur par exemple 
        type : Number,
        unique : true,
        required : true
    },
    nom : {
        type : String,
        required : true
    },
    description : String,
    prix : {
        type : Number,
        required : true
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
})

//Crée le model mappé à la collection

module.exports = produit = mongoose.model("produit", ProduitSchema);
