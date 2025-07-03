// src/context/PatientContext.js
import React, { createContext, useState, useContext } from 'react';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    name: "", // เก็บไว้เผื่อใช้ย้อนหลัง
    hn: "",
    ward: "",
    assessmentType: "",
    sofaScore: 0,
    apacheScore: 0,
    priorityScore: 0,
    cciScore: 0,
    totalScore: 0,
    riskLevel: ""
  });

  const updatePatientData = (newData) => {
    setPatientData(prev => ({ ...prev, ...newData }));
  };

  const resetPatientData = () => {
    setPatientData({
      firstName: "",
      lastName: "",
      name: "",
      hn: "",
      ward: "",
      assessmentType: "",
      sofaScore: 0,
      apacheScore: 0,
      priorityScore: 0,
      cciScore: 0,
      totalScore: 0,
      riskLevel: ""
    });
  };

  return (
    <PatientContext.Provider value={{ patientData, updatePatientData, resetPatientData }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);