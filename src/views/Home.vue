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
      <span class="title">Conductors</span>
    </v-app-bar>
    <v-row height="100%">
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card outlined elevation="5" class="pa-2">
          <v-toolbar dense dark outlined rounded>
            <span>
              <div class="title header">
                Phil's Mac Book Pro
              </div>
            </span>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list dense color="transparent" class="mt-2">
            <v-list-item color="grey" exact>
              <v-badge
                color="green"
                content="16"
                overlap
                offset-y="20"
                offset-x="30"
              >
                <v-list-item-avatar size="30" class="ml-1 mr-5">
                  <v-icon>mdi-face-agent</v-icon>
                </v-list-item-avatar>
              </v-badge>
              <v-list-item-content>
                <v-list-item-title>
                  Agents
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item color="grey" exact>
              <v-badge
                color="green"
                content="4"
                overlap
                offset-y="20"
                offset-x="30"
              >
                <v-list-item-avatar size="30" class="ml-1 mr-5">
                  <v-icon>mdi-apps</v-icon>
                </v-list-item-avatar>
              </v-badge>
              <v-list-item-content>
                <v-list-item-title>
                  Available Apps
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item color="grey" exact>
              <v-badge
                color="green"
                content="64"
                overlap
                offset-y="20"
                offset-x="30"
              >
                <v-list-item-avatar size="30" class="ml-1 mr-5">
                  <v-icon>mdi-dna</v-icon>
                </v-list-item-avatar>
              </v-badge>
              <v-list-item-content>
                <v-list-item-title>
                  Cells
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="mb-2">
            <info-card
              :frontType="'graph'"
              :frontTitle="front.title"
              :frontData="front.graphData"
              :backTitle="back.title"
              :backData="back.message"
            />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card outlined elevation="5" class="pa-2">
          <v-toolbar dense dark outlined rounded>
            <span>
              <div class="title header">
                Phil's Dev
              </div>
            </span>
          </v-toolbar>
          <v-list dense color="transparent">
            <v-list-item to="/agents" color="grey" exact>
              <v-badge
                color="green"
                content="4"
                overlap
                offset-y="20"
                offset-x="30"
              >
                <v-list-item-avatar size="30" class="ml-1 mr-5">
                  <v-icon>mdi-face-agent</v-icon>
                </v-list-item-avatar>
              </v-badge>
              <v-list-item-content>
                <v-list-item-title>
                  Agents
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/builder" color="grey" exact>
              <v-badge
                color="green"
                content="3"
                overlap
                offset-y="20"
                offset-x="30"
              >
                <v-list-item-avatar size="30" class="ml-1 mr-5">
                  <v-icon>mdi-apps</v-icon>
                </v-list-item-avatar>
              </v-badge>
              <v-list-item-content>
                <v-list-item-title>
                  Apps In Development
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/cells" color="grey" exact>
              <v-badge
                color="green"
                content="64"
                overlap
                offset-y="20"
                offset-x="30"
              >
                <v-list-item-avatar size="30" class="ml-1 mr-5">
                  <v-icon>mdi-dna</v-icon>
                </v-list-item-avatar>
              </v-badge>
              <v-list-item-content>
                <v-list-item-title>
                  Cells
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <div class="mb-2">
            <info-card
              :frontType="'graph'"
              :frontTitle="front.title"
              :frontData="front.graphData2"
              :backTitle="back.title"
              :backData="back.message"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
import InfoCard from "vue-info-card";
export default {
  name: "Home",
  components: {
    InfoCard
  },
  data() {
    return {
      happy: false,
      front: {
        title: "Daily Statistics",
        graphData: [3, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
        graphData2: [8, 2, 5, 3, 2, 0, 0, 1, 9, 5, 10, 3, 5, 9, 0]
      },
      back: {
        title: "Monthly Summary",
        message:
          "Your average daily revenue for this month is <b>50.4$</b>. Much better than the last six months."
      }
    };
  },
  computed: {
    ...mapState("conductor", ["conductor"])
  }
};
</script>
<style scoped>
.header {
  white-space: nowrap;
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
