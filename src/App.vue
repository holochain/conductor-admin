<template>
  <v-fade-transition mode="out-in">
    <router-view />
  </v-fade-transition>
</template>

<script>
export default {
  name: "App",
  components: {
    // CoreDrawer: () => import("@/components/core/Drawer")
  },
  data() {
    return {
      navOpen: false
    };
  },
  created() {
    this.$store
      .dispatch("initialiseStore", { webSocketUrl: "http://localhost:11381" })
      .then(() => {
        this.$store.dispatch("builder/initialise");
        this.$store.dispatch("conductor/fetchAgents");
        this.$store.dispatch("conductor/fetchApplications");
      });
    this.$vuetify.theme.dark = true;
  }
};
</script>
<style scoped>
#router {
  height: 100% !important;
}
</style>
