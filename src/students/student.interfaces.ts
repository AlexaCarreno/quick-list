export interface Student {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  documentNumber: string;
  birthday: string;
  career: string;
  semester: number;
  phone?: string;
  residentialAddress?: string;
  photo?: string;
  hasFaceProfile: boolean;
  state: boolean;
  createdAt: string;
}

export const studentFilterMap = {
  name: "name",
  email: "email",
  documentNumber: "documentNumber",
  career: "career",
} as const;
