import type { PatientChart } from './types';

/**
 * Static sample chart mirroring the designers' screenshot. Structured so real
 * API data drops into the same components as props without layout changes; the
 * page will look this up by the route `:id` once the backend is wired.
 */
export const SAMPLE_PATIENT: PatientChart = {
  id: 'p1',
  name: 'Julian Flores',
  patientId: '35877',
  status: { label: 'Trial Pending', tone: 'neutral' },
  dateOfBirth: '06/11/2003',
  ageYears: 23,
  phone: '(305) 555-6795',
  language: 'English',
  demographics: {
    firstName: 'Julian',
    middleName: 'M.',
    lastName: 'Flores',
    preferredName: 'Julian',
    dateOfBirth: '06/11/2003',
    gender: 'Female',
    pronouns: 'She/Her',
    timeZone: 'PST',
    languageSpoken: 'English',
    race: 'Native American',
    ethnicity: 'Asian',
    maritalStatus: 'Married',
    diagnosis: 'Developmental Delay',
    patientId: '35877',
  },
  contact: {
    mobileNumber: '(305) 555-6795',
    homePhoneNumber: '(818) 555-0377',
    emailId: 'julian.flores@example.com',
    faxNumber: '(818) 555-0777',
    address: '5777 Verdugo Rd, Pasadena, CA 91101',
    paymentSource: 'Regional Center',
  },
  documents: [
    {
      id: 'd1',
      title: 'Consent Form',
      status: { label: 'Pending', tone: 'warning' },
      sentOn: '10/08/2026',
      completedOn: null,
    },
  ],
};
