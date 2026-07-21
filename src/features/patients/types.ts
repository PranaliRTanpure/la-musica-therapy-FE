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

/** A read-only label/value pair. An empty `value` renders as an em dash. */
export interface LabeledField {
  label: string;
  value: string;
}

/** How many columns a profile section uses at the `md` breakpoint and up. */
export type ProfileColumns = 2 | 3 | 4;

/** One titled card on the Profile tab. */
export interface ProfileSection {
  id: string;
  title: string;
  /** Defaults to 4. Long-form prose sections use 2. */
  columns?: ProfileColumns;
  fields: LabeledField[];
}

/** One form sent to the patient, tracked from sent → completed. */
export interface PatientForm {
  id: string;
  title: string;
  status: ChartStatus;
  /** ISO dates; display goes through `formatShortDate` in `src/utils/date.ts`. */
  sentOn: string;
  /** `null` until the patient completes the form. */
  completedOn: string | null;
}

/** A label/value row inside a document's rendered sheet. */
export interface DocumentDetail {
  label: string;
  value: string;
}

/** One uploaded document in the patient's chart. */
export interface PatientDocument {
  id: string;
  title: string;
  /** Chip on the card, e.g. "by Provider". */
  source: ChartStatus;
  /** ISO date; display goes through `formatShortDate` in `src/utils/date.ts`. */
  uploadedOn: string;
  uploadedBy: string;
  /** Body copy of the rendered document sheet. */
  summary: string;
  details: DocumentDetail[];
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
  documents: PatientDocument[];
  forms: PatientForm[];
  profile: ProfileSection[];
}
