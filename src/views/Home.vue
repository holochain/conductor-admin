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
    </v-app-bar>
    <v-card outlined elevation="5" max-width="300" class="pa-2">
      <v-toolbar dense dark outlined rounded>
        <v-toolbar-title class="title">Conductor Admin for</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-title>Philip's Mac Book Pro</v-card-title>
      <v-list dense color="transparent">
        <v-list-item to="/agents" color="grey" exact>
          <v-badge color="green" content="16" overlap offset-y="15">
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
        <v-list-item to="/applications" color="grey" exact>
          <v-badge color="green" content="4" overlap offset-y="15">
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
        <v-list-item to="/cells" color="grey" exact>
          <v-badge color="green" content="64" overlap offset-y="15">
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
    <v-card-actions> </v-card-actions>
  </v-card>
</template>
<script>
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
        graphData: [3, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]
      },
      back: {
        title: "Monthly Summary",
        message:
          "Your average daily revenue for this month is <b>50.4$</b>. Much better than the last six months."
      }
    };
  }
};
</script>
