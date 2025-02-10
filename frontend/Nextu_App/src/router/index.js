import { createRouter, createWebHistory } from "vue-router";
import DashView from "@/view/DashView.vue";
import HomeView from "@/view/HomeView.vue";
import UsersView from "@/view/UsersView.vue";
import ProfilView from "@/view/ProfilView.vue";
import LoginView from "@/view/LoginView.vue";
import NotFoundView from "@/view/NotFoundView.vue";
import SignInView from "@/view/SignInView.vue";
import CreateAdminView from "@/view/CreateAdminView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/SignIn",
      name: "SignIn",
      component: SignInView,
    },
    {
      path: "/dashboard",
      component: DashView,
      children: [
        {
          path: "home",
          name: "home",
          component: HomeView,
        },
        {
          path: "users",
          name: "users",
          component: UsersView,
        },
        {
          path: "create-admin",
          name: "create-admin",
          component: CreateAdminView,
        },
        {
          path: "user/:id",
          name: "user",
          component: ProfilView,
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          component: NotFoundView,
        },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  if (!isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
