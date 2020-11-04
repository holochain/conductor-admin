<template>
  <div>
    <v-treeview
      :key="refreshTreeKey"
      :active.sync="active"
      :open.sync="open"
      :items="items"
      :load-children="listDirectory"
      activatable
      item-key="name"
      open-on-click
      dense
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon
          v-if="item.type === 'dir'"
          @click.stop="
            listDirectory(item);
            $emit('dir-selected', item);
          "
        >
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon
          v-else
          @click="
            openFile(item);
            $emit('file-selected', item);
          "
        >
          {{ files[item.extension] }}
        </v-icon>
      </template>
      <template v-slot:label="{ item }">
        <span
          v-if="item.type === 'dir'"
          @click.stop="
            listDirectory(item);
            $emit('dir-selected', item);
          "
        >
          {{ item.name }}
        </span>
        <span
          v-else
          @click="
            openFile(item);
            $emit('file-selected', item);
          "
        >
          {{ item.name }}
        </span>
      </template>
    </v-treeview>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "FileTree",
  components: {},
  data() {
    return {
      refreshTreeKey: 0,
      open: [],
      active: [],
      initiallyOpen: ["Chat"],
      files: {
        gitignore: "mdi-git",
        editorconfig: "mdi-code-brackets",
        browserslistrc: "mdi-format-list-checks",
        zip: "mdi-folder-zip-outline",
        rar: "mdi-folder-zip-outline",
        htm: "mdi-language-html5",
        html: "mdi-language-html5",
        js: "mdi-language-javascript",
        ts: "mdi-language-typescript",
        json: "mdi-code-json",
        pdf: "mdi-file-pdf",
        png: "mdi-file-image",
        jpg: "mdi-file-image",
        jpeg: "mdi-file-image",
        mp4: "mdi-filmstrip",
        mkv: "mdi-filmstrip",
        avi: "mdi-filmstrip",
        wmv: "mdi-filmstrip",
        mov: "mdi-filmstrip",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
        other: "mdi-file-outline",
        nix: "mdi-nix",
        rs: "mdi-code-braces",
        md: "mdi-language-markdown",
        yaml: "mdi-file-settings-outline",
        toml: "mdi-file-settings",
        vue: "mdi-vuetify",
        lock: "mdi-file-lock-outline",
        LICENSE: "mdi-license"
      },
      tree: [],
      items: []
    };
  },
  computed: {},
  methods: {
    ...mapMutations("builder", ["openFile"]),
    createApplication() {
      console.log("createApplication");
    },
    async listDirectory(item) {
      const parentDir = `${item.parentDir}${item.name}/`;
      return new Promise(resolve => {
        this.$store.state.db.files.where({ parentDir }).toArray(entries => {
          item.children = entries.map(entry => {
            if (entry.type === "dir") {
              entry.children = [];
            }
            return entry;
          });
          resolve();
        });
      });
    }
  },
  mounted() {
    this.$store.state.db.files.where({ parentDir: "/" }).toArray(entries => {
      console.log(entries);
      this.items = entries.map(entry => {
        if (entry.type === "dir") {
          entry.children = [];
        }
        return entry;
      });
      this.$emit('dir-selected', this.items[0]);
    });
  }
};
</script>
