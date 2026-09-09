"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type ContactModalContextType = {
  isOpen: boolean;
  selectedPlatform: string;
  openModal: (platform?: string) => void;
  closeModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextType>({
  isOpen: false,
  selectedPlatform: "",
  openModal: () => {},
  closeModal: () => {},
});

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const openModal = useCallback((platform?: string) => {
    if (platform) {
      setSelectedPlatform(platform);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactModalContext.Provider
      value={{
        isOpen,
        selectedPlatform,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  return useContext(ContactModalContext);
}
