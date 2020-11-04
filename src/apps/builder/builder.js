import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
(function() {
  if ("File" in self) {
    File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer;
  }
  Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;

  function myArrayBuffer() {
    // this: File or Blob
    return new Promise(resolve => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsArrayBuffer(this);
    });
  }
})();
export default {
  namespaced: true,
  state: {
    applicationName: "",
    refreshKey: 0,
    stdOutMessages: [],
    appServerMessages: [],
    socketServerMessages: [],
    demoMessages: [
      "STDOUT: ✨  Creating project in /Users/philipbeadle/holochain-2020/conductor-admin/server/dev-apps/chat.",
      "STDOUT: ⚙️  Installing CLI plugins. This might take a while...",
      "STDOUT: info No lockfile found.",
      "STDOUT: [1/4] Resolving packages...",
      "STDOUT: ✨  Creating project in /Users/philipbeadle/holochain-2020/conductor-admin/server/dev-apps/chat.",
      "STDOUT: ⚙️  Installing CLI plugins. This might take a while...",
      "STDOUT: info No lockfile found.",
      "STDOUT: ✨  Creating project in /Users/philipbeadle/holochain-2020/conductor-admin/server/dev-apps/chat.",
      "STDOUT: ⚙️  Installing CLI plugins. This might take a while...",
      "STDOUT: info No lockfile found."
    ],
    showRefresh: false,
    items: [],
    openFiles: [],
    selectedTab: -1,
    openFile: {},
    dnaTemplates: []
  },
  actions: {
    initialise({ rootState, commit }) {
      rootState.socket.on("CREATE_APLICATION_STDOUT", data => {
        console.log("CREATE_APLICATION_STDOUT", data);
        commit("stdOutMessage", data);
      });
      rootState.socket.on("CREATE_APLICATION_ERROR", data => {
        console.log("CREATE_APLICATION_ERROR", data);
      });
      rootState.socket.on("CREATE_APLICATION_EXIT", data => {
        console.log("CREATE_APLICATION_EXIT", data);
        commit("showRefresh");
      });
      rootState.socket.on("RECURSE_APPLICATION_FILES", file => {
        console.log("RECURSE_APPLICATION_FILES", file);
        rootState.db.files.put(file);
      });
      rootState.socket.on("RECURSE_APPLICATION_FILES_ERROR", data => {
        console.log("RECURSE_APPLICATION_FILES_ERROR", data);
      });
      rootState.socket.on("RECURSE_APPLICATION_FILES_EXIT", data => {
        console.log("RECURSE_APPLICATION_FILES_EXIT", data);
      });

      rootState.socket.on("LINT_FILES_STDOUT", data => {
        console.log("LINT_FILES_STDOUT", data);
        commit("stdOutMessage", data);
      });
      rootState.socket.on("LINT_FILES_ERROR", data => {
        console.log("LINT_FILES_ERROR", data);
        commit("stdOutMessage", data);
      });
      rootState.socket.on("LINT_FILES_EXIT", data => {
        console.log("LINT_FILES_EXIT", data);
        commit("stdOutMessage", "LINT_FILES_EXIT");
      });

      rootState.socket.on("SERVE_WEB_APP_STDOUT", data => {
        console.log("SERVE_WEB_APP_STDOUT", data);
        commit("appServerMessage", data);
      });
      rootState.socket.on("SERVE_WEB_APP_ERROR", data => {
        console.log("SERVE_WEB_APP_ERROR", data);
        commit("appServerMessage", data);
      });
      rootState.socket.on("SERVE_WEB_APP_EXIT", data => {
        console.log("SERVE_WEB_APP_EXIT", data);
        commit("appServerMessage", "SERVE_WEB_APP_EXIT");
      });

      rootState.socket.on("SOCKET_SERVER_STDOUT", data => {
        console.log("SOCKET_SERVER_STDOUT", data);
        commit("socketServerMessage", data);
      });
      rootState.socket.on("SOCKET_SERVER_ERROR", data => {
        console.log("SOCKET_SERVER_ERROR", data);
        commit("socketServerMessage", data);
      });
      rootState.socket.on("SOCKET_SERVER_EXIT", data => {
        console.log("SOCKET_SERVER_EXIT", data);
        commit("socketServerMessage", "SOCKET_SERVER_EXIT");
      });
    },
    async createDirectory({ rootState }, payload) {
      rootState.db.files.put({
        parentDir: payload.parentDir,
        name: payload.name,
        type: "dir"
      });
      rootState.socket.emit(
        "CREATE_DIRECTORY",
        { path: `${payload.parentDir}/${payload.name}` },
        success => {
          console.log(success.path);
        }
      );
    },
    async createFile({ rootState }, payload) {
      console.log(payload);
      rootState.db.transaction("rw", rootState.db.files, async () => {
        await rootState.db.files.put({
          parentDir: payload.parentDir,
          name: payload.filename,
          type: "file"
        });
      });
      rootState.socket.emit(
        "CREATE_FILE",
        { path: `${payload.parentDir}/${payload.name}` },
        success => {
          console.log(success);
        }
      );
    },
    async createApplication({ commit, rootState }, payload) {
      const name = payload.name;
      rootState.db.files.put({
        parentDir: "/",
        name,
        type: "dir"
      });
      rootState.socket.emit("CREATE_APPLICATION", { name }, message => {
        commit("stdOutMessage", message);
      });
    },
    async recurseApplicationFiles({ rootState, dispatch }, payload) {
      const name = payload.name;
      console.log(name);
      rootState.socket.emit("RECURSE_APPLICATION_FILES", { name }, success => {
        console.log(success);
        dispatch("refreshFiles");
      });
    },
    async lintFiles({ rootState, dispatch, commit }, payload) {
      const name = payload.name;
      console.log(name);
      commit("clearStdOutMessages");
      rootState.socket.emit("LINT_FILES", { name }, success => {
        console.log(success);
        dispatch("refreshFiles");
      });
    },
    refreshFiles({ rootState, state, commit }) {
      console.log("refreshFiles");
      state.openFiles.map(oF => {
        console.log(oF.parentDir, oF.name);
        rootState.db.files
          .where("[parentDir+name]")
          .equals([oF.parentDir, oF.name])
          .first()
          .then(file => {
            console.log(file);
            commit("setFile", file);
          });
      });
    },
    openFileEdited({ rootState, commit }, payload) {
      console.log({
        parentDir: payload.parentDir,
        name: payload.name
      });
      rootState.db.files
        .where("[parentDir+name]")
        .equals([payload.parentDir, payload.name])
        .first()
        .then(file =>
          commit("openFileEdited", payload.content !== file.content)
        );
    },
    async serveWebApp({ rootState, commit }, payload) {
      const name = payload.name;
      console.log(name);
      commit("clearAppServerMessages");
      rootState.socket.emit("SERVE_WEB_APP", { name }, success => {
        console.log(success);
      });
    },
    async socketServer({ rootState, commit }, payload) {
      const name = payload.name;
      console.log(name);
      commit("clearSocketServerMessages");
      rootState.socket.emit("SOCKET_SERVER", { name }, success => {
        console.log(success);
      });
    },
    async getTemplates({ commit, rootState }) {
      console.log("GET_TEMPLATES");
      rootState.socket.emit("GET_TEMPLATES", { }, templates => {
        commit("dnaTemplates", templates);
      });
    },
    async cloneDna({ rootState,dispatch }, payload) {
      const template = payload.template;
      const name = payload.name;
      rootState.socket.emit("CLONE_DNA", { template, name }, message => {
        console.log(message);
        dispatch("recurseApplicationFiles", { name });
      });
    },
    async cloneDevConductor({ rootState,dispatch }, payload) {
      const name = payload.name;
      rootState.socket.emit("CLONE_DEV_CONDUCTOR", { name }, message => {
        console.log(message);
        dispatch("recurseApplicationFiles", { name });
      });
    },
    async cloneSocket({ rootState,dispatch }, payload) {
      const name = payload.name;
      rootState.socket.emit("CLONE_SOCKET", { name }, message => {
        console.log(message);
        dispatch("recurseApplicationFiles", { name });
      });
    }
  },
  mutations: {
    setApplicationName(state, payload) {
      state.applicationName = payload;
    },    
    clearStdOutMessages(state) {
      state.stdOutMessages = [];
    },
    stdOutMessage(state, payload) {
      state.stdOutMessages.push(payload);
    },
    clearAppServerMessages(state) {
      state.appServerMessages = [];
    },
    appServerMessage(state, payload) {
      state.appServerMessages.push(payload);
    },
    clearSocketServerMessages(state) {
      state.socketServerMessages = [];
    },
    socketServerMessage(state, payload) {
      state.socketServerMessages.push(payload);
    },
    dnaTemplates(state, payload) {
      state.dnaTemplates = payload;
    },
    showRefresh(state) {
      state.showRefresh = true;
    },
    setFile(state, payload) {
      state.openFiles = state.openFiles.map(file =>
        `${file.parentDir}/${file.name}` !==
        `${payload.parentDir}/${payload.name}`
          ? file
          : { ...file, ...payload }
      );
      state.refreshKey++;
    },
    openFile(state, payload) {
      const alreadyOpenTab = state.openFiles.findIndex(
        file =>
          `${file.parentDir}/${file.name}` ===
          `${payload.parentDir}/${payload.name}`
      );
      if (alreadyOpenTab === -1) {
        state.openFiles.push(payload);
        const opts = {
          tabSize: 2,
          keyMap: "sublime",
          mode: "javascript",
          theme: "base16-dark",
          readOnly: false,
          lineNumbers: true,
          line: true,
          lineWrapping: true
        };
        switch (payload.extension) {
          case "png":
          case "jpg":
          case "jpeg":
          case "gif":
            opts.mode = "image";
            break;
          case "rs":
            opts.mode = "rust";
            break;
          case "yaml":
          case "json":
          case "nix":
          case "code":
            opts.mode = "javascript";
            opts.json = true;
            break;
          case "js":
            opts.mode = "javascript";
            opts.json = false;
            break;
          case "md":
            opts.mode = "markdown";
            opts.lineNumbers = false;
            break;
          case "vue":
            opts.mode = "vue";
            break;
        }
        payload.options = opts;
        payload.edited = false;
        state.openFile = payload;
        state.selectedTab = state.openFiles.length - 1;
      } else {
        state.openFile = state.openFiles[alreadyOpenTab];
        state.selectedTab = alreadyOpenTab;
      }
    },
    setSelectedTab(state, payload) {
      state.selectedTab = payload;
      state.openFile = state.openFiles[payload];
    },
    closeFile(state, payload) {
      state.openFiles = state.openFiles.filter(
        file =>
          `${file.parentDir}/${file.name}` !==
          `${payload.parentDir}/${payload.name}`
      );
    },
    openFileEdited(state, payload) {
      state.openFile.edited = payload;
    }
  },
  modules: {}
};
