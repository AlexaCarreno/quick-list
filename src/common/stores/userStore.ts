import { defineStore } from "pinia";
import { ref } from "vue";

export interface IUser {
  _id: string | null;
  roleId: string | null;
  name: string | null;
  lastName: string | null;
  birthday: Date | null;
  email: string | null;
  createdAt: Date | null;
  photo: string | null;
  state: boolean | null;
}

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<IUser | null>(null);

    const setUser = (newUser: IUser) => {
      user.value = newUser;
    };

    const cleanUser = () => {
      user.value = null;
    };

    const updateUser = (updates: Partial<IUser>) => {
      if (user.value) {
        user.value = { ...user.value, ...updates };
      }
    };

    return {
      /* properties */
      user,

      /* methods */
      setUser,
      cleanUser,
      updateUser,
    };
  },
  {
    persist: true,
  }
);
