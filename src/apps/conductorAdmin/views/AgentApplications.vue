<template>
  <v-card height="100%" width="100%" class="pl-1 pt-1 pr-1">
    <v-app-bar app dense dark clipped-left tile elevation="5">
      <v-app-bar-nav-icon small @click.stop="$emit('open-nav-bar')" />
      <v-btn icon small @click="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-avatar size="30">
        <img :src="require('@/assets/icons/GRADIENT_HALO.png')" />
      </v-avatar>
      <v-toolbar-title v-if="!loading" class="title ml-2">
        {{ agent.handle }} Available Applications</v-toolbar-title
      >
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-card-title>Installed Applications for xx on this Conductor</v-card-title>
    <v-row no-gutters height="100%">
      <v-col
        v-for="application in applications"
        :key="application.uuid"
        cols="12"
        xs="6"
        sm="3"
        md="2"
        lg="2"
      >
        <agent-application
          :key="application.uuid"
          :application="application"
          :details="details"
        >
        </agent-application>
      </v-col>
    </v-row>
    <v-card-title>Available Applications for xx on this Conductor</v-card-title>
    <v-row no-gutters height="100%">
      <v-col
        v-for="application in applications"
        :key="application.uuid"
        cols="12"
        xs="6"
        sm="3"
        md="2"
        lg="2"
      >
        <agent-application
          :key="application.uuid"
          :application="application"
          :details="details"
          @install-application="showInstallDialog"
        >
        </agent-application>
      </v-col>
    </v-row>
    <confirm-action-dialog
      v-if="!loading"
      :isOpen="installDialog"
      :message="`install ${this.actionAgentApplication.application.name}`"
      @confirm="confirmInstall"
      @cancel="cancelInstall"
    />
  </v-card>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
import { mapState, mapActions } from "vuex";
export default {
  name: "Applications",
  components: {
    AgentApplication: () => import("../components/AgentApplication.vue"),
    ConfirmActionDialog: () =>
      import("@/components/core/ConfirmActionDialog.vue")
  },
  data() {
    return {
      details: false,
      loading: true,
      applicationDetailsOpen: false,
      actionAgentApplication: {
        uuid: uuidv4(),
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
      action: "create",
      installDialog: false
    };
  },
  methods: {
    ...mapActions("conductor", [
      "fetchApplications",
      "setAgent",
      "installAgentApplication"
    ]),
    showInstallDialog(agent, application) {
      this.actionAgentApplication = { uuid: uuidv4(), agent, application };
      this.installDialog = true;
    },
    confirmInstall() {
      this.installAgentApplication(this.actionAgentApplication);
      this.installDialog = false;
    },
    cancelInstall() {
      this.installDialog = false;
    }
  },
  computed: {
    ...mapState("conductor", [
      "conductor",
      "agent",
      "application",
      "applications"
    ])
  },
  mounted() {
    this.fetchApplications(this.conductor);
    this.setAgent(this.$route.params.uuid).finally(
      () => (this.loading = false)
    );
  }
};
</script>
