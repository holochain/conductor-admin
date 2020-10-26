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
    showRefresh: false
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
        commit("showRefresh", true);
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
        // Verify parentDir exists and is a directory:
        const dir = await rootState.db.files.get({
          parentDir: payload.parentDir
        });
        if (!dir) throw new Error("Parent dir not found");
        if (dir.type !== "dir") throw new Error("Parent is not a dir");
        await rootState.db.files.put({
          type: "file",
          name: payload.filename,
          parentDir: payload.parentDir,
          blob: ""
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
    async createApplication({ rootState }, payload) {
      const name = payload;
      rootState.db.files.put({
        parentDir: "",
        name,
        type: "dir"
      });
      rootState.socket.emit("CREATE_APPLICATION", { name }, message => {
        console.log(message);
      });
    }
  },
  mutations: {
    stdOutMessage(state, payload) {
      state.stdOutMessages.push(payload);
    },
    showRefresh(state, payload) {
      state.showRefresh = payload;
    }
  },
  modules: {}
};
