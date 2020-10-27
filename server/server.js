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
function getFileType(fileName) {
  const index = fileName.lastIndexOf(".") + 1;
  const fileType = fileName.substring(index, fileName.length);
  return fileType;
}
function getFoldersAndFiles(parentDir, socket) {
  console.log(parentDir);
  const entries = fs.readdirSync(parentDir, { withFileTypes: true });
  const folders = entries
  .filter(entry => entry.isDirectory())
  .filter(entry => entry.name !== ".git")
  .filter(entry => entry.name !== "node_modules");
  for (const folder of folders) {
    const folderEntries = fs.readdirSync(`${parentDir}${folder.name}/`, {
      withFileTypes: true
    });
    if (folderEntries.length > 0) {
      const newDirectory = {
        parentDir: parentDir.replace(`${__dirname}/dev-apps`, ""),
        name: folder.name,
        type: "dir"
      };
      socket.emit("RECURSE_APPLICATION_FILES", newDirectory);
      getFoldersAndFiles(`${parentDir}${folder.name}/`, socket);
    }
  }
  const files = entries.filter(entry => !entry.isDirectory());
  for (const file of files) {
    let fileExtension = getFileType(file.name);
    let contentPrefix = "";
    let fileEncoding = "utf8";
    if (["png", "jpg", "jpeg"].find(ext => ext === fileExtension)) {
      if (fileExtension === "jpg") fileExtension = "jpeg";
      fileEncoding = "base64";
      contentPrefix = `data:image/${fileExtension};base64,`;
    }
    const content = `${contentPrefix}${fs.readFileSync(`${parentDir}${file.name}`, fileEncoding)}`;
    const newFile = {
      parentDir: parentDir.replace(`${__dirname}/dev-apps`, ""),
      name: file.name,
      type: "file",
      extension: fileExtension,
      encoding: fileEncoding,
      content: content
    };
    socket.emit("RECURSE_APPLICATION_FILES", newFile);
  }
}

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
      `/Users/philipbeadle/holochain-2020/server/dev-apps/${payload.path}`,
      { recursive: true },
      err => {
        if (err) throw err;
        callback(`Added ${payload}`);
      }
    );
  });

  socket.on("RECURSE_APPLICATION_FILES", (payload, callback) => {
    console.log("RECURSE_APPLICATION_FILES", payload.name);
    getFoldersAndFiles(`/Users/philipbeadle/holochain-2020/server/dev-apps/${payload.name}/`, socket);
    callback("Done");
  });
  
  socket.on("CREATE_APPLICATION", (payload, callback) => {
    console.log(payload);
    const createApp = `cd dev-apps && echo | vue create ${payload.name} --preset vuetifyjs/preset && cd ${payload.name} && git stash && vue add vuetify-preset-reply`;
    console.log("CREATE_APPLICATION", createApp);
    callback("CREATE_APPLICATION", `Started creating ${payload.name}`);
    const appCreator = spawn(createApp, { shell: true });
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
