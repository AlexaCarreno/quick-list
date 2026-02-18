import type { Component } from "vue";

export interface NavigationItem {
  label: string;
  path: string;
  name: string; // nombre de ruta
  resource: string;
  action: string; // normalmente "access"
  showInMenu?: boolean;
  component: () => Promise<Component>;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Usuarios",
    path: "/users",
    name: "users",
    resource: "users",
    action: "access",
    showInMenu: true,
    component: () => import("../../users/view/UsersView.vue"),
  },
  {
    label: "Grupos",
    path: "/groups",
    name: "groups",
    resource: "groups",
    action: "access",
    showInMenu: true,
    component: () => import("../../groups/view/GroupsView.vue"),
  },
  {
    label: "Asistencias",
    path: "/attendance",
    name: "attendance",
    resource: "attendance",
    action: "access",
    showInMenu: true,
    component: () => import("../../attendance/view/AttendanceView.vue"),
  },
  {
    label: "Estudiantes",
    path: "/students",
    name: "students",
    resource: "students",
    action: "access",
    showInMenu: true,
    component: () => import("../../students/view/StudentsView.vue"),
  },
];
