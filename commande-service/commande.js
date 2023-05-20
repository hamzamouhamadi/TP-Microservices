const { default: mongoose } = require("mongoose");

//Définir le schéma de la collection
const CommandeSchema = mongoose.Schema({
    _id : { //Si on veut le contrôler, sinon on ne le mentionne pas (généré automatiquement)
        type : Number,
        unique : true,
        required : true
    },
    produits : [Number], //Array //ids des produits à commander
    email_utilisateur : String,
    prix_total : Number,
    created_at : {
        type : Date,
        default : Date.now()
    }
})

//Crée le model mappé à la collection

module.exports = commande = mongoose.model("commande", CommandeSchema);
