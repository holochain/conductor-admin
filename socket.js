const server = require("http").createServer();
const options = {
  /* ... */
};
const io = require("socket.io")(server, options);
const fs = require("fs");
// const path = require("path");
const { spawn } = require("child_process");
const holochain = spawn("holochain", ["-c", "./conductor/developer.yaml"]);

const SERVER_PORT = 11381;
const HOLOCHAIN_ADMIN_PORT = 26970;
// // const HOLOCHAIN_APP_PORT = 15108;
const hcAws = require("@holochain/conductor-api").AdminWebsocket;
// // const holochainAppWebSocket = require("@holochain/conductor-api").AppWebsocket;
let hcClient = {};

function getFileType(fileName) {
  if (fileName.startsWith(".")) return fileName;
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
    console.log(folder.name);
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
  const files = entries
    .filter(entry => !entry.isDirectory())
    .filter(entry => entry.name !== ".DS_Store");
  for (const file of files) {
    let fileExtension = getFileType(file.name);
    let contentPrefix = "";
    let fileEncoding = "utf8";
    if (["png", "jpg", "jpeg"].find(ext => ext === fileExtension)) {
      if (fileExtension === "jpg") fileExtension = "jpeg";
      fileEncoding = "base64";
      contentPrefix = `data:image/${fileExtension};base64,`;
    }
    const content = `${contentPrefix}${fs.readFileSync(
      `${parentDir}${file.name}`,
      fileEncoding
    )}`;
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
      `${__dirname}/dev-apps/${payload.path}`,
      { recursive: true },
      err => {
        if (err) throw err;
        callback(`Added ${payload}`);
      }
    );
  });

  socket.on("GET_TEMPLATES", (payload, callback) => {
    console.log("GET_TEMPLATES");
    let entries = fs.readdirSync("./templates", { withFileTypes: true });
    entries = entries.filter(entry => entry.isDirectory())
      .filter(entry => entry.name !== "conductor");
    const templates = entries.map(folder => ({ ...folder, preview: `data:image/png;base64,${fs.readFileSync(`./templates/${folder.name}/preview.png`, "base64")}`}));
    callback(templates);
  });

  socket.on("CLONE_DNA", (payload, callback) => {
    console.log("CLONE_DNA", payload);
    const cloneDna = `cp -r ./templates/${payload.template} ./dev-apps/${payload.name}/dna`;
    const dnaCloner = spawn(cloneDna, { shell: true });
    dnaCloner.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
    });
    dnaCloner.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
    });
    dnaCloner.on("exit", function(exitCode) {
      console.log("Child exited with code: " + exitCode);
      callback("Child exited with code: " + exitCode);
    });
  });

  socket.on("CLONE_DEV_CONDUCTOR", (payload, callback) => {
    console.log("CLONE_DEV_CONDUCTOR", payload);
    const cloneCondcutor = `cp -r ./templates/conductor ./dev-apps/${payload.name}/conductor`;
    const conductorCloner = spawn(cloneCondcutor, { shell: true });
    conductorCloner.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
    });
    conductorCloner.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
    });
    conductorCloner.on("exit", function(exitCode) {
      console.log("Dev conductor cloned " + exitCode);
      callback("Dev conductor cloned " + exitCode);
    });
  });

  socket.on("CLONE_SOCKET", (payload, callback) => {
    console.log("CLONE_DNA", payload);
    const cloneSocket = `cp ./templates/socket.js ./dev-apps/${payload.name}/socket.js`;
    const socketCloner = spawn(cloneSocket, { shell: true });
    socketCloner.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
    });
    socketCloner.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
    });
    socketCloner.on("exit", function(exitCode) {
      console.log("Child exited with code: " + exitCode);
      callback("Child exited with code: " + exitCode);
    });
  });

  socket.on("RECURSE_APPLICATION_FILES", (payload, callback) => {
    console.log("RECURSE_APPLICATION_FILES", payload.name);
    getFoldersAndFiles(`${__dirname}/dev-apps/${payload.name}/`, socket);
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

  socket.on("LINT_FILES", (payload, callback) => {
    const lintFiles = `cd dev-apps/${payload.name} && yarn lint`;
    console.log("LINT_FILES", lintFiles);
    callback("LINT_FILES", `Started creating ${payload.name}`);
    const fileLinter = spawn(lintFiles, { shell: true });
    fileLinter.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
      socket.emit("LINT_FILES_ERROR", err.toString());
    });
    fileLinter.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
      socket.emit("LINT_FILES_STDOUT", data.toString());
    });
    fileLinter.on("exit", function(exitCode) {
      console.log("Child exited with code: " + exitCode);
      socket.emit("LINT_FILES_EXIT", exitCode);
    });
  });

  socket.on("SERVE_WEB_APP", (payload, callback) => {
    console.log("SERVE_WEB_APP");
    const serveWebApp = `cd dev-apps/${payload.name} && yarn serve`;
    console.log("SERVE_WEB_APP", serveWebApp);
    callback("SERVE_WEB_APP", `Started ${payload.name}`);
    const fileServer = spawn(serveWebApp, { shell: true });
    fileServer.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
      socket.emit("SERVE_WEB_APP_ERROR", err.toString());
    });
    fileServer.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
      socket.emit("SERVE_WEB_APP_STDOUT", data.toString());
    });
    fileServer.on("exit", function(exitCode) {
      console.log("Child exited with code: " + exitCode);
      socket.emit("SERVE_WEB_APP_EXIT", exitCode);
    });
  });

  socket.on("SOCKET_SERVER", (payload, callback) => {
    console.log("SOCKET_SERVER");
    const socketServerCmd = `cd dev-apps/${payload.name} && yarn socket`;
    console.log("SOCKET_SERVER", socketServerCmd);
    callback("SOCKET_SERVER", `Started ${payload.name}`);
    const socketServer = spawn(socketServerCmd, { shell: true });
    socketServer.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
      socket.emit("SOCKET_SERVER_ERROR", err.toString());
    });
    socketServer.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
      socket.emit("SOCKET_SERVER_STDOUT", data.toString());
    });
    socketServer.on("exit", function(exitCode) {
      console.log("Child exited with code: " + exitCode);
      socket.emit("SOCKET_SERVER_EXIT", exitCode);
    });
  });

  socket.on("YARN_ADD", (payload, callback) => {
    console.log("YARN_ADD");
    const yarnAddCommand = `cd dev-apps/${payload.name} && yarn add ${payload.modules}`;
    console.log("YARN_ADD", yarnAddCommand);
    callback("YARN_ADD", `Started ${payload.name}`);
    const yarnAdd = spawn(yarnAddCommand, { shell: true });
    yarnAdd.stderr.on("data", function(err) {
      console.error("STDERR:", err.toString());
      socket.emit("YARN_ADD_ERROR", err.toString());
    });
    yarnAdd.stdout.on("data", function(data) {
      console.log("STDOUT:", data.toString());
      socket.emit("YARN_ADD_STDOUT", data.toString());
    });
    yarnAdd.on("exit", function(exitCode) {
      console.log("Child exited with code: " + exitCode);
      socket.emit("YARN_ADD_EXIT", exitCode);
    });
  });
});
io.on("error", () => {
  console.log("Error");
});

holochain.stdout.on("data", data => {
  if (`${data}`.indexOf("Conductor ready.") !== -1) {
    console.log("Connecting to Holochain conductor");
    hcAws
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
