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
    stdOutMessages: [],
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
    items: []
  },
  actions: {
    initialise({ rootState, commit }) {
      rootState.socket.on("CREATE_APLICATION_STDOUT", (data) => {
        console.log("CREATE_APLICATION_STDOUT", data);
        commit("stdOutMessage", data);
      });
      rootState.socket.on("CREATE_APLICATION_ERROR", (data) => {
        console.log("CREATE_APLICATION_ERROR", data);
      });
      rootState.socket.on("CREATE_APLICATION_EXIT", (data) => {
        console.log("CREATE_APLICATION_EXIT", data);
        commit("showRefresh");
      });
      rootState.socket.on("RECURSE_APPLICATION_FILES", (file) => {
        console.log("RECURSE_APPLICATION_FILES", file);
        rootState.db.files.put(file);
      });
      rootState.socket.on("RECURSE_APPLICATION_FILES_ERROR", (data) => {
        console.log("RECURSE_APPLICATION_FILES_ERROR", data);
      });
      rootState.socket.on("RECURSE_APPLICATION_FILES_EXIT", (data) => {
        console.log("RECURSE_APPLICATION_FILES_EXIT", data);
      });
    },
    async createDirectory({ rootState }, payload) {
      rootState.db.files.put({
        parentDir: payload.parentDir,
        name: payload.name,
        type: "dir"
      });
      rootState.socket.emit("CREATE_DIRECTORY", { path: `${payload.parentDir}/${payload.name}` }, success => {
        console.log(success.path);
      });
    },
    async createFile({ rootState }, payload) {
      console.log(payload);
      rootState.db.transaction('rw', rootState.db.files, async ()=>{
        await rootState.db.files.put({
          parentDir: payload.parentDir,
          name: payload.filename,
          type: 'file'
        });
      }); 
      rootState.socket.emit("CREATE_FILE", { path: `${payload.parentDir}/${payload.name}` }, success => {
        console.log(success);
      });
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
    async recurseApplicationFiles({ rootState }, payload) {
      const name = payload.name;
      console.log(name);
      rootState.socket.emit("RECURSE_APPLICATION_FILES", { name }, success => {
        console.log(success);
      });
    }
  },
  mutations: {
    stdOutMessage(state, payload) {
      state.stdOutMessages.push(payload);
    },
    showRefresh(state) {
      state.showRefresh = true;
    }
  },
  modules: {}
};
