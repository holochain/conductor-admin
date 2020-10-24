<template>
  <v-card height="100%" width="100%" class="pl-1 pt-1 pr-1">
    <v-app-bar app dense dark clipped-left tile elevation="5">
      <v-app-bar-nav-icon small @click.stop="$emit('open-nav-bar')" />
      <v-btn icon small @click="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="action" small tile text dark v-bind="attrs" v-on="on">
            File
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(item, index) in fileMenu"
            @click="item.click"
            :key="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="action" small tile text dark v-bind="attrs" v-on="on">
            Tools
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(item, index) in toolsMenu"
            @click="item.click"
            :key="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-row no-gutters height="100%">
      <v-col>
        <file-browser
          :axiosConfig="{ baseURL: 'http://localhost:11381/' }"
          :maxUploadFileSize="5242880"
          :maxUploadFilesCount="5"
          :windowHeight="520"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  name: "FileEditor",
  components: {
    FileBrowser: () =>
      import("@/components/core/vuetify-file-browser/FileBrowser.vue")
  },
  data() {
    return {};
  },
  computed: {
    fileMenu() {
      return [
        { title: "New File", click: () => this.$router.go("/agents") },
        { title: "New Folder", click: () => this.$router.go("/store") },
        { title: "Import Folder", click: () => this.$router.go("/cells") },
        { title: "Save", click: () => this.$router.go("/cells") }
      ];
    },
    toolsMenu() {
      return [{ title: "Vue UI", click: () => this.$router.go("/agents") }];
    }
  }
};
</script>
