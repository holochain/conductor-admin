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
        <v-icon v-if="item.type === 'dir'" @click.stop="listDirectory(item); $emit('dir-selected', item)">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.extension] }}
        </v-icon>
      </template>
      <template v-slot:label="{ item }">
        <span v-if="item.type === 'dir'" @click.stop="listDirectory(item); $emit('dir-selected', item)">
          {{ item.name }}
        </span>
        <span v-else @click="$emit('file-selected', item)">
          {{ item.name }}
        </span>
      </template>
    </v-treeview>
  </div>
</template>
<script>
export default {
  name: "FileTree",
  props: ["height"],
  components: {},
  data() {
    return {
      refreshTreeKey: 0,
      codeWindowHeight: 200,
      open: [],
      active: [],
      initiallyOpen: ["Chat"],
      files: {
        zip: "mdi-folder-zip-outline",
        rar: "mdi-folder-zip-outline",
        htm: "mdi-language-html5",
        html: "mdi-language-html5",
        js: "mdi-nodejs",
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
        toml: "mdi-code-brackets",
        vue: "mdi-vuetify"
      },
      tree: [],
      items: []
    };
  },
  computed: {},
  methods: {
    setCodeWindowHeight() {
      this.codeWindowHeight = this.$el.clientHeight - 106;
    },
    createApplication() {
      console.log("createApplication");
    },
    async listDirectory(item) {
      const parentDir = `${item.parentDir}${item.name}/`
      console.log(parentDir);
      const entries = await this.$store.state.db.files.where({ parentDir }).toArray();
      item.children = entries.map(item => {
        if (item.type === "dir") {
          item.children = [];
        }
        return item;
      });      
      console.log(item);
      this.refreshTreeKey++;
    }
  },
  mounted() {
    this.setCodeWindowHeight();
    this.$store.state.db.files.where({ parentDir: "/" }).toArray(items => {
      console.log(items);
      this.items = items;
    });
  }
};
</script>
