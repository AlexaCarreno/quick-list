export interface Person {
  _id: string;
  groupId: string;
  dni: string;
  birthday: Date; // o Date si deseas manejarlo como objeto Date
  name: string;
  lastName: string;
  email: string;
  phone: string;
  status?: 'active' | 'inactive'; // puedes ajustar los posibles valores según tu lógica
  image: string;
  createdAt?: Date; // o Date
  updatedAt?: Date; // o Date
}