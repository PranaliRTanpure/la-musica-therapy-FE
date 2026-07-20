import type { HolidayRow } from './types';

/** Static sample rows; real data drops into the same columns as props. */
export const HOLIDAYS: HolidayRow[] = [
  {
    id: 'new-year',
    title: 'New Year',
    date: '2026-12-31',
    description: '',
    createdDate: '2026-08-15',
  },
  {
    id: 'mlk-day',
    title: 'Martin Luther King Jr. Day',
    date: '2026-09-17',
    description: '',
    createdDate: '2026-08-16',
  },
  {
    id: 'presidents-day',
    title: "Washington's Birthday (Presidents Day)",
    date: '2026-04-01',
    description: '',
    createdDate: '2026-05-30',
  },
  {
    id: 'juneteenth',
    title: 'Juneteenth',
    date: '2026-07-04',
    description: '',
    createdDate: '2026-12-10',
  },
  {
    id: 'thanksgiving',
    title: 'Thanksgiving',
    date: '2026-02-06',
    description: '',
    createdDate: '2026-10-28',
  },
  {
    id: 'christmas',
    title: 'Christmas',
    date: '2026-12-25',
    description: '',
    createdDate: '2026-09-23',
  },
];
