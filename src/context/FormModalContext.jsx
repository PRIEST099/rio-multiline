import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const FormModalContext = createContext(null);

export const FormModalProvider = ({ children }) => {
  const [activeForm, setActiveForm] = useState(null);

  const openForm = useCallback((formType) => {
    setActiveForm(formType || null);
  }, []);

  const closeForm = useCallback(() => {
    setActiveForm(null);
  }, []);

  const value = useMemo(
    () => ({ activeForm, isOpen: !!activeForm, openForm, closeForm }),
    [activeForm, openForm, closeForm]
  );

  return <FormModalContext.Provider value={value}>{children}</FormModalContext.Provider>;
};

export const useFormModal = () => useContext(FormModalContext);
