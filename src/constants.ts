import { DailyProduction } from './types';
import { eachDayOfInterval } from 'date-fns';

export const TOTAL_CABINETS = 1083;
export const TOTAL_METERS = 6500;

export const generateMockProduction = (): DailyProduction[] => {
  const production: DailyProduction[] = [];
  const startDate = new Date(2026, 3, 1); // April 1st
  const endDate = new Date(2026, 7, 6); // August 6th

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  days.forEach((day, index) => {
    const month = day.getMonth();
    let cabinetTarget = 9;
    let meterTarget = 54;

    if (month === 3 || month === 4) { // April & May
      cabinetTarget = 7;
      meterTarget = 42;
    } else if (month === 5) { // June
      cabinetTarget = 8;
      meterTarget = 48;
    } else if (month === 6 || month === 7) { // July & August
      cabinetTarget = 9;
      meterTarget = 54;
    }

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
  { name: 'August', index: 7 },
];
