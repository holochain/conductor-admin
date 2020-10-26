<template>
  <v-app>
    <core-drawer :navOpen="navOpen" @close-nav-bar="navOpen = false" />
    <v-main>
      <v-responsive height="100%">
        <transition name="fade">
          <router-view id="router" @open-nav-bar="navOpen = !navOpen" />
        </transition>
      </v-responsive>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {
    CoreDrawer: () => import("@/components/core/Drawer")
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
