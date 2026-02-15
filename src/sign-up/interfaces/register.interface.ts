export interface IRegisterData {
  name: string;
  lastName: string;
  birthdate: Date | null;
  email: string;
  password: string;
  passwordConfirm: "";
}

export interface ISignUpVerification {
  email: string;
  code: string;
}
