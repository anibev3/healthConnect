const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Appointment = db.appointment;
const QRCode = require("qrcode");

const express = require("express");
// const authController = require("./controllers/auth.controller");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.validateAppointment = async (req, res) => {
  try {
    const assistantId = req.userId;
    const appointmentId = req.params.appointmentId;
    const additionalNotes = req.body.additionalNotes;

    const assistant = await User.findById(assistantId);

    // if (!assistant || assistant.roles.indexOf("ROLE_ASSISTANT") === -1) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    // Vérifiez si le rendez-vous appartient au médecin assistant
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé." });
    }

    // Validez le rendez-vous en stockant toutes les informations du médecin assistant sous forme de chaîne JSON
    appointment.validatedBy = JSON.stringify(assistant.toObject()); // Convertir en chaîne JSON
    appointment.validatedAt = new Date();
    appointment.additionalNotes = additionalNotes; // Ajout des notes supplémentaires
    await appointment.save();

    res.json({ message: "Rendez-vous validé avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la validation du rendez-vous." });
  }
};

exports.generatePatientQR = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await User.findById(patientId);

    // if (!patient || patient.roles.indexOf("ROLE_PATIENT") === -1) {
    //   return res.status(404).json({ message: "Patient non trouvé." });
    // }

    // Récupérez les rendez-vous du patient depuis la base de données
    const patientAppointments = await Appointment.find({
      patient: patient._id,
    });
    console.log("\n");
    console.log("===patientAppointments============================");
    console.log(patientAppointments);
    console.log("==================================================");

    // Récupérez les membres de la famille du patient
    const familyMembers = patient.family_members;

    console.log("=======familyMembers==============================");
    console.log(familyMembers);
    console.log("==================================================");

    // Récupérez les rendez-vous de chaque membre de la famille
    const familyAppointmentsPromises = familyMembers.map(
      async (familyMember) => {
        // const familyMemberUser = await User.findById(familyMember._id);
        const familyMemberUser = familyMember._id.toString();
        console.log("=======familyMemberUser===========================");
        console.log(familyMember._id.toString());
        console.log("==================================================");

        const familyMemberAppointments = await Appointment.find({
          patient: familyMemberUser,
        });
        return {
          familyMember: familyMemberUser,
          appointments: familyMemberAppointments,
        };
      }
    );

    const familyAppointments = await Promise.all(familyAppointmentsPromises);
    console.log("=======familyAppointmentsPromises=================");
    console.log(familyAppointments);
    console.log("==================================================");
    // // Générer le QR code avec les informations du patient, ses rendez-vous et ceux de sa famille
    const qrCodeData = {
      patient: {
        id: patient._id,
        username: patient.username,
        firstName: patient.first_name,
        lastName: patient.last_name,
        email: patient.email,
        // Ajoutez d'autres informations du patient si nécessaire
      },
      patientAppointments: patientAppointments.map((appointment) => ({
        id: appointment._id,
        date: appointment.date,
        status: appointment.status,
        // Ajoutez d'autres informations sur le rendez-vous si nécessaire
      })),
      familyMembers: familyAppointments.map((familyMember) => ({
        id: familyMember.familyMember._id,
        username: familyMember.familyMember.username,
        firstName: familyMember.familyMember.first_name,
        lastName: familyMember.familyMember.last_name,
        email: familyMember.familyMember.email,
        // Ajoutez d'autres informations sur le membre de la famille si nécessaire
        appointments: familyMember.appointments.map((appointment) => ({
          id: appointment._id,
          memberOfFamily: appointment.patient.toString(),
          date: appointment.date,
          purpose: appointment.purpose,
          additionalNotes: appointment.additionalNotes,
          validatedAt: appointment.validatedAt,
          validatedBy: appointment.validatedBy,
          // Ajoutez d'autres informations sur le rendez-vous si nécessaire
        })),
      })),
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrCodeData));

    // Envoyer l'URL de données du QR code dans la réponse JSON
    console.log("Contenu du QR code:", JSON.stringify(qrCodeData));

    // Envoyer l'URL de données du QR code dans la réponse JSON
    res.json({ qrcode: qrCodeDataURL, infoSup: qrCodeData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la génération du code QR." });
  }
};
