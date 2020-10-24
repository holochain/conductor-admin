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
    conductor: {
      uuid: "2deb6610-911c-4cfc-b3c4-d89af573fa58",
      name: "Phil's Holochain Conductor",
      folder:
        "/Users/philipbeadle/holochain-2020/conductor-admin/conductor/applicationDnas/"
    },
    agents: {},
    applications: {},
    agentApplications: {},
    agent: {
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
    setAgent({ rootState, commit }, payload) {
      rootState.db.agents
        .get(payload)
        .then(agent => {
          rootState.db.agentApplications
            .where("agent")
            .equals(agent.uuid)
            .toArray(applications => {
              agent.agentApplications = applications;
              commit("setAgentApplications", applications);
              commit("setAgent", agent);
            });
        })
        .catch(err => console.log(err));
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
    installAgentApplication({ rootState, commit }, payload) {
      const agentApplication = {
        ...payload.application,
        uuid: payload.uuid,
        agent: payload.agent.uuid
      };
      rootState.db.agentApplications.put(agentApplication).then(() => {
        commit("createAgentApplication", agentApplication);
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
    createAgentApplication(state, payload) {
      state.agentApplications.push(payload);
    }
  },
  modules: {}
};
