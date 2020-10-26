import Vue from "vue";
import Vuex from "vuex";
import builder from "@/apps/builder/builder";
import conductor from "@/apps/conductorAdmin/conductor";
import Dexie from "dexie";
import io from "socket.io-client";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    initialiseStore({ state }, payload) {
      state.db = new Dexie("holochain");
      state.socket = io(payload.webSocketUrl);
      state.db.version(1).stores({
        agents: "uuid,name,parent",
        applications: "uuid,name,parent",
        agentApplications: "uuid,name,agent",
        files: "[parentDir+name],parentDir"
      });
    }
  },
  modules: {
    conductor,
    builder
  }
});
