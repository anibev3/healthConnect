const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Appointment = db.appointment;
const Carnet = db.carnet;

exports.myselfAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const patient = await User.findById(userId);

    // Validation des données d'entrée (ajustez en fonction de vos besoins)
    const { date, time, purpose } = req.body;
    if (!date || !time || !purpose) {
      return res.status(400).json({
        message:
          "Veuillez fournir une date, une heure et le motif du rendez-vous.",
      });
    }

    // Créez un nouveau rendez-vous
    const appointment = new Appointment({
      patient: patient._id,
      date,
      time,
      purpose,
    });

    // Sauvegardez le rendez-vous dans la base de données
    await appointment.save();

    // Ajoutez une entrée de consultation au carnet de santé du patient
    const carnet = await Carnet.findOne({ patient: patient._id });
    // console.log(
    //   "\n---------------------------------------------------------------------------\n|                           recherche du carnet                           |\n---------------------------------------------------------------------------\n" +
    //     carnet +
    //     "---------------------------------------------------------------------------"
    // );
    let appointment__ = new Appointment({
      date,
      time,
      purpose,
      notes: "Nouvelle consultation créée",
    });

    carnet.appointments.push(appointment__);

    // Sauvegardez le carnet de santé mis à jour
    await carnet.save();

    res.json({ message: "Rendez-vous pris avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la prise du rendez-vous." });
  }
};

exports.familyAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const patient = await User.findById(userId);

    // if (!patient || patient.roles.indexOf('ROLE_PATIENT') === -1) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    // Validation des données d'entrée (ajustez en fonction de vos besoins)
    const { familyMemberId, date, time, purpose } = req.body;
    if (!familyMemberId || !date || !time || !purpose) {
      return res.status(400).json({
        message:
          "Veuillez fournir l'identifiant du membre de la famille, une date, une heure et le motif du rendez-vous.",
      });
    }

    // Vérifiez si le membre de la famille appartient au patient
    const familyMember = patient.family_members.find(
      (member) => member._id.toString() === familyMemberId
    );
    if (!familyMember) {
      return res.status(403).json({
        message: "Le membre de la famille n'appartient pas au patient.",
      });
    }

    // Créez un nouveau rendez-vous pour le membre de la famille
    const appointment = new Appointment({
      patient: familyMemberId,
      date,
      time,
      purpose,
    });

    // Sauvegardez le rendez-vous dans la base de données
    await appointment.save();

    res.json({
      message: "Rendez-vous pris avec succès pour le membre de la famille.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Erreur lors de la prise du rendez-vous pour le membre de la famille.",
    });
  }
};

exports.jointAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const patient = await User.findById(userId);

    // if (!patient || patient.roles.indexOf('ROLE_PATIENT') === -1) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    // Validation des données d'entrée (ajustez en fonction de vos besoins)
    const { familyMemberIds, date, time, purpose } = req.body;
    if (!familyMemberIds || !date || !time || !purpose) {
      return res.status(400).json({
        message:
          "Veuillez fournir les identifiants des membres de la famille, une date, une heure et le motif du rendez-vous.",
      });
    }

    // Vérifiez si les membres de la famille appartiennent au patient
    const familyMembers = [];
    for (const familyMemberId of familyMemberIds) {
      const familyMember = patient.family_members.find(
        (member) => member._id.toString() === familyMemberId
      );
      if (!familyMember) {
        return res.status(403).json({
          message: `Le membre de la famille avec l'identifiant ${familyMemberId} n'appartient pas au patient.`,
        });
      }
      familyMembers.push(familyMemberId);
    }

    // Créez un nouveau rendez-vous pour chaque membre de la famille
    const appointments = familyMembers.map(
      (familyMemberId) =>
        new Appointment({
          patient: familyMemberId,
          date,
          time,
          purpose,
        })
    );

    // Sauvegardez les rendez-vous dans la base de données
    await Appointment.insertMany(appointments);

    res.json({ message: "Rendez-vous conjoints pris avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la prise des rendez-vous conjoints." });
  }
};

exports.listOfAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const patient = await User.findById(userId);

    //     if (!patient || patient.roles.indexOf('ROLE_PATIENT') === -1) {
    //       return res.status(403).json({ message: 'Unauthorized' });
    //     }

    // Récupérez les rendez-vous du patient et de ses membres de la famille
    const familyMemberIds = patient.family_members.map((member) => member._id);
    const allMemberIds = [userId, ...familyMemberIds];

    const appointments = await Appointment.find({
      patient: { $in: allMemberIds },
    });

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des rendez-vous." });
  }
};
