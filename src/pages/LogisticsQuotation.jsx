import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendLogisticsEmail, sendWhatsAppTest } from "../utils/sendEmail";

const steps = [
  "Request Type",
  "Shipper Information",
  "Receiver Information",
  "Shipment Details",
  "Pickup & Delivery",
  "Insurance",
  "Additional Notes",
];

const StepIndicator = ({ current }) => (
        <div className="flex flex-col gap-3 mb-8">
    <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
      {steps.map((label, idx) => {
        const active = idx === current;
        const done = idx < current;
        return (
          <div key={label} className="flex-1 flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors duration-300 ${
                done
                  ? "border-green-500 bg-green-50 text-green-600"
                  : active
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              {done ? "✓" : idx + 1}
            </div>
                  <span className={`hidden sm:block ${active ? "text-blue-700" : "text-gray-600"}`}>
              {label}
            </span>
            {idx !== steps.length - 1 && (
                    <div className="hidden sm:block flex-1 h-0.5 bg-[rgba(148,163,184,0.5)] rounded-full ml-2"></div>
            )}
          </div>
        );
      })}
    </div>
    <div className="sm:hidden text-center text-xs text-gray-600">{steps[current]}</div>
  </div>
);

const ErrorText = ({ children }) => (
  <p className="text-sm text-red-500 mt-1">{children}</p>
);

