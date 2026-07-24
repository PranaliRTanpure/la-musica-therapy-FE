import { z } from 'zod';
import type { AppSelectOption } from '@/components/common/AppSelect';

/**
 * Single source of truth for the Add Lead form's shape + validation. The TS
 * type is inferred from the schema, so the form and its data never drift.
 */
export const addLeadSchema = z.object({
  // --- 1. Lead (Patient) Details ---
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mobileNo: z.string().min(1, 'Mobile number is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  language: z.string().min(1, 'Language is required'),
  source: z.string().min(1, 'Source is required'),
  // Optional, but if provided must be MM/DD/YYYY (empty string = not provided).
  // Replace with a date-picker + parseISO pipeline before API integration.
  dateOfBirth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Use MM/DD/YYYY')
    .or(z.literal(''))
    .optional(),
  isMinor: z.enum(['yes', 'no']).optional(),
  homeAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  diagnosis: z.string().optional(),

  // --- 2. Funding & Authorization ---
  fundingType: z.string().optional(),
  regionalCenter: z.string().optional(),
  uciNumber: z.string().optional(),
  serviceCoordinator: z.string().optional(),

  // --- 3. Consents & Policies ---
  hipaaConsent: z.boolean().optional(),
  contactConsent: z.boolean().optional(),
  paymentPolicy: z.boolean().optional(),

  // --- 4. Service & Scheduling Setup ---
  assignedFacility: z.string().optional(),
  assignedTherapist: z.string().optional(),
  defaultSessionDuration: z.string().optional(),
  icdCodes: z.string().optional(),
  serviceTypes: z.array(z.string()).optional(),
});

export type AddLeadFormValues = z.infer<typeof addLeadSchema>;

/** Fully-populated defaults so every field is controlled from first render. */
export const addLeadDefaults: AddLeadFormValues = {
  firstName: '',
  lastName: '',
  mobileNo: '',
  email: '',
  language: '',
  source: '',
  dateOfBirth: '',
  isMinor: 'no',
  homeAddress: '',
  city: '',
  state: '',
  zip: '',
  preferredContactMethod: '',
  diagnosis: '',
  fundingType: '',
  regionalCenter: '',
  uciNumber: '',
  serviceCoordinator: '',
  hipaaConsent: false,
  contactConsent: false,
  paymentPolicy: false,
  assignedFacility: '',
  assignedTherapist: '',
  defaultSessionDuration: '',
  icdCodes: '',
  serviceTypes: [],
};

const opts = (...labels: string[]): AppSelectOption[] =>
  labels.map((label) => ({ label, value: label }));

// Static option lists — replace with API-driven data when the backend lands.
export const LANGUAGE_OPTIONS = opts('English', 'Spanish');
export const SOURCE_OPTIONS = opts(
  'Email',
  'Phone Call',
  'Regional Centre',
  'Walk In',
  'Website'
);
export const STATUS_OPTIONS = opts('Invite Sent');
export const MINOR_OPTIONS: AppSelectOption[] = [
  { label: 'No', value: 'no' },
  { label: 'Yes', value: 'yes' },
];
export const CONTACT_METHOD_OPTIONS = opts('Phone Call', 'Email', 'SMS');
export const FUNDING_OPTIONS = opts(
  'Regional Center',
  'Self Pay',
  'Self Determination',
  'Insurance'
);
export const REGIONAL_CENTER_OPTIONS = opts(
  'Frank D. Lanterman RC',
  'North LA County RC',
  'San Gabriel/Pomona RC',
  'Eastern LA RC'
);
export const FACILITY_OPTIONS = opts(
  'Downtown Center',
  'Westside Center',
  'Valley Center'
);
export const THERAPIST_OPTIONS = opts(
  'Sarah Kim',
  'Mark Wood',
  'Lisa Chen',
  'James Porter'
);
export const SESSION_DURATION_OPTIONS = opts('30 min', '45 min', '60 min');
export const SERVICE_TYPE_OPTIONS = opts(
  'Music Therapy 30',
  'Music Therapy 50',
  'Cyberna (group)',
  'Melodic Connections'
);
