import type { StatusTone } from '@/components/common/StatusChip';

/** A status label plus the tone its pill should use. */
export interface ChartStatus {
  label: string;
  tone: StatusTone;
}

export interface PatientDemographics {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  pronouns: string;
  timeZone: string;
  languageSpoken: string;
  race: string;
  ethnicity: string;
  maritalStatus: string;
  diagnosis: string;
  patientId: string;
}

export interface PatientContact {
  mobileNumber: string;
  homePhoneNumber: string;
  emailId: string;
  faxNumber: string;
  address: string;
  paymentSource: string;
}

/** One form/document in the patient's chart. */
export interface PatientFormDocument {
  id: string;
  title: string;
  status: ChartStatus;
  sentOn: string;
  completedOn: string | null;
}

export interface PatientChart {
  id: string;
  name: string;
  patientId: string;
  status: ChartStatus;
  dateOfBirth: string;
  ageYears: number;
  phone: string;
  language: string;
  demographics: PatientDemographics;
  contact: PatientContact;
  documents: PatientFormDocument[];
}
