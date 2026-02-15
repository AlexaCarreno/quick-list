import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Person } from "../interfaces/student.interfaces";

export const useStudentStore = defineStore(
  "student",
  () => {
    const students = ref<Partial<Person>[]>([]);

    const computedStudents = computed(() => students.value);

    const addNewStudent = (student: Person) => {
      students.value.push(student);
    };

    const loadStudents = (studentsDb: Person[]) => {
      students.value = studentsDb;
    };

    const removeStudents = (studentIds: string[]) => {
      students.value = students.value.filter(
        (student) => !studentIds.includes(student._id!)
      );
    };

    const updateStudent = (updatedStudent: Person) => {
      const index = students.value.findIndex(
        (s) => s._id === updatedStudent._id
      );
      if (index !== -1) {
        students.value[index] = {
          ...students.value[index],
          ...updatedStudent,
        };
      }
    };

    return {
      computedStudents,

      addNewStudent,
      loadStudents,
      removeStudents,
      updateStudent
    };
  },
  { persist: true }
);
