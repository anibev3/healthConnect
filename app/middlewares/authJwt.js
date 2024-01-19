const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    console.log(
      "================================================================================"
    );

    console.log(token);
    console.log(
      "================================================================================"
    );

    // ================================================================================
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }
    console.log("--------------------");
    console.log(await jwt.verify(token, config.secret));
    const decoded = await jwt.verify(token, config.secret);
    console.log(decoded);
    console.log("--------------------");

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "chief_medecin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require chief_medecin Role!" });
        return;
      }
    );
  });
};

isAssistant = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "assistant") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require assistant Role!" });
        return;
      }
    );
  });
};

isPatient = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "patient") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require patient Role!" });
        return;
      }
    );
    // ================================================================================
    //  DEBUT APPEL DE L'API DE RECUPERATION DE SINGLE AEROPORTS
    // ================================================================================
    //
    // ================================================================================
    req.user = user;

    // console.log(req.user);
    next();
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isAssistant,
  isPatient,
};
module.exports = authJwt;
