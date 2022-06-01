import { isAfter, isBefore, isEqual } from 'date-fns';

export const isDateInRange = (date: Date | number, rangeStart: Date | number, rangeEnd: Date | number) =>
  isEqual(date, rangeStart) ||
  isEqual(date, rangeEnd) ||
  (isAfter(date, rangeStart) && isBefore(date, rangeEnd));
