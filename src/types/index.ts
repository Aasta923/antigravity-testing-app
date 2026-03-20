export type RecordType = 'input' | 'output';

export type InputCategory = 'water' | 'diet' | 'iv' | 'tube' | 'other';
export type OutputCategory = 'urine' | 'stool' | 'drainage' | 'vomit' | 'other';

export interface IORecord {
  id: string;
  patientId: string;
  type: RecordType;
  category: string;
  amount: number; // in ml or frequency for stool
  unit: string;
  timestamp: string; // ISO String
  recordedBy: string; // User ID
  metadata?: {
    color?: string;
    consistency?: string;
    tubeType?: string;
    notes?: string;
  };
}

export interface Patient {
  id: string;
  name: string;
  bedNo: string;
  hospitalId: string;
  createdAt: any;
  updatedAt: any;
  customFields?: {
    inputNames?: Record<string, string>;
    outputNames?: Record<string, string>;
  };
}

export interface ShiftInfo {
  name: string;
  startTime: string; // "HH:mm"
  endTime: string;
}

export const SHIFTS: ShiftInfo[] = [
  { name: 'Day', startTime: '08:00', endTime: '16:00' },
  { name: 'Evening', startTime: '16:00', endTime: '00:00' },
  { name: 'Night', startTime: '00:00', endTime: '08:00' },
];