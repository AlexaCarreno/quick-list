export interface IGroup {
  _id?: string;
  institutionName: string;
  subject: string;
  referenceCode: string;
  status: "active" | "archived";
  createdAt?: Date;
  updatedAt?: Date;
}

export type INewGroupPayload = Pick<
  IGroup,
  "institutionName" | "subject" | "referenceCode"
>;
