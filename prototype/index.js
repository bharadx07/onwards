const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const fs = require("fs");
const jsoning = require("jsoning")

const db = new jsoning("db.json")

dotenv.config();

const app = express();

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/views/dashboard.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/upload-file", async (req, res) => {
  console.log(req.files);
  console.log(req.body);

  const pic = req.files["files[]"];

  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: process.env.TEST_EMAIL_ADDRESS,
      pass: process.env.TEST_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    subject: "newsletter",
    to: req.body.sendemail.split(","),
    from: process.env.TEST_EMAIL_ADDRESS,
    html: `testing`,
    attachments: [{ filename: pic.name, content: pic.data }],
  });

});

app.listen(8080, () => {
  console.log("server started");
});
