const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Appointment = db.appointment;
const Carnet = db.carnet;
const QRCode = require("qrcode");

exports.createCarnet = async (req, res) => {
  try {
    const patientId = req.userId; // ou récupérez l'ID du patient à partir de la requête
    const existingCarnet = await Carnet.findOne({ patient: patientId });

    if (existingCarnet) {
      // Si le carnet existe déjà pour ce patient, renvoyer les détails du carnet existant
      return res.status(400).json({
        message: "Ce patient a déjà un carnet de santé.",
        existingCarnet,
      });
    }

    const carnetData = req.body;
    carnetData.patient = patientId; // Assurez-vous que l'ID du patient est défini dans le carnetData
    const carnet = new Carnet(carnetData);
    await carnet.save();
    res.status(201).json({ message: "Carnet créé avec succès", carnet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du carnet" });
  }
};

exports.getCarnet = async (req, res) => {
  try {
    const carnetId = req.params.carnetId;
    const carnet = await Carnet.findById(carnetId);
    if (!carnet) {
      return res.status(404).json({ message: "Carnet non trouvé" });
    }
    res.json({ carnet });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du carnet" });
  }
};

exports.updateCarnet = async (req, res) => {
  try {
    const carnetId = req.params.carnetId;
    const carnetData = req.body;
    const updatedCarnet = await Carnet.findByIdAndUpdate(carnetId, carnetData, {
      new: true,
    });
    if (!updatedCarnet) {
      return res.status(404).json({ message: "Carnet non trouvé" });
    }
    res.json({
      message: "Carnet mis à jour avec succès",
      carnet: updatedCarnet,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du carnet" });
  }
};

exports.deleteCarnet = async (req, res) => {
  try {
    const carnetId = req.params.carnetId;
    const deletedCarnet = await Carnet.findByIdAndDelete(carnetId);
    if (!deletedCarnet) {
      return res.status(404).json({ message: "Carnet non trouvé" });
    }
    res.json({ message: "Carnet supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du carnet" });
  }
};

exports.generateCarnetQrCode = async (req, res) => {
  try {
    const carnetId = req.params.carnetId;
    const carnet = await Carnet.findById(carnetId);

    if (!carnet) {
      return res.status(404).json({ message: "Carnet non trouvé" });
    }

    // Convertir les informations du carnet en chaîne JSON
    const carnetInfo = JSON.stringify(carnet);

    // Générer le code QR
    QRCode.toDataURL(carnetInfo, (err, url) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Erreur lors de la génération du code QR" });
      } else {
        res.json({ qrcodeUrl: url, infoSupplement: carnet });
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la génération du code QR" });
  }
};
