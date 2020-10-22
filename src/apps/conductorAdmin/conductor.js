import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    conductor: {
      uuid: "2deb6610-911c-4cfc-b3c4-d89af573fa58",
      name: "Phil's Holochain Conductor"
    },
    agents: {},
    applications: {},
    agent: {
      agentPubKey: {},
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
    saveAgent({ rootState, commit }, payload) {
      const agent = { ...payload.agent, parent: payload.conductor.uuid };
      rootState.db.agents.put(agent).then(() => {
        if (payload.action === "create") {
          commit("createAgent", agent);
        } else {
          commit("updateAgent", agent);
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
    }
  },
  modules: {}
};
