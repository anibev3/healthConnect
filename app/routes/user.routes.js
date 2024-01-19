const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const patientController = require("../controllers/patient.controller");
const appointmentController = require("../controllers/appointment.controller");
const assistantController = require("../controllers/assistant.controller");
const carnetController = require("../controllers/carnet.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isAssistant],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post(
    "/api/patient/add-family-member",
    [authJwt.verifyToken],
    patientController.addFamily
  );

  app.post(
    "/api/patient/book-appointment",
    [authJwt.verifyToken],
    appointmentController.myselfAppointment
  );

  app.post(
    "/api/patient/book-appointment-for-family-member",
    [authJwt.verifyToken],
    appointmentController.familyAppointment
  );

  app.post(
    "/api/patient/book-joint-appointments",
    [authJwt.verifyToken],
    appointmentController.jointAppointment
  );

  app.get(
    "/api/patient/appointments",
    [authJwt.verifyToken],
    appointmentController.listOfAppointment
  );

  // -------------------------------------------------------------------ASSISTANT MEDECIN
  app.put(
    "/api/assistant/validate-appointment/:appointmentId",
    [authJwt.verifyToken, authJwt.isAssistant],
    assistantController.validateAppointment
  );

  app.get(
    "/api/assistant/generate-qr/:patientId",
    [authJwt.verifyToken],
    assistantController.generatePatientQR
  );

  // ------------------------------------------------------------------- Routes pour le carnet de santé
  app.post(
    "/api/carnet/create",
    [authJwt.verifyToken],
    carnetController.createCarnet
  );
  app.get(
    "/api/carnet/:carnetId",
    [authJwt.verifyToken],
    carnetController.getCarnet
  );
  app.put(
    "/api/carnet/:carnetId",
    [authJwt.verifyToken],
    carnetController.updateCarnet
  );
  app.delete(
    "/api/carnet/:carnetId",
    [authJwt.verifyToken],
    carnetController.deleteCarnet
  );
  app.get(
    "/api/carnet/generate-qrcode/:carnetId",
    [authJwt.verifyToken],
    carnetController.generateCarnetQrCode
  );
};
