import React, { createContext, useState, useContext, useCallback } from 'react';
import merge from 'lodash.merge'; // Using a helper for deep merging

const PatientContext = createContext();

const initialState = {
  info: {
    firstName: "",
    lastName: "",
    hn: "",
    ward: "",
    name: "",
    gender: "",
  },
  assessment: {
    type: "", // 'SOFA' or 'APACHE'
    sofaValues: {
        respiration: '',
        platelets: '',
        bilirubin: '',
        cardiovascular: '',
        cns: '',
        renal: '',
    },
    apacheValues: {
        temperature: '',
        map: '',
        hr: '',
        rr: '',
        fio2: '',
        oxygenationValue: '',
        acidBaseMode: 'ph',
        acidBaseValue: '',
        sodium: '',
        potassium: '',
        creatinine: '',
        isArf: false,
        hematocrit: '',
        wbc: '',
        gcs: '',
        age: '',
        chronicConditions: {},
        surgeryStatus: null,
    },
  },
  priority: {
    rehScore: null,
  },
  cci: {
    comorbidities: {},
  },
  results: {
    sofaScore: null,
    apacheScore: null,
    assessmentRehScore: null,
    priorityRehScore: null,
    cciScore: null,
    cciRehScore: null,
    totalRehScore: null,
    riskLevel: "",
  }
};

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState(initialState);

  const updatePatientData = useCallback((newData) => {
    setPatientData(prev => merge({}, prev, newData));
  }, []);

  const resetPatientData = useCallback(() => {
    setPatientData(initialState);
  }, []);

  return (
    <PatientContext.Provider value={{ patientData, updatePatientData, resetPatientData }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);