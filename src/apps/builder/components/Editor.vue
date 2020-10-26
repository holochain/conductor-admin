<template>
  <v-card flat tile class="ma-0 pa-0">
    <v-tabs dark show-arrows height="40" ripple>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="i in 30" :key="i">
        File {{ i }}
        <v-icon
          right
          small
          v-text="codeTab.edited ? 'mdi-circle' : 'mdi-close'"
          @click="closeTab(codeTab)"
        ></v-icon>
      </v-tab>
    </v-tabs>
  </v-card>
</template>
<script>
export default {
  name: "Editor",
  data() {
    return {
      codeTab: {
        edited: false
      }
    };
  },
  methods: {
    closeTab(tab) {
      console.log("Close tab", tab);
    }
  }
};
</script>
