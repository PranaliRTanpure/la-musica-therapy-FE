import type { StatusTone } from '@/components/common/StatusChip';

/** A status value plus how it should be rendered as a pill. */
export interface StatusValue {
  label: string;
  tone: StatusTone;
  dropdown?: boolean;
}

/** Shared contact fields present in every table row. */
interface ContactBase {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface LeadRow extends ContactBase {
  source: string;
  status: StatusValue;
  createdBy: string;
  createdOn: string;
}

export interface ProspectRow extends ContactBase {
  language: string;
  source: string;
  paymentSource: string;
  status: StatusValue;
}

/** Waiting-list rows share the prospect shape. */
export type WaitingListRow = ProspectRow;

export interface ClientRow extends ContactBase {
  language: string;
  source: string;
  program: string;
  condition: string;
  communityCenter: string;
  paymentSource: string;
  status: StatusValue;
}
