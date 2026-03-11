import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../common/stores/authStore";
import { usePermissionStore } from "../common/stores/permissionsStore";
import { NAVIGATION_ITEMS } from "../common/config/navigation.config";

const protectedRoutes: RouteRecordRaw[] = NAVIGATION_ITEMS.map((item) => ({
  path: item.path.replace("/", ""),
  name: item.name,
  component: () => {
    const permissionStore = usePermissionStore();
    const role = permissionStore.roles[0];
    const loader = item.component[role];

    if (!loader) {
      return import("../common/view/NotFound.vue");
    }

    return loader();
  },
  meta: {
    resource: item.resource,
    action: item.action,
  },
}));

const routes: RouteRecordRaw[] = [
  // register routes here
  {
    path: "/sign-in",
    name: "login",
    component: () => import("../sign-in/view/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: "/sign-up",
    name: "register",
    component: () => import("../sign-up/view/RegisterView.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    name: "app",
    component: () => import("../common/layouts/AppContainer.vue"),
    children: [
      {
        path: "",
        name: "root",
        component: () => import("../common/view/EmptyView.vue"),
      },
      ...protectedRoutes,
      {
        path: "ui",
        name: "ui",
        component: () => import("../common/view/UiComponents.vue")
      }
    ],
  },
  {
    path: "/not-found",
    name: "NotFound",
    component: () => import("../common/view/NotFound.vue"),
    meta: { public: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "NotFound" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Variable para evitar múltiples navegaciones simultáneas
let isNavigating = false;

router.beforeEach(async (to, _from, next) => {
  // Si ya hay una navegación en progreso, esperar
  if (isNavigating) {
    console.log("⏳ Navegación en progreso, esperando...");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  isNavigating = true;

  try {
    const authStore = useAuthStore();
    const permissionStore = usePermissionStore();

    // Esperar hidratación real
    let attempts = 0;
    while (!authStore.hydrated && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      attempts++;
    }

    let isAuthenticated = !!authStore.accessToken;
    const isPublic = to.meta.public === true;

    // Si no hay token pero no es ruta pública, intentar refrescar
    if (!isAuthenticated && !isPublic) {
      try {
        const { tryRefreshToken } = await import("../api/api-client");
        const refreshed = await tryRefreshToken();

        if (refreshed) {
          isAuthenticated = true;
        } else {
          console.log("🔒 No autenticado");
          return next({ name: "login" });
        }
      } catch (error) {
        console.error("❌ Error refresh:", error);
        return next({ name: "login" });
      }
    }

    if (isAuthenticated && !permissionStore.loaded) {
      try {
        await permissionStore.loadPermissions();
      } catch (error) {
        console.error("❌ Error al cargar permisos:", error);

        authStore.clearAccesstoken();
        permissionStore.clear();
        return next({ name: "login" });
      }
    }

    if (isAuthenticated && to.name === "root") {
      const firstAllowed = NAVIGATION_ITEMS.find((item) =>
        permissionStore.can(item.resource, item.action),
      );

      if (firstAllowed) {
        return next({ name: firstAllowed.name });
      }

      return next("/not-found");
    }

    if (to.meta.resource && to.meta.action) {
      const allowed = permissionStore.can(
        to.meta.resource as string,
        to.meta.action as string,
      );
      if (!allowed) {
        return next("/not-found");
      }
    }

    next();
  } finally {
    // 🆕 Liberar el lock después de completar
    isNavigating = false;
  }
});

export default router;
