<template>
  <v-card height="100%" width="100%" v-resize="setCodeWindowHeight">
    <v-system-bar app color="primary" dark>
      <v-app-bar-nav-icon small @click.stop="$emit('open-nav-bar')" />
      <v-avatar size="20" class="mr-1">
        <img :src="require('@/assets/icons/GRADIENT_HALO.png')" />
      </v-avatar>
      <span class="subtitle-1 font-weight-bold">Crispr</span>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action darken-1"
            small
            tile
            text
            dark
            v-bind="attrs"
            v-on="on"
          >
            File
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="dialog = true" key="newApplication">
            <v-list-item-title>New Web App</v-list-item-title>
          </v-list-item>
          <v-list-item @click="newFolder" key="newFolder">
            <v-list-item-title>New Folder</v-list-item-title>
          </v-list-item>
          <v-list-item @click="newFile" key="newFile">
            <v-list-item-title>New File</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-system-bar>
    <v-row no-gutters height="100%">
      <v-col>
        <split :key="cwHeight" :style="`height: ${cwHeight}px; width: 100%;`" :gutterSize="2">
          <split-area :size="25">
            <file-tree
              @dir-selected="dirSelected"
              @file-selected="fileSelected"
            />
          </split-area>
          <split-area :size="75">
            <editor />
          </split-area>
        </split>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card dark outlined>
        <v-card-title>
          Let's build a new app!
        </v-card-title>
        <v-card-text class="pa-2">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  label="Name of your new Holochain App"
                  v-model="name"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="black">
                <div id="container" class="console-container rounded">
                  <ul class="pb-10 pl-0">
                    <li
                      v-for="(message, i) in stdOutMessages"
                      :key="i"
                      class="message"
                    >
                      <message :message="message" :key="i" />
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!showRefresh"
            color="action darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            v-if="!showRefresh"
            color="action darken-1"
            text
            @click="createApplication({ name })"
          >
            Create
          </v-btn>
          <v-btn
            v-if="showRefresh"
            color="action darken-1"
            text
            @click="recurseApplicationFiles({ name })"
          >
            Finish
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Builder",
  components: {
    FileTree: () => import("../components/FileTree.vue"),
    Editor: () => import("../components/Editor.vue"),
    Message: () => import("../components/Message.vue")
  },
  data() {
    return {
      cwHeight: 0,
      dialog: false,
      parentDir: "",
      name: ""
    };
  },
  computed: {
    ...mapState("builder", ["stdOutMessages", "showRefresh"])
  },
  methods: {
    ...mapActions("builder", [
      "createApplication",
      "createDirectory",
      "createFile",
      "recurseApplicationFiles"
    ]),
    setCodeWindowHeight() {
      this.cwHeight = this.$el.clientHeight;
    },
    dirSelected(directory) {
      this.parentDir = `${directory.parentDir}/${directory.name}`;
      console.log(this.parentDir);
    },
    fileSelected(file) {
      this.parentDir = `${file.parentDir}`;
      console.log(this.parentDir);
    },
    newFolder() {
      this.createDirectory({ parentDir: this.parentDir, name: "components" });
    },
    newFile() {
      this.createFile({ parentDir: this.parentDir, name: "something.js" });
    },
    scrollToEnd() {
      var container = this.$el.querySelector("#container");
      container.scrollTop = container.scrollHeight;
    }
  },
  mounted() {
    this.setCodeWindowHeight();
  }
};
</script>
<style scoped>
.v-btn {
  text-transform: none;
}
.console-container {
  box-sizing: border-box;
  overflow-y: auto;
  height: 300px;
}
ul {
  list-style-type: none;
}
</style>
