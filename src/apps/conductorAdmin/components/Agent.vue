<template>
  <v-card class="ma-1 pa-2" outlined dark elevation="5">
    <v-toolbar dense dark outlined rounded>
      <v-toolbar-title class="title">{{ agent.handle }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-img
      class="white--text align-end ma-2"
      max-width="400"
      :src="agent.avatar"
    >
    </v-img>
    <v-card-actions class="pa-0 pt-2">
      <v-toolbar dense dark outlined rounded elevation="5" class="pl-2">
        <v-btn icon small :to="`/agent-apps/${agent.uuid}`">
          <v-icon>mdi-apps</v-icon>
        </v-btn>
        <slot> </slot>
        <v-spacer></v-spacer>
        <v-icon @click="$emit('delete-agent', agent)" color="warning">
          mdi-delete-outline</v-icon
        >
        <v-icon @click="openAgentDetail">
          mdi-details
        </v-icon>
      </v-toolbar>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Agent",
  props: ["agent", "details"],
  computed: {},
  methods: {
    openAgentDetail() {
      this.$emit("open-agent-detail", this.agent);
    }
  }
};
</script>
