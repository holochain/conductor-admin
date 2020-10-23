const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();
const bodyParser = require("body-parser"); 


const DIR = "./applicationDnas/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
    if (file.mimetype == "application/x-gzip") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .dna.gz allowed!"));
    }
  }
});
const SERVER_PORT = 7401;
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json());

app.post("/uploadDnas", upload.array("files", 10), function(req, res) {
  res.status(201).json({
    message: "Done upload!"
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening at http://localhost:${SERVER_PORT}`);
});
