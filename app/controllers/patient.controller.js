const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.addFamily = async (req, res) => {
  try {
    const userId = req.userId;
    const patient = await User.findById(userId);

    if (!req.body.familyMembers || !Array.isArray(req.body.familyMembers)) {
      return res.status(400).json({
        message:
          "Les membres de la famille sont requis et doivent être un tableau.",
      });
    }

    patient.family_members.push(...req.body.familyMembers);
    await patient.save();

    console.log(
      "=========================================================================="
    );
    console.log(patient);
    console.log(
      "=========================================================================="
    );

    res.status(200).json({
      message: `Ajout de ${req.body.familyMembers.length} membres de la famille avec succès.`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout des membres de la famille." });
  }
};
