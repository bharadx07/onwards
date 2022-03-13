const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

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

app.post("/upload-file", async (req, res) => {
  console.log(req.files);

  const pic = req.files["files[]"];

  pic.mv("./uploads/" + pic.name);

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

  transporter.sendMail({
    subject: "test",
    to: "~",
    from: process.env.TEST_EMAIL_ADDRESS,
    html: `testing`,
  });
});

app.listen(8080, () => {
  console.log("server started");
});
