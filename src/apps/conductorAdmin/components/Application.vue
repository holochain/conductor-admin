<template>
  <v-card class="ma-1 pa-2" outlined dark elevation="5">
    <v-toolbar dense dark outlined rounded>
      <v-toolbar-title class="title">{{ application.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-img
      class="white--text align-end ma-2"
      max-width="400"
      :src="application.preview"
    >
    </v-img>
    <v-card-actions class="pa-0 pt-2">
      <v-toolbar dense dark outlined rounded elevation="5" class="pl-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              :to="`/app-agents/${application.uuid}`"
            >
              <v-icon>mdi-face-agent</v-icon>
            </v-btn>
          </template>
          <span>See which Agents have this Application</span>
        </v-tooltip>
        <slot> </slot>
        <v-spacer></v-spacer>
        <v-icon
          @click="$emit('delete-application', application)"
          color="warning"
        >
          mdi-delete-outline</v-icon
        >
        <v-icon @click="openApplicationDetail">
          mdi-details
        </v-icon>
      </v-toolbar>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Application",
  props: ["application", "details"],
  computed: {},
  methods: {
    openApplicationDetail() {
      this.$emit("open-application-detail", this.application);
    }
  }
};
</script>
