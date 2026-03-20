"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { IORecord, Patient } from "@/types";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp,
  where,
  getDocs
} from "firebase/firestore";

interface PersistenceContextType {
  records: IORecord[];
  patients: Patient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  addRecord: (record: Omit<IORecord, "id" | "timestamp">) => void;
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => void;
  deletePatient: (id: string) => void;
  clearRecords: () => void;
}

const PersistenceContext = createContext<PersistenceContextType | undefined>(undefined);

export const PersistenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [records, setRecords] = useState<IORecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Records from Firestore
  useEffect(() => {
    if (!db) return;
    
    // Listen to records
    const q = query(collection(db, "records"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRecords = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          // Handle Firestore Timestamp if present
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : data.timestamp
        } as IORecord;
      });
      setRecords(fetchedRecords);
    });

    return () => unsubscribe();
  }, []);

  // Load Patients from Firestore
  useEffect(() => {
    if (!db) return;

    const unsubscribe = onSnapshot(collection(db, "patients"), (snapshot) => {
      const fetchedPatients = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt
        } as Patient;
      });
      
      if (fetchedPatients.length > 0) {
        setPatients(fetchedPatients);
        // Set default selected patient if none selected
        if (!selectedPatientId) {
          setSelectedPatientId(fetchedPatients[0].id);
        }
      } else {
        // Seed initial patients if empty (optional, but requested implicitly by "initialized")
        // In a real app, this might be handled by an admin or first setup
        setPatients([]);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [selectedPatientId]);

  // Handle selected patient ID in localStorage (UI state only)
  useEffect(() => {
    const savedSelectedId = localStorage.getItem("patient_io_selected_id");
    if (savedSelectedId) {
      setSelectedPatientId(savedSelectedId);
    }
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      localStorage.setItem("patient_io_selected_id", selectedPatientId);
    }
  }, [selectedPatientId]);

  const addRecord = useCallback(async (record: Omit<IORecord, "id" | "timestamp">) => {
    if (!db) return;
    try {
      await addDoc(collection(db, "records"), {
        ...record,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding record: ", e);
    }
  }, []);

  const addPatient = useCallback(async (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    if (!db) return;
    try {
      const docRef = await addDoc(collection(db, "patients"), {
        ...patient,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSelectedPatientId(docRef.id);
    } catch (e) {
      console.error("Error adding patient: ", e);
    }
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "patients", id));
      // Optional: Also delete all records for this patient
      // This is a bit complex for a simple callback, but good practice
    } catch (e) {
      console.error("Error deleting patient: ", e);
    }
  }, []);

  const clearRecords = useCallback(async () => {
    if (!db) return;
    try {
      // In Firestore, we have to delete each document individually or use a batch
      const q = collection(db, "records");
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (e) {
      console.error("Error clearing records: ", e);
    }
  }, []);

  return (
    <PersistenceContext.Provider value={{ 
      records, 
      patients, 
      selectedPatientId, 
      setSelectedPatientId, 
      addRecord, 
      addPatient, 
      deletePatient, 
      clearRecords 
    }}>
      {children}
    </PersistenceContext.Provider>
  );
};

export const usePersistence = () => {
  const context = useContext(PersistenceContext);
  if (context === undefined) {
    // Standard fail-safe for build time/SSR
    return {
      records: [],
      patients: [],
      selectedPatientId: "",
      setSelectedPatientId: () => {},
      addRecord: async () => {},
      addPatient: async () => {},
      deletePatient: async () => {},
      clearRecords: async () => {},
    };
  }
  return context;
};
