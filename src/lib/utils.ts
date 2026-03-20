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
      const recordDate = new Date(record.timestamp?.toDate ? record.timestamp.toDate() : record.timestamp);
      
      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);
      
      const startTime = setMinutes(setHours(date, startH), startM);
      let endTime = setMinutes(setHours(date, endH === 0 ? 23 : endH), endM === 0 ? 59 : endM);
      
      if (endH === 0) {
        return isWithinInterval(recordDate, { start: startTime, end: endTime });
      } else if (startH === 0) {
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
  
  const shiftGroups = groupRecordsByShift(records, new Date());
  shiftGroups.forEach(group => {
    const urineOutput = records
      .filter(r => r.category === 'urine') 
      .reduce((sum, r) => sum + r.amount, 0);
      
    if (urineOutput > 0 && urineOutput < 300) {
      // alerts.push(`警告：本班次尿量過低 (${urineOutput}ml)`);
    }
  });

  return alerts;
};