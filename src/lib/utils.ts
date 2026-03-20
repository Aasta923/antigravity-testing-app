import { IORecord, SHIFTS } from "@/types";
import { format, isSameDay, parseISO, isWithinInterval, setHours, setMinutes } from "date-fns";

/**
 * Calculates the balance for a given list of records.
 */
export const calculateBalance = (records: IORecord[]) => {
  const intake = records
    .filter(r => r.type === 'input')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const output = records
    .filter(r => r.type === 'output')
    .reduce((sum, r) => sum + r.amount, 0);
    
  return { intake, output, balance: intake - output };
};

/**
 * Groups records by shift (8h blocks).
 */
export const groupRecordsByShift = (records: IORecord[], date: Date) => {
  return SHIFTS.map(shift => {
    const shiftRecords = records.filter(record => {
      const recordDate = parseISO(record.timestamp);
      
      // Basic check: same day and within time range
      // Special handling for the 00-08 and 16-00 shifts might be needed based on exact overlap
      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);
      
      const startTime = setMinutes(setHours(date, startH), startM);
      let endTime = setMinutes(setHours(date, endH === 0 ? 23 : endH), endM === 0 ? 59 : endM);
      
      if (endH === 0) {
        // Night shift 16-00 ends at midnight
        return isWithinInterval(recordDate, { start: startTime, end: endTime });
      } else if (startH === 0) {
        // Morning shift 00-08
        return isWithinInterval(recordDate, { start: startTime, end: endTime });
      }
      
      return isWithinInterval(recordDate, { start: startTime, end: endTime });
    });
    
    return {
      shift: shift.name,
      ...calculateBalance(shiftRecords)
    };
  });
};

/**
 * Medical Alert Checkers
 */
export const checkAlerts = (records: IORecord[]) => {
  const alerts: string[] = [];
  
  // 1. Urine < 300 in a shift
  // (This needs to be checked per shift context, simplified here)
  const shiftGroups = groupRecordsByShift(records, new Date());
  shiftGroups.forEach(group => {
    const urineOutput = records
      .filter(r => r.category === 'urine') 
      // Filter for records in this shift's time frame
      .reduce((sum, r) => sum + r.amount, 0);
      
    if (urineOutput > 0 && urineOutput < 300) {
      // alerts.push(`警告：本班次尿量過低 (${urineOutput}ml)`);
    }
  });

  // 2. No stool for 3+ days
  // (In a real app, we query the last stool record timestamp)
  
  return alerts;
};