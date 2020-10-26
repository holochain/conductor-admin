const server = require("http").createServer();
const options = {
  /* ... */
};
const io = require("socket.io")(server, options);
const fs = require("fs");
// const path = require("path");
const { spawn } = require("child_process");
const holochain = spawn("holochain", ["-c", "./dev-server/developer.toml"]);

const SERVER_PORT = 11381;
const HOLOCHAIN_ADMIN_PORT = 26971;
// const HOLOCHAIN_APP_PORT = 15108;
const holochainAdminWebSocket = require("@holochain/conductor-api")
  .AdminWebsocket;
// const holochainAppWebSocket = require("@holochain/conductor-api").AppWebsocket;
let hcClient = {};

// function ensureDirectoryExistence(filePath) {
//     var dirname = path.dirname(filePath);
//     if (!fs.existsSync(dirname)) {
//       fs.mkdirSync(dirname, { recursive: true });
//     }
//   }

io.on("connection", socket => {
  console.log("Connected", socket.id);
  socket.on("CREATE_AGENT", (payload, callback) => {
    console.log("CREATE_AGENT", payload);
    hcClient.admin.generateAgentPubKey().then(agentKey => {
      callback(agentKey);
    });
  });
  socket.on("CREATE_DIRECTORY", (payload, callback) => {
    console.log("CREATE_DIRECTORY", payload);
    fs.mkdir(
      `/Users/philipbeadle/holochain-2020/conductor-admin/server/dev-apps/${payload.path}`,
      { recursive: true },
      err => {
        if (err) throw err;
        callback(`Added ${payload}`);
      }
    );
  });

  socket.on("CREATE_APPLICATION", (payload, callback) => {
    console.log(
      "CREATE_APPLICATION",
      `cd dev-apps/ && vue create ${payload.name} -d -n -b --skipGetStarted`
    );
    callback(
      "CREATE_APPLICATION",
      `cd dev-apps/ && vue create ${payload.name} -d -n -b --skipGetStarted`
    );
    const appCreator = spawn(
      `cd dev-apps/ && vue create ${payload.name} -d -n -b --skipGetStarted`,
      { shell: true }
    );
    appCreator.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
      socket.emit("CREATE_APLICATION_ERROR", err.toString());
    });
    appCreator.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
      socket.emit("CREATE_APLICATION_STDOUT", data.toString());
    });
    appCreator.on("exit", function(exitCode) {
      console.log("Child exited with code: " + exitCode);
      socket.emit("CREATE_APLICATION_EXIT", exitCode);
    });
  });
});
io.on("error", () => {
  console.log("Error");
});

holochain.stdout.on("data", data => {
  if (`${data}`.indexOf("Conductor ready.") !== -1) {
    console.log("Connecting to Holochain conductor");
    holochainAdminWebSocket
      .connect(`ws://localhost:${HOLOCHAIN_ADMIN_PORT}`)
      .then(client => {
        hcClient.admin = client;
        console.log("hcClient.admin connected");
      })
      .catch(e => console.log(e));

    // holochainAppWebSocket.connect(`ws://localhost:${HOLOCHAIN_APP_PORT}`).then(client => {
    //     hcClient.app = client;
    //     console.log("hcClient.app connected")
    // }).catch(e => console.log(e));
  }
  console.log(`${data}`);
});

holochain.stderr.on("data", data => {
  console.error(`stderr: ${data}`);
});

holochain.on("close", code => {
  console.log(`holochain process exited with code ${code}`);
});

server.listen(SERVER_PORT, () => {
  console.log(`Listening on port:${SERVER_PORT}`);
});
