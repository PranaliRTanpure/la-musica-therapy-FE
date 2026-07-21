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
  profile: [
    {
      id: 'patient-information',
      title: 'Patient Information (Client Intake & Trial Session)',
      columns: 4,
      fields: [
        { label: 'Name', value: 'Julian Flores' },
        { label: 'Date of Birth', value: '06/11/2003' },
        { label: 'Age', value: '23 yrs' },
        { label: 'Gender', value: 'Female' },
        { label: 'Ethnicity', value: 'Asian' },
        { label: 'Diagnosis', value: 'Developmental Delay' },
        { label: 'Language Spoken', value: 'English' },
        { label: 'Phone', value: '(305) 555-6795' },
        { label: 'Email', value: 'julian.flores@example.com' },
        { label: 'Address', value: '5777 Verdugo Rd, Pasadena, CA 91101' },
        { label: 'Payment Source', value: 'Regional Center' },
        { label: 'Referral Source', value: 'Intake Form' },
      ],
    },
    {
      id: 'parent-guardian',
      title: 'Parent / Guardian (Trial Session Information)',
      columns: 3,
      fields: [
        { label: 'Guardian Name', value: 'John Flores' },
        { label: 'Relationship', value: 'Parent' },
        { label: 'Guardian Phone', value: '(818) 555-0477' },
      ],
    },
    {
      id: 'hipaa-consent',
      title: 'HIPAA Consent',
      columns: 3,
      fields: [
        { label: 'Print Name of Patient', value: 'Julian Flores' },
        // Empty values render as an em dash via `LabeledValue`.
        { label: 'Legal Representative', value: '' },
        { label: 'Relationship of Legal Rep', value: '' },
        { label: 'Acknowledgement', value: 'Received & signed' },
        { label: 'Confirm Appointments Via', value: 'Email, Text Message' },
        { label: 'Share Health Info Via', value: 'Email' },
      ],
    },
    {
      id: 'about-the-client',
      title: 'About the Client (Trial Session Information)',
      columns: 2,
      fields: [
        {
          label: 'Musical Experience',
          value:
            'Responds to rhythm and familiar melodies; sings along to preferred songs.',
        },
        {
          label: 'Areas of Strength / Needs',
          value:
            'Strong melodic response; working on expressive communication and attention.',
        },
        {
          label: 'Instruments of Interest',
          value: 'Piano, Drums / percussion',
        },
        {
          label: 'Program Goals',
          value:
            'Improve communication, attention, and emotional regulation through music therapy.',
        },
      ],
    },
  ],
  forms: [
    {
      id: 'f1',
      title: 'Consent Form',
      status: { label: 'Pending', tone: 'warning' },
      sentOn: '2026-10-08',
      completedOn: null,
    },
  ],
  documents: [
    {
      id: 'd1',
      title: 'Referral Letter',
      source: { label: 'by Provider', tone: 'warning' },
      uploadedOn: '2026-11-02',
      uploadedBy: 'Nicole Adams',
      summary:
        'This confirms that Julian Flores (Patient ID: LM-35877) has been referred to LA Musica Therapy on 11/02/2026 for a music therapy evaluation. Based on the presenting needs, individual music therapy services are recommended.',
      details: [
        { label: 'Diagnosis', value: 'Developmental Delay' },
        { label: 'Recommended Program', value: 'Individual Music Therapy' },
        { label: 'Referring Provider', value: 'Dr. Nicole Adams' },
      ],
    },
    {
      id: 'd2',
      title: 'Authorization Form',
      source: { label: 'by Provider', tone: 'warning' },
      uploadedOn: '2026-11-05',
      uploadedBy: 'Nicole Adams',
      summary:
        'Julian Flores (Patient ID: LM-35877) authorizes LA Musica Therapy to provide music therapy services and to share treatment records with the referring provider as required for continuity of care.',
      details: [
        { label: 'Authorization Period', value: '11/05/2026 – 05/05/2027' },
        { label: 'Authorized Sessions', value: '24' },
        { label: 'Payment Source', value: 'Regional Center' },
      ],
    },
  ],
};
