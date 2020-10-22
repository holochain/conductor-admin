import Vue from "vue";
import Vuex from "vuex";
import { AdminWebsocket } from "@holochain/conductor-api";

Vue.use(Vuex);
const ADMIN_PORT = 3301;
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
    conductor: {
      uuid: "2deb6610-911c-4cfc-b3c4-d89af573fa58",
      name: "Phil's Holochain Conductor",
      folder: "/Users/philipbeadle/holochain-2020/conductor-admin/conductor/applicationDnas/"
    },
    agents: {},
    applications: {},
    agentApplications: {},
    agent: {
      agentKey: {},
      handle: "",
      avatar: ""
    },
    application: {
      name: "",
      preview: "",
      description: "",
      dnas: []
    }
  },
  actions: {
    fetchAgents({ rootState, commit }, payload) {
      const conductor = { ...payload };
      rootState.db.agents
        .where("parent")
        .equals(conductor.uuid)
        .toArray(agents => {
          commit("setAgents", agents);
          console.log(agents[0].agentKey);
          let fr = new FileReader();
          fr.onload = () => {
            console.log(fr.result);
          };
          fr.readAsBinaryString(agents[0].agentKey);
        });
      //  fetch from holochain in parallel to dexie
      //  .then(projects => {
      //    rootState.db.projects.bulkPut(projects).then(() => {
      //      commit("setProjects", projects);
      //    });
      //  });
    },
    async saveAgent({ rootState, commit }, payload) {
      const agent = { ...payload.agent, parent: payload.conductor.uuid };
      if (payload.action === "create") {
        const adminSocket = await AdminWebsocket.connect(`ws://localhost:${ADMIN_PORT}`);
        agent.agentKey = await adminSocket.generateAgentPubKey();
        console.log(agent.agentKey);
      }
      rootState.db.agents.put(agent).then(() => {
        if (payload.action === "create") {
          commit("createAgent", agent);
        } else {
          commit("updateAgent", agent);
        }
      });
      // save agent details in Holochain
    },
    deleteAgent({ rootState, commit }, payload) {
      const agent = { ...payload };
      rootState.db.agents.delete(agent.uuid).then(() => {
        commit("deleteAgent", agent);
      });
      // delete from Holochain
    },
    setProject({ rootState, commit }, payload) {
      rootState.db.projects.get(payload).then(project => {
        rootState.db.kanbanColumns
          .where("parent")
          .equals(project.uuid)
          .toArray(columns => {
            project.kanbanColumns = columns.sort(function(a, b) {
              return a.order - b.order;
            });
            commit("setProject", project);
            columns.forEach(column => {
              rootState.db.kanbanCards
                .where("parent")
                .equals(column.uuid)
                .toArray(cards => {
                  column.kanbanCards = cards.sort(function(a, b) {
                    return a.order - b.order;
                  });
                  commit("setProject", project);
                });
            });
          });
      });
    },
    fetchApplications({ rootState, commit }, payload) {
      const conductor = { ...payload };
      rootState.db.applications
        .where("parent")
        .equals(conductor.uuid)
        .toArray(applications => {
          commit("setApplications", applications);
        });
      //  fetch from holochain in parallel to dexie
      //  .then(projects => {
      //    rootState.db.projects.bulkPut(projects).then(() => {
      //      commit("setProjects", projects);
      //    });
      //  });
    },
    saveApplication({ rootState, commit }, payload) {
      const application = {
        ...payload.application,
        parent: payload.conductor.uuid
      };
      rootState.db.applications.put(application).then(() => {
        if (payload.action === "create") {
          commit("createApplication", application);
        } else {
          commit("updateApplication", application);
        }
      });
      // send to Holochain
      // .then(project => {
      // rootState.db.projects
      // .put(project)
      // .then(() => {
      //     commit("updateProject", project);
      //   }
    },
    deleteApplication({ rootState, commit }, payload) {
      const application = { ...payload };
      rootState.db.applications.delete(application.uuid).then(() => {
        commit("deleteApplication", application);
      });
      // delete from Holochain
    },
    fetchAgentApplications({ rootState, commit }, payload) {
      const agent = { ...payload };
      rootState.db.agentApplications
        .where("agent")
        .equals(agent.uuid)
        .toArray(agentApplications => {
          commit("setAgentApplications", agentApplications);
        });
      //  fetch from holochain in parallel to dexie
      //  .then(projects => {
      //    rootState.db.projects.bulkPut(projects).then(() => {
      //      commit("setProjects", projects);
      //    });
      //  });
    },
    installAgentApplication({ rootState, commit }, payload) {
      const agentApplication = {
        ...payload.application,
        agent: payload.agent.uuid
      };
      rootState.db.agentApplications.put(agentApplication).then(() => {
        if (payload.action === "create") {
          commit("createAgentApplication", agentApplication);
        } else {
          commit("updateAgentApplication", agentApplication);
        }
      });
      // send to Holochain
      // .then(project => {
      // rootState.db.projects
      // .put(project)
      // .then(() => {
      //     commit("updateProject", project);
      //   }
    }
  },
  mutations: {
    setAgents(state, payload) {
      state.agents = payload;
    },
    createAgent(state, payload) {
      state.agents.push(payload);
    },
    updateAgent(state, payload) {
      state.agents = state.agents.map(a =>
        a.uuid !== payload.uuid ? a : { ...a, ...payload }
      );
    },
    deleteAgent(state, payload) {
      state.agents = state.agents.filter(a => a.uuid !== payload.uuid);
    },
    setAgent(state, payload) {
      state.agent = payload;
    },
    setApplications(state, payload) {
      state.applications = payload;
    },
    createApplication(state, payload) {
      state.applications.push(payload);
    },
    updateApplication(state, payload) {
      state.applications = state.applications.map(a =>
        a.uuid !== payload.uuid ? a : { ...a, ...payload }
      );
    },
    deleteApplication(state, payload) {
      state.applications = state.applications.filter(
        a => a.uuid !== payload.uuid
      );
    },
    setAgentApplications(state, payload) {
      state.agentApplications = payload;
    },
  },
  modules: {}
};
