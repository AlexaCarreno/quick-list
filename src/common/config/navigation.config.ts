import type { Component } from "vue";

export interface NavigationItem {
  label: string;
  path: string;
  name: string; // nombre de ruta
  resource: string;
  action: string; // normalmente "access"
  showInMenu?: boolean;
  component: Record<string, () => Promise<Component>>;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Usuarios",
    path: "/users",
    name: "users",
    resource: "users",
    action: "access",
    showInMenu: true,
    component: {
      admin: () => import("../../users/view/UsersView.vue"),
    },
  },
  {
    label: "Estudiantes",
    path: "/students",
    name: "students",
    resource: "students",
    action: "access",
    showInMenu: true,
    component: {
      admin: () => import("../../students/view/StudentsView.vue"),
      teacher: () => import("../../students/view/StudentsView.vue"),
    },
  },
  {
    label: "Grupos",
    path: "/groups",
    name: "groups",
    resource: "groups",
    action: "access",
    showInMenu: true,
    component: {
      admin: () => import("../../groups/view/AdminGroupView.vue"),
      teacher: () => import("../../groups/view/TeacherGroupView.vue"),
    },
  },
  {
    label: "Asistencias",
    path: "/attendance",
    name: "attendance",
    resource: "attendance",
    action: "access",
    showInMenu: true,
    component: {
      admin: () => import("../../attendance/view/AttendanceView.vue"),
    },
  },
];
