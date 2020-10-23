<template>
  <v-card height="100%" width="100%" class="pl-1 pt-1 pr-1">
    <v-app-bar app dense dark clipped-left tile elevation="5">
      <v-app-bar-nav-icon small @click.stop="$emit('open-nav-bar')" />
      <v-btn icon small @click="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-avatar size="30">
        <img :src="require('@/assets/icons/GRADIENT_HALO.png')" />
      </v-avatar>
      <v-toolbar-title class="title ml-2">
        Available Applications</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="action"
            icon
            v-bind="attrs"
            v-on="on"
            @click="applicationDetailsOpen = true"
            small
          >
            <v-icon>mdi-plus-box-outline</v-icon>
          </v-btn>
        </template>
        <span>Add an Application</span>
      </v-tooltip>
    </v-app-bar>
    <v-row no-gutters height="100%">
      <v-col
        v-for="application in applications"
        :key="application.uuid"
        cols="12"
        sm="4"
        md="3"
        lg="2"
      >
        <application
          :key="application.uuid"
          :application="application"
          :details="details"
          @open-application-detail="openApplicationDetail"
          @delete-application="showDeleteDialog"
        >
        </application>
      </v-col>
    </v-row>
    <confirm-action-dialog
      :isOpen="deleteDialog"
      :message="`delete ${this.actionApplication.name}`"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    <v-navigation-drawer
      v-model="applicationDetailsOpen"
      fixed
      dark
      class="black overflow-visible pa-0"
      right
      width="500"
    >
      <v-card height="100%" width="100%" tile class="pa-0 ma-0">
        <v-system-bar window dark>
          <v-icon>mdi-application</v-icon>
          <span>Application Details</span>
          <v-spacer></v-spacer>
          <v-icon v-if="!isEditing" @click="isEditing = true"
            >mdi-square-edit-outline</v-icon
          >
          <v-icon v-if="isEditing" @click="cancel">mdi-cancel</v-icon>
          <v-icon v-if="isEditing" @click="save">mdi-content-save</v-icon>
          <v-icon @click="cancel">mdi-close-box-outline</v-icon>
        </v-system-bar>
        <v-row no-gutters justify="center">
          <v-col>
            <v-form>
              <v-toolbar dark dense outlined rounded>
                <v-toolbar-title v-if="!isEditing">
                  {{ actionApplication.name }}
                </v-toolbar-title>
                <v-toolbar-title v-if="isEditing">
                  <v-text-field
                    dense
                    dark
                    outlined
                    class="title mt-6 pt-0 pl-n2"
                    v-model="actionApplication.name"
                    label="Name"
                  />
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-img
                v-if="!isEditing"
                height="300"
                contain
                :src="actionApplication.preview"
              >
              </v-img>
              <v-image-input
                :key="actionApplication.uuid"
                v-if="isEditing"
                v-model="actionApplication.preview"
                :image-quality="1"
                clearable
                image-format="jpeg,png"
                :image-width="200"
                :image-height="200"
                dark
                image-min-scaling="contain"
                class="ml-15 pl-10 mt-5 mb-n3"
              />
              <v-btn @click="uploadDnaFiles">Select DNAs</v-btn>
              <input type="file" @change="uploadFile" multiple>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
import { mapState, mapActions } from "vuex";
import VImageInput from "vuetify-image-input/a-la-carte";
import * as electron from "electron";
import * as fs from "fs";
import * as path from "path";

const dialog = electron.remote.dialog;
import axios from "axios";

export default {
  name: "Applications",
  components: {
    Application: () => import("../components/Application.vue"),
    VImageInput,
    ConfirmActionDialog: () =>
      import("@/components/core/ConfirmActionDialog.vue")
  },
  data() {
    return {
      details: false,
      isEditing: true,
      applicationDetailsOpen: false,
      actionApplication: {
        uuid: uuidv4(),
        name: "",
        preview: "",
        description: "",
        dnas: []
      },
      dnas: [],
      action: "create",
      deleteDialog: false
    };
  },
  methods: {
    ...mapActions("conductor", [
      "fetchApplications",
      "saveApplication",
      "deleteApplication"
    ]),
    openApplicationDetail(application) {
      this.isEditing = false;
      this.action = "update";
      this.actionApplication = { ...application };
      this.applicationDetailsOpen = true;
    },
    save() {
      this.saveApplication({
        action: this.action,
        conductor: this.conductor,
        application: this.actionApplication
      }).then(() => this.reset());
    },
    cancel() {
      this.reset();
    },
    reset() {
      this.actionApplication = {
        uuid: uuidv4(),
        name: "",
        preview: "",
        description: "",
        dnas: []
      };
      this.applicationDetailsOpen = false;
      this.isEditing = true;
    },
    showDeleteDialog(application) {
      this.actionApplication = application;
      this.deleteDialog = true;
    },
    confirmDelete() {
      this.deleteApplication(this.actionApplication).then(() => this.reset());
      this.deleteDialog = false;
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
    uploadFile (event) {
      this.actionApplication.dnas.push(event.target.files);
      const formData = new FormData();
      for (let i of Object.keys(event.target.files)) {
        formData.append('files', event.target.files[i])
      }
      axios.post("http://localhost:7401/uploadDnas", formData, {})
      .then(response => console.log(response.data));
    },
    uploadDnaFiles() {
      dialog
        .showOpenDialog({
          title: "Select each of the DNAs for this Application",
          defaultPath: "/",
          buttonLabel: "Upload",
          filters: [
            {
              name: "DNA File",
              extensions: ["dna.gz"]
            }
          ],
          properties: ["openFile", "multiSelections"]
        })
        .then(selected => {
          if (!selected.canceled) {
            selected.filePaths.forEach(file => {
              const dest = path.join(this.conductor.folder, path.basename(file));
              this.actionApplication.dnas.push(dest);
              fs.copyFileSync(file, dest, { overwrite: true });
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapState("conductor", ["conductor", "applications"])
  },
  mounted() {
    this.fetchApplications(this.conductor);
  }
};
</script>
