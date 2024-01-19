const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
require("dotenv").config();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

// console.log("-------------------------------------------------------");
// console.log(process.env);
// console.log("-------------------------------------------------------");

db.mongoose
  .connect(
    // `mongodb://${process.env.HOST}:${process.env.DB_PORT}/${dbConfig.DB}`,
    // `mongodb://127.0.0.1:17027/${dbConfig.DB}`,
    `mongodb+srv://anibev3:k6WQS2aJQQlLQQjD@anibev3.xvcpn0e.mongodb.net/healconnect?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "test du healthConnect NAN application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "patient",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'patient' to roles collection");
      });

      new Role({
        name: "assistant",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'assistant' to roles collection");
      });

      new Role({
        name: "chief_medecin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'chief_medecin' to roles collection");
      });
    }
  });
}
