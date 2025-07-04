
import React, { createContext, useState, useContext } from 'react';

const PatientContext = createContext();

const initialState = {
  info: {
    firstName: "",
    lastName: "",
    hn: "",
    ward: "",
  },
  assessment: {
    type: "", // 'SOFA' or 'APACHE'
    sofaValues: { // Raw input values from the form
        respiration: '',
        isVentilated: false,
        platelets: '',
        bilirubin: '',
        cardiovascular: '',
        cns: '',
        renal: '',
    },
    apacheValues: { // Raw input values from the form
        temperature: '', map: '', hr: '', rr: '',
        fio2: '', oxygenationValue: '', acidBaseMode: 'ph', acidBaseValue: '',
        sodium: '', potassium: '', creatinine: '', isArf: false, hematocrit: '', wbc: '', gcs: '', age: '',
        chronicHealthStatus: 'none',
    },
  },
  priority: {
    rehScore: 0,
  },
  cci: {
    comorbidities: {},
  },
  results: {
    sofaScore: 0,
    apacheScore: 0,
    assessmentRehScore: 0,
    priorityRehScore: 0,
    cciScore: 0,
    cciRehScore: 0,
    totalRehScore: 0,
    riskLevel: "",
  }
};

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState(initialState);

  const updatePatientData = (newData) => {
    // A simple merge for the first level of keys
    setPatientData(prev => ({ ...prev, ...newData }));
  };

  const resetPatientData = () => {
    setPatientData(initialState);
  };

  return (
    <PatientContext.Provider value={{ patientData, updatePatientData, resetPatientData }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);