const LogisticsQuotation = () => {
  const [step, setStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [whatsAppTesting, setWhatsAppTesting] = useState(false);
  const [whatsAppTestMessage, setWhatsAppTestMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    logisticsType: "Air Freight",
    serviceType: "Door-to-Door",
    shipmentUrgency: "Standard",
    shipper: {
      company: "",
      fullName: "",
      phone: "",
      email: "",
      country: "",
      city: "",
    },
    receiver: {
      company: "",
      fullName: "",
      phone: "",
      email: "",
      country: "",
      city: "",
    },
    shipmentDetails: {
      description: "",
      cargoType: "General",
      packages: "",
      weight: "",
      dimensions: { length: "", width: "", height: "" },
    },
    pickupDelivery: {
      pickupAddress: "",
      pickupDate: "",
      deliveryAddress: "",
      deliveryDate: "",
      needPacking: "No",
      needCustoms: "No",
    },
    insurance: {
      needInsurance: "No",
      declaredValue: "",
    },
    notes: {
      specialHandling: "",
      files: null,
    },
  });

  const volume = useMemo(() => {
    const { length, width, height } = form.shipmentDetails.dimensions;
    const l = Number(length) || 0;
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    return l && w && h ? ((l * w * h) / 1_000_000).toFixed(3) : "";
  }, [form.shipmentDetails.dimensions]);

  const handleChange = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      let ref = next;
      const keys = path.split(".");
      keys.slice(0, -1).forEach((k) => {
        ref[k] = { ...ref[k] };
        ref = ref[k];
      });
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const validateStep = (currentStep) => {
    const stepErrors = {};

    if (currentStep === 0) {
      if (!form.logisticsType) stepErrors.logisticsType = "Select a logistics type";
      if (!form.serviceType) stepErrors.serviceType = "Select a service type";
      if (!form.shipmentUrgency) stepErrors.shipmentUrgency = "Select shipment urgency";
    }

    if (currentStep === 1) {
      ["fullName", "phone", "email", "country", "city"].forEach((field) => {
        if (!form.shipper[field]) stepErrors[`shipper.${field}`] = "Required";
      });
    }

    if (currentStep === 2) {
      ["fullName", "phone", "email", "country", "city"].forEach((field) => {
        if (!form.receiver[field]) stepErrors[`receiver.${field}`] = "Required";
      });
    }

    if (currentStep === 3) {
      const sd = form.shipmentDetails;
      if (!sd.description) stepErrors.description = "Description required";
      if (!sd.cargoType) stepErrors.cargoType = "Cargo type required";
      if (!sd.packages) stepErrors.packages = "Number of packages required";
      if (!sd.weight) stepErrors.weight = "Weight required";
      if (!sd.dimensions.length || !sd.dimensions.width || !sd.dimensions.height) {
        stepErrors.dimensions = "All dimensions required";
      }
    }

    if (currentStep === 4) {
      const pd = form.pickupDelivery;
      if (!pd.pickupAddress) stepErrors.pickupAddress = "Pickup address required";
      if (!pd.pickupDate) stepErrors.pickupDate = "Pickup date required";
      if (!pd.deliveryAddress) stepErrors.deliveryAddress = "Delivery address required";
    }

    if (currentStep === 5) {
      if (form.insurance.needInsurance === "Yes" && !form.insurance.declaredValue) {
        stepErrors.declaredValue = "Declared value required";
      }
    }

    return stepErrors;
  };

  const handleNext = () => {
    const validationErrors = validateStep(step);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (step === steps.length - 1) {
        setShowConfirm(true);
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const handlePrev = () => setStep((prev) => Math.max(0, prev - 1));

  const handleWhatsAppTest = async () => {
    setWhatsAppTesting(true);
    setWhatsAppTestMessage("");
    const result = await sendWhatsAppTest("logistics");
    setWhatsAppTestMessage(
      result.success
        ? "Test WhatsApp notification sent to the admin number."
        : `WhatsApp test failed: ${result.error}`
    );
    setWhatsAppTesting(false);
  };

  const handleSubmit = async () => {
    const combinedErrors = {
      ...validateStep(0),
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
      ...validateStep(4),
      ...validateStep(5),
    };
    setErrors(combinedErrors);
    if (Object.keys(combinedErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        request: {
          logisticsType: form.logisticsType,
          serviceType: form.serviceType,
          shipmentUrgency: form.shipmentUrgency,
        },
        shipper: form.shipper,
        receiver: form.receiver,
        shipmentDetails: form.shipmentDetails,
        pickupDelivery: form.pickupDelivery,
        insurance: form.insurance,
        notes: form.notes,
        volume,
      };

      const result = await sendLogisticsEmail(payload);
      if (!result.success) {
        console.error('[LogisticsQuotation] Email submission failed:', result.error);
        throw new Error(result.error || "Submission failed");
      }
      console.log('[LogisticsQuotation] Email submitted successfully:', result.data);
      setSubmissionInfo({
        recordPath: result.data?.recordPath,
        recordUrl: result.data?.recordApiUrl || result.data?.recordUrl,
        recordId: result.data?.recordId,
        dashboardPath: result.data?.dashboardPath,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('[LogisticsQuotation] Error during form submission:', error);
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  const renderRequestType = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Logistics Type</label>
        <select
          value={form.logisticsType}
          onChange={(e) => handleChange("logisticsType", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          {["Air Freight", "Sea Freight", "Road Freight", "Courier", "Warehousing"].map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        {errors.logisticsType && <ErrorText>{errors.logisticsType}</ErrorText>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">Service Type</label>
        <select
          value={form.serviceType}
          onChange={(e) => handleChange("serviceType", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          {["Door-to-Door", "Door-to-Port", "Port-to-Door", "Port-to-Port"].map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        {errors.serviceType && <ErrorText>{errors.serviceType}</ErrorText>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">Shipment Urgency</label>
        <select
          value={form.shipmentUrgency}
          onChange={(e) => handleChange("shipmentUrgency", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          {["Standard", "Express"].map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        {errors.shipmentUrgency && <ErrorText>{errors.shipmentUrgency}</ErrorText>}
      </div>
    </div>
  );

  const renderPartyFields = (key, label) => {
    const data = form[key];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Company Name (optional)</label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => handleChange(`${key}.company`, e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Company"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange(`${key}.fullName`, e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors[`${key}.fullName`] && <ErrorText>{errors[`${key}.fullName`]}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange(`${key}.phone`, e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors[`${key}.phone`] && <ErrorText>{errors[`${key}.phone`]}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Email Address</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange(`${key}.email`, e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors[`${key}.email`] && <ErrorText>{errors[`${key}.email`]}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Country</label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => handleChange(`${key}.country`, e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors[`${key}.country`] && <ErrorText>{errors[`${key}.country`]}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => handleChange(`${key}.city`, e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors[`${key}.city`] && <ErrorText>{errors[`${key}.city`]}</ErrorText>}
        </div>
      </div>
    );
  };

  const renderShipmentDetails = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Shipment Description</label>
        <textarea
          value={form.shipmentDetails.description}
          onChange={(e) => handleChange("shipmentDetails.description", e.target.value)}
          rows={4}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        ></textarea>
        {errors.description && <ErrorText>{errors.description}</ErrorText>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Cargo Type</label>
          <select
            value={form.shipmentDetails.cargoType}
            onChange={(e) => handleChange("shipmentDetails.cargoType", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            {["General", "Fragile", "Hazardous", "Perishable", "Documents"].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          {errors.cargoType && <ErrorText>{errors.cargoType}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Number of Packages</label>
          <input
            type="number"
            min="1"
            value={form.shipmentDetails.packages}
            onChange={(e) => handleChange("shipmentDetails.packages", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors.packages && <ErrorText>{errors.packages}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Weight (kg)</label>
          <input
            type="number"
            min="0"
            value={form.shipmentDetails.weight}
            onChange={(e) => handleChange("shipmentDetails.weight", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors.weight && <ErrorText>{errors.weight}</ErrorText>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["length", "width", "height"].map((dim) => (
            <div key={dim}>
              <label className="block text-xs font-semibold text-gray-700 uppercase">{dim} (cm)</label>
              <input
                type="number"
                min="0"
                value={form.shipmentDetails.dimensions[dim]}
                onChange={(e) =>
                  handleChange(`shipmentDetails.dimensions.${dim}`, e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
        {errors.dimensions && <ErrorText>{errors.dimensions}</ErrorText>}
        {volume && (
          <p className="text-sm text-gray-500">Calculated volume: {volume} m³</p>
        )}
      </div>
    </div>
  );

  const renderPickupDelivery = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Pickup Address</label>
          <input
            type="text"
            value={form.pickupDelivery.pickupAddress}
            onChange={(e) => handleChange("pickupDelivery.pickupAddress", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors.pickupAddress && <ErrorText>{errors.pickupAddress}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Pickup Date</label>
          <input
            type="date"
            value={form.pickupDelivery.pickupDate}
            onChange={(e) => handleChange("pickupDelivery.pickupDate", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors.pickupDate && <ErrorText>{errors.pickupDate}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Delivery Address</label>
          <input
            type="text"
            value={form.pickupDelivery.deliveryAddress}
            onChange={(e) => handleChange("pickupDelivery.deliveryAddress", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors.deliveryAddress && <ErrorText>{errors.deliveryAddress}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Delivery Date (optional)</label>
          <input
            type="date"
            value={form.pickupDelivery.deliveryDate}
            onChange={(e) => handleChange("pickupDelivery.deliveryDate", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Need Packing Service?</label>
          <select
            value={form.pickupDelivery.needPacking}
            onChange={(e) => handleChange("pickupDelivery.needPacking", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Need Customs Clearance?</label>
          <select
            value={form.pickupDelivery.needCustoms}
            onChange={(e) => handleChange("pickupDelivery.needCustoms", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInsurance = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Need Cargo Insurance?</label>
        <select
          value={form.insurance.needInsurance}
          onChange={(e) => handleChange("insurance.needInsurance", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option>No</option>
          <option>Yes</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">Declared Cargo Value (USD)</label>
        <input
          type="number"
          min="0"
          value={form.insurance.declaredValue}
          onChange={(e) => handleChange("insurance.declaredValue", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          disabled={form.insurance.needInsurance !== "Yes"}
          placeholder={form.insurance.needInsurance !== "Yes" ? "Enabled when insurance is Yes" : ""}
        />
        {errors.declaredValue && <ErrorText>{errors.declaredValue}</ErrorText>}
      </div>
    </div>
  );

  const renderAdditionalNotes = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Special Handling Instructions</label>
        <textarea
          value={form.notes.specialHandling}
          onChange={(e) => handleChange("notes.specialHandling", e.target.value)}
          rows={4}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">File Uploads</label>
        <input
          type="file"
          multiple
          onChange={(e) => handleChange("notes.files", e.target.files)}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">Upload documents, images, or packing lists.</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (step === 0) return renderRequestType();
    if (step === 1) return renderPartyFields("shipper", "Shipper");
    if (step === 2) return renderPartyFields("receiver", "Receiver");
    if (step === 3) return renderShipmentDetails();
    if (step === 4) return renderPickupDelivery();
    if (step === 5) return renderInsurance();
    return renderAdditionalNotes();
  };

  if (submitted) {
    const recordHref = submissionInfo?.recordPath || submissionInfo?.recordUrl;
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-16 text-white">
        <div className="max-w-2xl w-full text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/30 text-white flex items-center justify-center text-3xl">✓</div>
          <h1 className="text-2xl font-bold">Your submission has been received.</h1>
          <p className="text-white/80">Our team will contact you shortly.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-white font-semibold hover:bg-white/10 transition"
            >
              Go Back
            </button>
            {recordHref && (
              <a
                href={recordHref}
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-white font-semibold hover:bg-white/10 transition"
              >
                Open admin record
              </a>
            )}
          </div>
          {submissionInfo?.recordId && (
            <p className="text-xs text-white/70">Reference ID: {submissionInfo.recordId}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-10 px-4 text-ink-900">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-ink-700 font-semibold">Logistics Quotation</p>
            <h1 className="text-3xl md:text-4xl font-bold text-ink-900">Request a Logistics Quote</h1>
            <p className="text-ink-700 mt-2">Tell us about your shipment, and we will craft a tailored solution.</p>
          </div>
          {volume && (
            <div className="text-sm text-ink-700">Calculated volume: {volume} m³</div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={handleWhatsAppTest}
            disabled={whatsAppTesting}
            className="inline-flex items-center justify-center rounded-md bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] px-3 py-2 text-xs font-semibold text-[#16A34A] hover:bg-[rgba(34,197,94,0.12)] disabled:opacity-60"
          >
            {whatsAppTesting ? "Sending WhatsApp test..." : "Send WhatsApp test (admin)"}
          </button>
          {whatsAppTestMessage && (
            <span className="text-sm text-ink-700">{whatsAppTestMessage}</span>
          )}
        </div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="p-0 md:p-0 bg-transparent border-0 shadow-none"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {errors.submit && <ErrorText>{errors.submit}</ErrorText>}

        <div className="mt-6 flex flex-col md:flex-row justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="inline-flex items-center justify-center rounded-full bg-[rgba(91,121,241,0.08)] border border-[rgba(91,121,241,0.25)] px-5 py-3 text-primary-600 font-semibold hover:bg-[rgba(91,121,241,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-white font-semibold shadow-none hover:bg-white/20 transition"
            >
              {step === steps.length - 1 ? "Review & Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="max-w-3xl w-full space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Confirm submission</h2>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-white/70 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-white/80">Please review key details before sending your request.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-0">
                <h3 className="font-semibold mb-2">Request</h3>
                <p>Type: {form.logisticsType}</p>
                <p>Service: {form.serviceType}</p>
                <p>Urgency: {form.shipmentUrgency}</p>
              </div>
              <div className="p-0">
                <h3 className="font-semibold mb-2">Shipment</h3>
                <p>{form.shipmentDetails.description || "No description"}</p>
                {volume && <p>Volume: {volume} m³</p>}
              </div>
              <div className="p-0">
                <h3 className="font-semibold mb-2">Shipper</h3>
                <p>{form.shipper.fullName || ""}</p>
                <p>{form.shipper.country || ""} {form.shipper.city || ""}</p>
              </div>
              <div className="p-0">
                <h3 className="font-semibold mb-2">Receiver</h3>
                <p>{form.receiver.fullName || ""}</p>
                <p>{form.receiver.country || ""} {form.receiver.city || ""}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-full bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsQuotation;
