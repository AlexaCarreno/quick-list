export type GroupStatus = "active" | "inactive";
export type Shift = "AM" | "PM";
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface ISchedule {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  shift: Shift;
}

export interface Group {
  _id: string;
  referenceCode: string;
  subject: string;
  status: GroupStatus;
  color: string;
  period: string;
  startDate: string;
  endDate: string;
  minAttendanceThreshold: number;
  schedules: ISchedule[];
  teacherId?: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
  } | null;
  totalStudents?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const groupFilterMap = {
  subject: "subject",
  referenceCode: "referenceCode",
  period: "period",
} as const;

export type TeacherOption = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
};
