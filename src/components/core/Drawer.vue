<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    app
    clipped
    fixed
    dark
    height="100%"
    class="overflow-visible pa-0"
    left
    width="180"
  >
    <v-list dense color="transparent">
      <v-list-item to="/" color="grey" exact>
        <v-list-item-avatar size="30" class="ml-1 mr-5">
          <img src="@/assets/icons/GRADIENT_HALO.png" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            Conductors
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-for="(item, i) in items">
        <v-list-item
          v-if="!item.spacer"
          :key="`tile-${i}`"
          :to="item.to"
          :value="item.value"
          color="grey"
          exact
          v-on="item.click && { click: item.click }"
        >
          <v-list-item-avatar class="ml-0">
            <v-icon style="color: inherit" v-text="item.icon" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.text" />
          </v-list-item-content>
        </v-list-item>
        <v-divider
          v-else
          :key="`divider-${i}`"
          class="my-4 info"
          style="opacity: 0.22"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "CoreDrawer",
  props: ["navOpen"],
  data() {
    return {
      drawerOpen: false
    };
  },
  computed: {
    items() {
      return [
        {
          icon: "mdi-code-braces",
          text: "App Developer",
          to: "/builder"
        },
        {
          icon: "mdi-apps",
          text: "App Store",
          to: "/applications"
        }
      ];
    }
  },
  methods: {},
  watch: {
    navOpen(val) {
      this.drawerOpen = val;
    },
    drawerOpen(val) {
      if (val === false) this.$emit("close-nav-bar", val);
    }
  }
};
</script>
