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

      // grupos teacher
      {
        path: "groups/:id/session",
        name: "teacher-group-session",
        component: () => import("../groups/view/TeacherGroupDetailView.vue"),
        meta: {
          resource: "attendance",
          action: "access",
        },
      },
      // grupos admin
      {
        path: "groups/:id",
        name: "group-detail",
        component: () => import("../groups/view/GroupDetailView.vue"),
        meta: {
          resource: "groups",
          action: "access",
        },
      },
      // asistencia
      {
        path: "attendance/:id",
        name: "attendance-detail",
        component: () => import("../attendance/view/AttendanceDetailView.vue"),
        meta: { resource: "attendance", action: "access" },
      },
      {
        path: "attendance/:attendanceId/camera",
        name: "attendance-camera",
        component: () => import("../attendance/view/AttendanceCameraView.vue"),
        meta: { resource: "attendance", action: "access" },
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

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();
  const isPublic = to.meta.public === true;

  // Inicializar auth si aún no se ha hecho
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }

  if (isPublic) return next();

  if (!authStore.accessToken) {
    return next({ name: "login" });
  }

  if (!permissionStore.loaded) {
    try {
      await permissionStore.loadPermissions();
    } catch {
      authStore.clearAccessToken();
      return next({ name: "login" });
    }
  }

  if (to.name === "root") {
    const firstAllowed = NAVIGATION_ITEMS.find((item) =>
      permissionStore.can(item.resource, item.action),
    );
    return firstAllowed
      ? next({ name: firstAllowed.name })
      : next("/not-found");
  }

  if (to.meta.resource && to.meta.action) {
    const allowed = permissionStore.can(
      to.meta.resource as string,
      to.meta.action as string,
    );
    if (!allowed) return next("/not-found");
  }

  next();
});

export default router;
