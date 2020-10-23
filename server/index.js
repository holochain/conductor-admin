const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const aWS = require("@holochain/conductor-api").AdminWebsocket;

const holochain = spawn("holochain", [
  "-c",
  "/Users/philipbeadle/holochain-2020/conductor-admin/server/conductor/conductor.toml"
]);
const ADMIN_PORT = 3301;
const DIR = "./applicationDnas/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    cb(null, fileName);
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

// MongoDB Setup
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/conductor", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    () => {
      console.log("Database sucessfully connected");
    },
    error => {
      console.log("Database could not be connected: " + error);
    }
  );

const conductorAgentSchema = new mongoose.Schema({
  agentKey: Object
});
const ConductorAgent = mongoose.model("ConductorAgent", conductorAgentSchema);
app.post("/uploadDnas", upload.array("files", 10), function(req, res) {
  res.status(201).json({
    message: "Done upload!"
  });
});

app.get("/init", (req, res) => {
  ConductorAgent.countDocuments((err, count) => {
    console.log(count);
    if (err) return console.error(err);
    if (count === 0) {
      aWS.connect(`ws://localhost:${ADMIN_PORT}`).then(adminSocket => {
        adminSocket.generateAgentPubKey().then(agentKey => {
          const founder = new ConductorAgent({ agentKey });
          founder.save(function(err, founder) {
            if (err) return console.error(err);
            res.send(`Initialised a new founder ${founder}`);
          });
        });
      });
    } else {
      ConductorAgent.find((err, conductorAgents) => {
        res.send(`Retrieved the founder${conductorAgents[0]}`);
      });
    }
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening at http://localhost:${SERVER_PORT}`);
});

holochain.stdout.on("data", data => {
  console.log(`stdout: ${data}`);
});

holochain.stderr.on("data", data => {
  console.error(`stderr: ${data}`);
});

holochain.on("close", code => {
  console.log(`holochain process exited with code ${code}`);
});
