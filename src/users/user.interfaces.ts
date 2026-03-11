export interface Teacher {
  _id: string;
  userId: string;
  name: string;
  lastName: string;
  email: string;
  birthday: Date;
  photo: string;
  documentNumber: string;
  residentialAddress: string;
  professionalTitle: string;
  professionalLicenseNumber: string;
  state: boolean;
  createdAt: Date;
}

export const filterMap = {
  name: "nameContains",
  email: "emailContains",
  documentNumber: "documentNumberContains",
} as const;

export type TeacherFilter = keyof typeof filterMap;
