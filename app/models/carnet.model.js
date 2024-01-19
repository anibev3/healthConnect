const mongoose = require("mongoose");

const Carnet = mongoose.model(
  "Carnet",
  new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enfant: {
      nom: { type: String },
      prenom: { type: String },
      dateNaissance: { type: Date },
      lieuNaissance: { type: String },
    },
    grossesse: {
      poidsNaissance: { type: Number },
      tailleNaissance: { type: Number },
      typeAccouchement: { type: String },
      complications: { type: String },
    },
    vaccinations: [
      {
        nom: { type: String },
        date: { type: Date },
      },
    ],
    courbesCroissance: {
      poids: [
        {
          date: { type: Date, required: true },
          valeur: { type: Number, required: true },
        },
      ],
      taille: [
        {
          date: { type: Date, required: true },
          valeur: { type: Number, required: true },
        },
      ],
      perimetreCrane: [
        {
          date: { type: Date },
          valeur: { type: Number },
        },
      ],
    },
    antecedentsMedicaux: { type: String },
    examensMedicaux: [
      {
        type: { type: String },
        resultat: { type: String },
        date: { type: Date },
      },
    ],
    conseilsSante: { type: String },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  })
);

module.exports = Carnet;
