import { DailyProduction } from './types';
import { eachDayOfInterval } from 'date-fns';

export const TOTAL_CABINETS = 1083;
export const TOTAL_METERS = 6500;

export const generateMockProduction = (): DailyProduction[] => {
  const production: DailyProduction[] = [];
  const startDate = new Date(2026, 3, 20); // April 20th
  const endDate = new Date(2026, 6, 22); // July 22nd (including buffer week)

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  days.forEach((day, index) => {
    let cabinetTarget = 12;
    let meterTarget = 72;

    production.push({
      id: `day-${index}`,
      date: day.toISOString(),
      cabinets: {
        target: cabinetTarget,
        actual: 0, // Project hasn't started
        status: 'not-started',
      },
      meters: {
        target: meterTarget,
        actual: 0, // Project hasn't started
        status: 'not-started',
      },
    });
  });

  return production;
};

export const MONTHS = [
  { name: 'April', index: 3 },
  { name: 'May', index: 4 },
  { name: 'June', index: 5 },
  { name: 'July', index: 6 },
];
