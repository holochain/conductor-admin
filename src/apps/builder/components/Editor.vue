<template>
  <v-card flat tile height="100%" class="ma-0 pa-0">
    <v-tabs v-model="selectedTab" dark show-arrows height="40" ripple>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="f in openFiles" :key="`${f.parentDir}${f.name}`">
        {{ f.name }}
        <v-icon
          right
          small
          v-text="f.edited ? 'mdi-circle' : 'mdi-close'"
          @click="closeFile(f)"
        ></v-icon>
      </v-tab>
      <v-tab-item v-for="f in openFiles" :key="`${f.parentDir}${f.name}`">
        <code-window
          :key="`${f.parentDir}${f.name}${refreshKey}`"
          :file="f"
          :options="f.options"
          :height="height - 44"
          @edited="f.edited = $event"
        />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Editor",
  props: ["height"],
  components: {
    CodeWindow: () => import("./CodeWindow.vue")
  },
  methods: {
    ...mapMutations("builder", ["closeFile"]),
    ...mapActions("builder", ["openFileEdited"])
  },
  computed: {
    ...mapState("builder", ["openFiles", "openFile", "refreshKey"]),
    selectedTab: {
      get() {
        return this.$store.state.builder.selectedTab;
      },
      set(tab) {
        this.$store.commit("builder/setSelectedTab", tab);
      }
    }
  }
};
</script>
<style scoped>
.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}
</style>
