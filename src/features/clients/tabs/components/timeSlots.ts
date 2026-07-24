import { addMinutes, format, parse } from 'date-fns';
import type { TimeSlotOption } from '@/components/common/TimeSlotList';

/** Half-hour slots from 9:00 AM to 5:00 PM, e.g. `{ value: '09:00', label: '9:00 - 9:30 AM' }`. */
export function buildTimeSlots(): TimeSlotOption[] {
  const slots: TimeSlotOption[] = [];
  let start = parse('09:00', 'HH:mm', new Date());
  const end = parse('17:00', 'HH:mm', new Date());

  while (start < end) {
    const slotEnd = addMinutes(start, 30);
    slots.push({
      value: format(start, 'HH:mm'),
      label: `${format(start, 'h:mm')} - ${format(slotEnd, 'h:mm a')}`,
    });
    start = slotEnd;
  }

  return slots;
}
