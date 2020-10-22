import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/agents",
    name: "Agents",
    component: () => import("@/apps/conductorAdmin/views/Agents.vue")
  },
  {
    path: "/applications",
    name: "Applications",
    component: () => import("@/apps/conductorAdmin/views/Applications.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
