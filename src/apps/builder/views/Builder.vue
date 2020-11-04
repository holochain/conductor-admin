<template>
  <v-card height="100%" width="100%">
    <v-app-bar app dark dense tile>
      <v-avatar size="30" class="mr-1">
        <img :src="require('@/assets/icons/GRADIENT_HALO.png')" />
      </v-avatar>
      <span class="subtitle-1 font-weight-bold mr-2 ml-2">Crispr</span>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action darken-1"
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
          <v-list-item @click="createApplicationDialog = true" key="newApplication">
            <v-list-item-avatar>
              <v-icon>mdi-vuetify</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>New Vuetify Web App</v-list-item-title>
          </v-list-item>
          <v-list-item key="newSocket" @click="cloneSocket({ name: applicationName })">
            <v-list-item-avatar size="25" class="ml-2">
              <img
                contain
                width="25"
                :src="require('@/assets/icons/socketio.png')"
              />
            </v-list-item-avatar>
            <v-list-item-title class="ml-2">New Socket.io</v-list-item-title>
          </v-list-item>
          <v-list-item key="newDna" @click="getTemplates(); addDnaDialog = true">
            <v-list-item-avatar>
              <v-icon>mdi-dna</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>New Holochain DNA</v-list-item-title>
          </v-list-item>
          <v-list-item key="newDevconductor" @click="cloneDevConductor({ name: applicationName })">
            <v-list-item-avatar size="35">
              <img
                contain
                width="25"
                :src="require('@/assets/icons/GRADIENT_HALO.png')"
              />
            </v-list-item-avatar>
            <v-list-item-title class="ml-1">New Developer Conductor</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="newFolder" key="newFolder">
            <v-list-item-avatar>
              <v-icon>mdi-folder-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>New Folder</v-list-item-title>
          </v-list-item>
          <v-list-item @click="newFile" key="newFile">
            <v-list-item-avatar>
              <v-icon>mdi-file-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>New File</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action darken-1"
            tile
            text
            dark
            v-bind="attrs"
            v-on="on"
          >
            Web App
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item key="addLayout">
            <v-list-item-avatar>
              <v-icon>mdi-page-layout-body</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Add Layout</v-list-item-title>
          </v-list-item>
          <v-list-item key="addModule">
            <v-list-item-avatar>
              <v-icon>mdi-folder-multiple-plus-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Add Module</v-list-item-title>
          </v-list-item>
          <v-list-item key="addAppComponent">
            <v-list-item-avatar>
              <v-icon>mdi-folder-multiple-plus-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Add App Component</v-list-item-title>
          </v-list-item>
          <v-list-item key="addComponent">
            <v-list-item-avatar>
              <v-icon>mdi-folder-multiple-plus-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Add Component</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            key="runWebApp"
            @click="
              stdMessagesDialog = true;
              terminalTitle = 'yarn serve';
              serveWebApp({ name: applicationName });
            "
          >
            <v-list-item-avatar>
              <v-icon>mdi-vuetify</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Serve Web App</v-list-item-title>
          </v-list-item>
          <v-list-item
            key="yarn lint"
            @click="
              stdMessagesDialog = true;
              terminalTitle = 'lint';
              lintFiles({ name: applicationName });
            "
          >
            <v-list-item-avatar>
              <v-icon>mdi-eslint</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Lint Files</v-list-item-title>
          </v-list-item>
          <v-list-item key="runSocket">
            <v-list-item-avatar size="25" class="ml-2">
              <img
                contain
                width="25"
                :src="require('@/assets/icons/socketio.png')"
              />
            </v-list-item-avatar>
            <v-list-item-title class="ml-2">Start Socket.io</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="dialog = true" key="newYarnAdd">
            <v-list-item-avatar>
              <v-icon>mdi-npm</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Add node module</v-list-item-title>
          </v-list-item>
          <v-list-item @click="dialog = true" key="yarnReinstall">
            <v-list-item-avatar>
              <v-icon>mdi-npm</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Reinstall node modules</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action darken-1"
            tile
            text
            dark
            v-bind="attrs"
            v-on="on"
          >
            DNA
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item key="testDna">
            <v-list-item-avatar size="25" class="ml-2">
              <img
                contain
                width="25"
                :src="require('@/assets/icons/GRADIENT_HALO.png')"
              />
            </v-list-item-avatar>
            <v-list-item-title class="ml-2">Test DNA</v-list-item-title>
          </v-list-item>
          <v-list-item key="addEntryType">
            <v-list-item-avatar>
              <v-icon>mdi-code-braces</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Add Entry Type</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action darken-1"
            tile
            text
            dark
            v-bind="attrs"
            v-on="on"
          >
            Conductor
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item key="addAgentKey">
            <v-list-item-avatar size="25" class="ml-2">
              <img
                contain
                width="25"
                :src="require('@/assets/icons/GRADIENT_HALO.png')"
              />
            </v-list-item-avatar>
            <v-list-item-title class="ml-2">Add Agent Key</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y dark>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action darken-1"
            tile
            text
            dark
            v-bind="attrs"
            v-on="on"
          >
            Window
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="stdMessagesDialog = true" key="bashTerminals">
            <v-list-item-avatar>
              <v-icon>mdi-bash</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Terminals</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action darken-1"
            tile
            text
            dark
            v-bind="attrs"
            v-on="on"
          >
            {{ applicationName }}
            <v-icon>mdi-source-branch</v-icon>
          </v-btn>
        </template>
        <span>Show the branch graph</span>
      </v-tooltip>
    </v-app-bar>
    <v-row no-gutters height="100%">
      <v-col>
        <split
          :key="cwHeight"
          :style="`height: ${cwHeight}px; width: 100%;`"
          :gutterSize="2"
        >
          <split-area :size="20">
            <file-tree
              @dir-selected="dirSelected"
              @file-selected="fileSelected"
              :height="cwHeight"
            />
          </split-area>
          <split-area :size="80">
            <editor :height="cwHeight" />
          </split-area>
        </split>
      </v-col>
    </v-row>
    <v-dialog v-model="stdMessagesDialog" persistent max-width="700px">
      <v-card dark outlined>
        <v-card-text class="pa-2">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" class="black">
                <v-tabs
                  v-model="terminalTab"
                  dark
                  show-arrows
                  height="40"
                  ripple
                >
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab>
                    App
                    <v-icon right small>
                      mdi-application
                    </v-icon>
                  </v-tab>
                  <v-tab-item key="appServerTab">
                    <div class="std-container">
                      <ul class="pb-10 pl-1">
                        <li
                          v-for="(message, i) in appServerMessages"
                          :key="i"
                          class="message"
                        >
                          <message :message="message" :key="i" />
                        </li>
                      </ul>
                    </div>
                  </v-tab-item>
                  <v-tab>
                    Socket
                    <v-avatar size="25" class="ml-2" @click="socketServer({ name: applicationName })">
                      <img
                        contain
                        width="25"
                        :src="require('@/assets/icons/socketio.png')"
                      />
                    </v-avatar>
                  </v-tab>
                  <v-tab-item key="socketServertab">
                    <div class="std-container">
                      <ul class="pb-10 pl-1">
                        <li
                          v-for="(message, i) in socketServerMessages"
                          :key="i"
                          class="message"
                        >
                          <message :message="message" :key="i" />
                        </li>
                      </ul>
                    </div>
                  </v-tab-item>
                  <v-tab>
                    Lint
                    <v-icon @click="lintFiles({ name: applicationName })">mdi-eslint</v-icon>
                  </v-tab>
                  <v-tab-item key="lintTab">
                    <div class="std-container">
                      <ul class="pb-10 pl-1">
                        <li
                          v-for="(message, i) in stdOutMessages"
                          :key="message"
                          class="message"
                        >
                          <message :message="message" :key="i" />
                        </li>
                      </ul>
                    </div>
                  </v-tab-item>
                  <v-tab>
                    DNA
                    <v-avatar size="25" class="ml-2">
                      <img
                        contain
                        width="25"
                        :src="require('@/assets/icons/GRADIENT_HALO.png')"
                      />
                    </v-avatar>
                  </v-tab>
                  <v-tab-item key="testDnaTab">
                    <div class="std-container">
                      <ul class="pb-10 pl-1">
                        <li
                          v-for="(message, i) in stdOutMessages"
                          :key="message"
                          class="message"
                        >
                          <message :message="message" :key="i" />
                        </li>
                      </ul>
                    </div>
                  </v-tab-item>
                </v-tabs>
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
            @click="stdMessagesDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createApplicationDialog" persistent max-width="600px">
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
                <div id="container" class="std-container">
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
            @click="createApplicationDialog = false"
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
            @click="recurseApplicationFiles({ name }); createApplicationDialog = false"
          >
            Finish
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addDnaDialog" persistent max-width="600px">
      <v-card dark outlined>
        <v-card-title>
          Clone a DNA Template
        </v-card-title>
        <v-card-text class="pa-3 pt-0">
          <v-container>
            <v-row height="100%">
              <v-col cols="12">
                <v-text-field
                  label="Name:"
                  v-model="name"
                  hint="Type the new DNA name here"
                  persistent-hint
                  dense
                ></v-text-field>
              </v-col>
              <v-col
                v-for="(template, index) in dnaTemplates"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                lg="4"
              >
                <dna-template
                  :key="index"
                  :template="template"
                  :details="true"
                >
                </dna-template>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="action darken-1" text @click="addDnaDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Builder",
  components: {
    FileTree: () => import("../components/FileTree.vue"),
    Editor: () => import("../components/Editor.vue"),
    Message: () => import("../components/Message.vue"),
    DnaTemplate: () => import("../components/DnaTemplate.vue")
  },
  data() {
    return {
      cwHeight: 700,
      terminalTitle: "Terminal",
      stdMessagesDialog: false,
      createApplicationDialog: false,
      addDnaDialog: false,
      parentDir: "",
      name: "",
      terminalTab: 0
    };
  },
  computed: {
    ...mapState("builder", [
      "applicationName",
      "stdOutMessages",
      "appServerMessages",
      "socketServerMessages",
      "showRefresh",
      "dnaTemplates"
    ]),
    ...mapState("conductor", ["conductor", "applications"])
  },
  methods: {
    ...mapActions("builder", [
      "createApplication",
      "createDirectory",
      "createFile",
      "recurseApplicationFiles",
      "lintFiles",
      "serveWebApp",
      "socketServer",
      "getTemplates",
      "cloneSocket",
      "cloneDevConductor"
    ]),
    ...mapMutations("builder", ["setApplicationName"]),
    setCodeWindowHeight() {
      this.cwHeight = this.$el.clientHeight - 44;
    },
    dirSelected(directory) {
      this.fileSelected(directory);
    },
    fileSelected(file) {
      this.parentDir = `${file.parentDir}${file.name}`;
      this.setApplicationName(`${this.parentDir.split("/")[1]}`);
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
.std-container {
  box-sizing: border-box;
  overflow-y: auto;
  background-color: black;
  height: 300px;
}
ul {
  list-style-type: none;
}
</style>
