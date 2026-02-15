import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../common/stores/authStore";
import { usePermissionStore } from "../common/stores/permissionsStore";

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
    path: "/ui",
    name: "ui",
    component: () => import("../common/view/UiComponents.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    name: "app",
    component: () => import("../common/layouts/AppContainer.vue"),
    children: [
      {
        path: "",
        redirect: { name: "users" },
      },
      {
        path: "users",
        name: "users",
        component: () => import("../users/view/UsersView.vue"),
        meta: {
          resource: "users",
          action: "read",
        },
      },
      {
        path: "groups",
        name: "groups",
        component: () => import("../prueba/Groups.vue"),
        meta: {
          resource: "groups",
          action: "read",
        },
      },
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
      console.log("⚠️ No hay token, intentando refrescar...");
      try {
        const { tryRefreshToken } = await import("../api/api-client");
        const refreshed = await tryRefreshToken();

        if (refreshed) {
          console.log("✅ Token refrescado exitosamente");
          isAuthenticated = true;
        } else {
          console.log("❌ No se pudo refrescar el token");
          return next({ name: "login" });
        }
      } catch (error) {
        console.error("❌ Error al intentar refrescar:", error);
        return next({ name: "login" });
      }
    }

    if (isAuthenticated) {
      console.log("✅ Intentando cargar permisos...");
      try {
        await permissionStore.loadPermissions();
        console.log("✅ Permisos cargados");
      } catch (error) {
        console.error("❌ Error al cargar permisos:", error);
        console.log("Token actual:", authStore.accessToken);

        authStore.clearAccesstoken();
        permissionStore.clear();
        return next({ name: "login" });
      }
    }

    if (isAuthenticated && to.path === "/") {
      if (permissionStore.can("groups", "read")) {
        return next({ name: "groups" });
      }
      if (permissionStore.can("users", "read")) {
        return next({ name: "users" });
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
