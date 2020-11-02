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
  },
  {
    path: "/agent-applications/:uuid",
    name: "Agent Applications",
    component: () => import("@/apps/conductorAdmin/views/AgentApplications.vue")
  },
  {
    path: "/builder",
    name: "Builder",
    component: () => import("@/layouts/crispr/Index.vue"),
    children: [
      {
        path: "",
        name: "Builder1",
        component: () => import("@/apps/builder/views/Builder.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
