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
  faceProfileId?: string;
  state: boolean;
  createdAt: string;
}
