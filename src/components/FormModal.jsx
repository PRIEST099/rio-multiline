import React, { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useFormModal } from "../context/FormModalContext";
import FlightTicketing from "../pages/FlightTicketing";
import LogisticsQuotation from "../pages/LogisticsQuotation";

const FormModal = () => {
  const { activeForm, isOpen, closeForm } = useFormModal() || {};

  if (!isOpen) return null;

  const renderContent = useMemo(() => {
    if (activeForm === "flight") return <FlightTicketing />;
    if (activeForm === "logistics") return <LogisticsQuotation />;
    return null;
  }, [activeForm]);

  const title =
    activeForm === "flight"
      ? "Flight ticketing form"
      : activeForm === "logistics"
        ? "Logistics quotation form"
        : "Form dialog";

  return (
    <Dialog.Root
      open={Boolean(isOpen)}
      onOpenChange={(open) => {
        if (!open) closeForm?.();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay fixed inset-0 z-[1000] bg-[rgba(15,23,42,0.35)] backdrop-blur-[4px]" />
        <Dialog.Content className="fixed inset-0 z-[1001] overflow-auto bg-transparent shadow-none p-0 focus:outline-none">
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
            <div className="glass-modal relative w-full max-w-6xl rounded-3xl border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.6)] backdrop-blur-[18px] backdrop-saturate-[1.3] shadow-[0_8px_32px_rgba(15,23,42,0.12),_inset_0_0_0_0.5px_rgba(91,121,241,0.15)] overflow-hidden">
              <Dialog.Close
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink-700 backdrop-blur hover:bg-[rgba(91,121,241,0.08)] hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                aria-label="Close dialog"
              >
                <X size={20} />
              </Dialog.Close>
              <div className="max-h-[90vh] overflow-y-auto">{renderContent}</div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FormModal;
