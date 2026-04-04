

export interface GroupReportQuery {
    month?: string;
    from?: string;
    to?: string;
}

export interface StudentReportQuery {
    period: string;
}

export interface SessionSummary {
    sessionId: string;
    date: string;
    startTimestamp: string;
    dayLabel: string;
    month: string;
}

export interface SessionsByMonth {
    month: string;
    sessions: SessionSummary[];
}

export interface StudentSummary {
    present: number;
    absent: number;
    retarded: number;
    justified: number;
    applicableSessions: number;
    percentage: number;
    status: 'approved' | 'at_risk' | 'critical';
}

export interface StudentReportRow {
    studentId: string;
    name: string;
    lastName: string;
    documentNumber: string;
    attendanceMap: Record<string, 'P' | 'A' | 'R' | 'J' | 'N/A' | null>;
    summary: StudentSummary;
}

export interface GroupInfo {
    id: string;
    subject: string;
    referenceCode: string;
    period: string;
    minAttendanceThreshold: number;
}

export interface GroupMetrics {
    totalStudents: number;
    groupAverage: number;
    totalSessions: number;
    studentsAtRisk: number;
}

export interface GroupReportResponse {
    group: GroupInfo;
    metrics: GroupMetrics;
    sessionsByMonth: SessionsByMonth[];
    allSessions: SessionSummary[];
    students: StudentReportRow[];
    sessionAverages: Record<string, number>;
    cumulativeAverage: number;
}

export interface StudentProfile {
    studentId: string;
    name: string;
    lastName: string;
    email: string;
    documentNumber: string;
    phone: string | null;
    age: number;
    career: string;
    photo: string | null;
    period: string;
}

export interface SubjectAttendanceRow {
    groupId: string;
    subject: string;
    referenceCode: string;
    present: number;
    absent: number;
    totalSessions: number;
    percentage: number;
    status: 'approved' | 'at_risk' | 'critical';
}

export interface StudentReportResponse {
    profile: StudentProfile;
    totalGroups: number;
    subjects: SubjectAttendanceRow[];
}

export interface PeriodsResponse {
    periods: string[];
}

export interface StudentSearchResult {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    documentNumber: string;
    photo?: string;
    career: string;
}

export interface GroupOption {
    _id: string;
    subject: string;
    referenceCode: string;
    period: string;
}