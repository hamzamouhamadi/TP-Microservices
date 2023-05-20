const mongoose = require("mongoose");
const UtilisateurSchema = mongoose.Schema({
    nom: String,
    email: String,//unique, required
    password: String, //required
    created_at: {
        type: Date,
        default: Date.now(),
    },
    });
module.exports = Utilisateur = mongoose.model("utilisateur", UtilisateurSchema);
