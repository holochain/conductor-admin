<template>
  <v-app-bar app dense dark clipped-left tile elevation="5">
    <v-app-bar-nav-icon small @click.stop="$emit('open-nav-bar')" />
    <v-btn icon small @click="$router.go(-1)">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-toolbar-title class="title ml-2">
      Holochain Developer Applications
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="action" icon v-bind="attrs" v-on="on" small>
          <v-icon>mdi-plus-box-outline</v-icon>
        </v-btn>
      </template>
      <span>Add an Agent</span>
    </v-tooltip>
  </v-app-bar>
</template>
<script>
export default {
  name: "ToolBar",
  components: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>
