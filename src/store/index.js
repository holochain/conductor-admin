import Vue from "vue";
import Vuex from "vuex";
import conductor from "@/apps/conductorAdmin/conductor";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    initialiseDexie({ state }) {
      state.db.version(1).stores({
        agents: "uuid,name,parent",
        applications: "uuid,name,parent",
        agentApplications: "uuid,name,agent"
      });
    }
  },
  modules: {
    conductor
  }
});
