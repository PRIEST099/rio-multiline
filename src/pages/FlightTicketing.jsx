import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import airports from "airports";
import { sendFlightEmail, sendWhatsAppTest } from "../utils/sendEmail";

const steps = [
  "Trip Information",
  "Passenger Details",
  "Special Requests",
  "Payment & Confirmation",
];

const emptyPassenger = () => ({
  fullName: "",
  gender: "",
  dob: "",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  email: "",
  phone: "",
});

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
            <span
              className={`hidden sm:block ${
                active ? "text-blue-700" : "text-gray-600"
              }`}
            >
              {label}
            </span>
            {idx !== steps.length - 1 && (
              <div className="hidden sm:block flex-1 h-0.5 bg-[rgba(148,163,184,0.5)] rounded-full ml-2"></div>
            )}
          </div>
        );
      })}
    </div>
    <div className="sm:hidden text-center text-xs text-gray-600">
      {steps[current]}
    </div>
  </div>
);

const ErrorText = ({ children }) => (
  <p className="text-sm text-red-500 mt-1">{children}</p>
);

const airportDataset = airports.filter((a) => a && a.iata);

const formatAirport = (a) =>
  `${a.iata} - ${a.city || a.name || ""}, ${a.country || ""}`;

const AirportSelect = ({ label, value, onChange, error, placeholder }) => {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const matches = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return airportDataset.slice(0, 8);
    return airportDataset
      .filter((a) => {
        return (
          a.iata?.toLowerCase().includes(q) ||
          a.city?.toLowerCase().includes(q) ||
          a.name?.toLowerCase().includes(q) ||
          a.country?.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [query]);

  const handleSelect = (a) => {
    const formatted = formatAirport(a);
    onChange(formatted);
    setQuery(formatted);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {matches.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No matches found
            </div>
          )}
          {matches.map((a) => (
            <button
              type="button"
              key={`${a.iata}-${a.name}`}
              onClick={() => handleSelect(a)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 focus:bg-blue-50"
            >
              <div className="font-semibold text-gray-800">
                {a.iata} · {a.city || a.name}
              </div>
              <div className="text-xs text-gray-500">
                {a.name} · {a.country}
              </div>
            </button>
          ))}
        </div>
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

const FlightTicketing = () => {
  const [step, setStep] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [sendingTest, setSendingTest] = useState(false);
  const [whatsAppTesting, setWhatsAppTesting] = useState(false);
  const [whatsAppTestMessage, setWhatsAppTestMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    tripType: "one-way",
    departureAirport: "",
    destinationAirport: "",
    departureDate: "",
    returnDate: "",
    preferredDepartureTime: "Anytime",
    preferredAirline: "",
    preferredCabinClass: "Economy",
    passengers: { adults: 1, children: 0, infants: 0 },
    passengerDetails: [emptyPassenger()],
    seatPreference: "",
    mealPreference: "None",
    wheelchairAssistance: "No",
    additionalRequests: "",
    paymentMethod: "Card",
    billingName: "",
    billingAddress: "",
    agreement: false,
  });

  const totalPassengers = useMemo(
    () =>
      Math.max(
        1,
        Number(form.passengers.adults || 0) +
          Number(form.passengers.children || 0) +
          Number(form.passengers.infants || 0)
      ),
    [form.passengers]
  );

  const syncPassengerDetails = (nextCounts) => {
    const total = Math.max(
      1,
      Number(nextCounts.adults || 0) +
        Number(nextCounts.children || 0) +
        Number(nextCounts.infants || 0)
    );
    const next = [...form.passengerDetails].slice(0, total);
    while (next.length < total) {
      next.push(emptyPassenger());
    }
    setForm((prev) => ({
      ...prev,
      passengers: nextCounts,
      passengerDetails: next,
    }));
  };

  const handlePassengerCountChange = (field, value) => {
    const numeric = Math.max(0, Number(value) || 0);
    const nextCounts = { ...form.passengers, [field]: numeric };
    syncPassengerDetails(nextCounts);
  };

  const handlePassengerChange = (idx, field, value) => {
    const next = [...form.passengerDetails];
    next[idx] = { ...next[idx], [field]: value };
    setForm((prev) => ({ ...prev, passengerDetails: next }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep) => {
    const stepErrors = {};

    if (currentStep === 0) {
      if (!form.tripType) stepErrors.tripType = "Trip type is required";
      if (!form.departureAirport)
        stepErrors.departureAirport = "Departure airport is required";
      if (!form.destinationAirport)
        stepErrors.destinationAirport = "Destination airport is required";
      if (!form.departureDate)
        stepErrors.departureDate = "Departure date is required";
      if (form.tripType === "round-trip" && !form.returnDate) {
        stepErrors.returnDate = "Return date is required for round trips";
      }
      if (!form.preferredDepartureTime)
        stepErrors.preferredDepartureTime = "Choose a time";
      if (!form.preferredCabinClass)
        stepErrors.preferredCabinClass = "Choose a cabin class";
      if (totalPassengers < 1)
        stepErrors.passengers = "At least one passenger is required";
    }

    if (currentStep === 1) {
      form.passengerDetails.forEach((pax, idx) => {
        const prefix = `Passenger ${idx + 1}`;
        if (!pax.fullName)
          stepErrors[`pax-${idx}-fullName`] = `${prefix}: full name required`;
        if (!pax.gender)
          stepErrors[`pax-${idx}-gender`] = `${prefix}: gender required`;
        if (!pax.dob)
          stepErrors[`pax-${idx}-dob`] = `${prefix}: date of birth required`;
        if (!pax.nationality)
          stepErrors[`pax-${idx}-nationality`] = `${prefix}: nationality required`;
        if (!pax.passportNumber)
          stepErrors[`pax-${idx}-passportNumber`] = `${prefix}: passport number required`;
        if (!pax.passportExpiry)
          stepErrors[`pax-${idx}-passportExpiry`] = `${prefix}: passport expiry required`;
        if (!pax.email)
          stepErrors[`pax-${idx}-email`] = `${prefix}: email required`;
        if (!pax.phone)
          stepErrors[`pax-${idx}-phone`] = `${prefix}: phone required`;
      });
    }

    if (currentStep === 3) {
      if (!form.paymentMethod)
        stepErrors.paymentMethod = "Payment method is required";
      if (!form.billingName)
        stepErrors.billingName = "Billing name is required";
      if (!form.billingAddress)
        stepErrors.billingAddress = "Billing address is required";
      if (!form.agreement)
        stepErrors.agreement = "Please confirm the details are correct";
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
    const result = await sendWhatsAppTest("flight");
    setWhatsAppTestMessage(
      result.success
        ? "Test WhatsApp notification sent to the admin number."
        : `WhatsApp test failed: ${result.error}`
    );
    setWhatsAppTesting(false);
  };

  const handleSubmit = async () => {
    const finalErrors = {
      ...validateStep(0),
      ...validateStep(1),
      ...validateStep(3),
    };
    setErrors(finalErrors);
    if (Object.keys(finalErrors).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        tripInformation: {
          tripType: form.tripType,
          departureAirport: form.departureAirport,
          destinationAirport: form.destinationAirport,
          departureDate: form.departureDate,
          returnDate: form.tripType === "round-trip" ? form.returnDate : "",
          preferredDepartureTime: form.preferredDepartureTime,
          preferredAirline: form.preferredAirline,
          preferredCabinClass: form.preferredCabinClass,
          passengersText: `${form.passengers.adults}A / ${form.passengers.children}C / ${form.passengers.infants}I`,
        },
        passengers: form.passengerDetails,
        specialRequests: {
          seatPreference: form.seatPreference,
          mealPreference: form.mealPreference,
          wheelchairAssistance: form.wheelchairAssistance,
          additionalRequests: form.additionalRequests,
        },
        payment: {
          paymentMethod: form.paymentMethod,
          billingName: form.billingName,
          billingAddress: form.billingAddress,
          agreement: form.agreement,
        },
        totals: { totalPassengers },
      };

      const result = await sendFlightEmail(payload);
      if (!result.success) throw new Error(result.error || "Submission failed");
      setSubmissionInfo({
        recordPath: result.data?.recordPath,
        recordUrl: result.data?.recordApiUrl || result.data?.recordUrl,
        recordId: result.data?.recordId,
        dashboardPath: result.data?.dashboardPath,
      });
      setSubmitted(true);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  const handleSubmitTest = async () => {
    setErrors({});
    setShowConfirm(false);
    setSendingTest(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const payload = {
        tripInformation: {
          tripType: "one-way",
          departureAirport: "JFK - New York, USA",
          destinationAirport: "LHR - London, UK",
          departureDate: today,
          returnDate: "",
          preferredDepartureTime: "Morning",
          preferredAirline: "Sample Air",
          preferredCabinClass: "Economy",
          passengersText: "1A / 0C / 0I",
        },
        passengers: [
          {
            fullName: "Test Passenger",
            gender: "Male",
            dob: "1990-01-01",
            nationality: "USA",
            passportNumber: "P1234567",
            passportExpiry: "2030-12-31",
            email: "test@example.com",
            phone: "+10000000000",
          },
        ],
        specialRequests: {
          seatPreference: "Window",
          mealPreference: "Halal",
          wheelchairAssistance: "No",
          additionalRequests: "Sample request submitted via quick-send.",
        },
        payment: {
          paymentMethod: "Card",
          billingName: "Test User",
          billingAddress: "123 Sample Street, Test City",
          agreement: true,
        },
        totals: { totalPassengers: 1 },
      };

      const result = await sendFlightEmail(payload);
      if (!result.success) throw new Error(result.error || "Submission failed");
      setSubmissionInfo({
        recordPath: result.data?.recordPath,
        recordUrl: result.data?.recordApiUrl || result.data?.recordUrl,
        recordId: result.data?.recordId,
        dashboardPath: result.data?.dashboardPath,
      });
      setSubmitted(true);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSendingTest(false);
    }
  };

  const renderTripInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Trip Type
        </label>
        <select
          value={form.tripType}
          onChange={(e) => handleChange("tripType", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="one-way">One-way</option>
          <option value="round-trip">Round-trip</option>
          <option value="multi-city">Multi-city</option>
        </select>
        {errors.tripType && <ErrorText>{errors.tripType}</ErrorText>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Preferred Cabin Class
        </label>
        <select
          value={form.preferredCabinClass}
          onChange={(e) => handleChange("preferredCabinClass", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option>Economy</option>
          <option>Premium Economy</option>
          <option>Business</option>
          <option>First Class</option>
        </select>
        {errors.preferredCabinClass && (
          <ErrorText>{errors.preferredCabinClass}</ErrorText>
        )}
      </div>
      <AirportSelect
        label="Departure Airport"
        value={form.departureAirport}
        onChange={(val) => handleChange("departureAirport", val)}
        error={errors.departureAirport}
        placeholder="Search city, country, or IATA"
      />
      <AirportSelect
        label="Destination Airport"
        value={form.destinationAirport}
        onChange={(val) => handleChange("destinationAirport", val)}
        error={errors.destinationAirport}
        placeholder="Search city, country, or IATA"
      />
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Departure Date
        </label>
        <input
          type="date"
          value={form.departureDate}
          onChange={(e) => handleChange("departureDate", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
        {errors.departureDate && <ErrorText>{errors.departureDate}</ErrorText>}
      </div>
      {form.tripType === "round-trip" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Return Date
          </label>
          <input
            type="date"
            value={form.returnDate}
            onChange={(e) => handleChange("returnDate", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors.returnDate && <ErrorText>{errors.returnDate}</ErrorText>}
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Preferred Departure Time
        </label>
        <select
          value={form.preferredDepartureTime}
          onChange={(e) =>
            handleChange("preferredDepartureTime", e.target.value)
          }
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
          <option>Anytime</option>
        </select>
        {errors.preferredDepartureTime && (
          <ErrorText>{errors.preferredDepartureTime}</ErrorText>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Preferred Airline (optional)
        </label>
        <input
          type="text"
          value={form.preferredAirline}
          onChange={(e) => handleChange("preferredAirline", e.target.value)}
          placeholder="e.g., Qatar Airways"
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Passengers
        </label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {["adults", "children", "infants"].map((field) => (
            <div key={field} className="flex flex-col">
              <span className="text-xs uppercase text-gray-500">{field}</span>
              <input
                type="number"
                min="0"
                value={form.passengers[field]}
                onChange={(e) => handlePassengerCountChange(field, e.target.value)}
                className="mt-1 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
        {errors.passengers && <ErrorText>{errors.passengers}</ErrorText>}
      </div>
    </div>
  );

  const renderPassengerDetails = () => (
    <div className="space-y-6">
      {form.passengerDetails.map((pax, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">
              Passenger {idx + 1}
            </h3>
            <span className="text-sm text-gray-500">#{idx + 1}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={pax.fullName}
                onChange={(e) =>
                  handlePassengerChange(idx, "fullName", e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors[`pax-${idx}-fullName`] && (
                <ErrorText>{errors[`pax-${idx}-fullName`]}</ErrorText>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Gender
              </label>
              <select
                value={pax.gender}
                onChange={(e) =>
                  handlePassengerChange(idx, "gender", e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors[`pax-${idx}-gender`] && (
                <ErrorText>{errors[`pax-${idx}-gender`]}</ErrorText>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={pax.dob}
                onChange={(e) => handlePassengerChange(idx, "dob", e.target.value)}
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors[`pax-${idx}-dob`] && (
                <ErrorText>{errors[`pax-${idx}-dob`]}</ErrorText>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Nationality
              </label>
              <input
                type="text"
                value={pax.nationality}
                onChange={(e) =>
                  handlePassengerChange(idx, "nationality", e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors[`pax-${idx}-nationality`] && (
                <ErrorText>{errors[`pax-${idx}-nationality`]}</ErrorText>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Passport Number
              </label>
              <input
                type="text"
                value={pax.passportNumber}
                onChange={(e) =>
                  handlePassengerChange(idx, "passportNumber", e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors[`pax-${idx}-passportNumber`] && (
                <ErrorText>{errors[`pax-${idx}-passportNumber`]}</ErrorText>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Passport Expiry Date
              </label>
              <input
                type="date"
                value={pax.passportExpiry}
                onChange={(e) =>
                  handlePassengerChange(idx, "passportExpiry", e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors[`pax-${idx}-passportExpiry`] && (
                <ErrorText>{errors[`pax-${idx}-passportExpiry`]}</ErrorText>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                value={pax.email}
                onChange={(e) =>
                  handlePassengerChange(idx, "email", e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors[`pax-${idx}-email`] && (
                <ErrorText>{errors[`pax-${idx}-email`]}</ErrorText>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={pax.phone}
                onChange={(e) =>
                  handlePassengerChange(idx, "phone", e.target.value)
                }
                className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors[`pax-${idx}-phone`] && (
                <ErrorText>{errors[`pax-${idx}-phone`]}</ErrorText>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSpecialRequests = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Seat Preference
        </label>
        <select
          value={form.seatPreference}
          onChange={(e) => handleChange("seatPreference", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option value="">No preference</option>
          <option>Window</option>
          <option>Aisle</option>
          <option>Extra-Legroom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Meal Preference
        </label>
        <select
          value={form.mealPreference}
          onChange={(e) => handleChange("mealPreference", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option>None</option>
          <option>Halal</option>
          <option>Vegetarian</option>
          <option>Vegan</option>
          <option>Gluten-Free</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Wheelchair Assistance
        </label>
        <select
          value={form.wheelchairAssistance}
          onChange={(e) => handleChange("wheelchairAssistance", e.target.value)}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
        >
          <option>No</option>
          <option>Yes</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700">
          Additional Requests
        </label>
        <textarea
          value={form.additionalRequests}
          onChange={(e) => handleChange("additionalRequests", e.target.value)}
          rows={4}
          className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          placeholder="Extra notes for your booking"
        ></textarea>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Payment Method
          </label>
          <select
            value={form.paymentMethod}
            onChange={(e) => handleChange("paymentMethod", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option>Card</option>
            <option>Mobile Money</option>
            <option>Transfer</option>
          </select>
          {errors.paymentMethod && <ErrorText>{errors.paymentMethod}</ErrorText>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Billing Name
          </label>
          <input
            type="text"
            value={form.billingName}
            onChange={(e) => handleChange("billingName", e.target.value)}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
          {errors.billingName && <ErrorText>{errors.billingName}</ErrorText>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700">
            Billing Address
          </label>
          <textarea
            value={form.billingAddress}
            onChange={(e) => handleChange("billingAddress", e.target.value)}
            rows={3}
            className="w-full mt-2 rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          ></textarea>
          {errors.billingAddress && <ErrorText>{errors.billingAddress}</ErrorText>}
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={form.agreement}
          onChange={(e) => handleChange("agreement", e.target.checked)}
          className="mt-1"
        />
        <span>I confirm all details are correct</span>
      </label>
      {errors.agreement && <ErrorText>{errors.agreement}</ErrorText>}
    </div>
  );

  const renderStepContent = () => {
    if (step === 0) return renderTripInfo();
    if (step === 1) return renderPassengerDetails();
    if (step === 2) return renderSpecialRequests();
    return renderPayment();
  };

  if (submitted) {
    const recordHref = submissionInfo?.recordPath || submissionInfo?.recordUrl;
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-16 text-white">
        <div className="max-w-2xl w-full text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/30 text-white flex items-center justify-center text-3xl">
            ✓
          </div>
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
            <p className="text-xs text-white/70">
              Reference ID: {submissionInfo.recordId}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full py-10 px-4 text-ink-900">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-ink-700 font-semibold">
                Flight Ticketing
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-ink-900">
                Passenger Flight Booking
              </h1>
              <p className="text-ink-700 mt-2">
                A guided wizard to capture every detail for your itinerary.
              </p>
            </div>
            <div className="text-sm text-ink-700">
              Total passengers: {totalPassengers}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppTest}
                disabled={whatsAppTesting}
                className="inline-flex items-center justify-center rounded-lg bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.35)] px-4 py-2 text-sm font-semibold text-[#16A34A] hover:bg-[rgba(34,197,94,0.16)] disabled:opacity-60"
              >
                {whatsAppTesting
                  ? "Sending WhatsApp test..."
                  : "Send WhatsApp test (admin)"}
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={sendingTest}
                className="inline-flex items-center justify-center rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
              >
                {sendingTest
                  ? "Sending sample submission..."
                  : "Send sample submission"}
              </button>
            </div>
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
            <p className="text-white/80">
              Please review key details before sending your request.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-0">
                <h3 className="font-semibold mb-2">Trip</h3>
                <p>Type: {form.tripType}</p>
                <p>
                  {form.departureAirport} → {form.destinationAirport}
                </p>
                <p>Depart: {form.departureDate || "-"}</p>
                {form.tripType === "round-trip" && (
                  <p>Return: {form.returnDate || "-"}</p>
                )}
                <p>Cabin: {form.preferredCabinClass}</p>
              </div>
              <div className="p-0">
                <h3 className="font-semibold mb-2">Passengers</h3>
                <p>Total: {totalPassengers}</p>
                <ul className="list-disc list-inside space-y-1">
                  {form.passengerDetails.map((pax, idx) => (
                    <li key={idx}>{pax.fullName || `Passenger ${idx + 1}`}</li>
                  ))}
                </ul>
              </div>
              <div className="p-0 md:col-span-2">
                <h3 className="font-semibold mb-2">Payment</h3>
                <p>Method: {form.paymentMethod}</p>
                <p>Name: {form.billingName || "-"}</p>
                <p>Address: {form.billingAddress || "-"}</p>
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
    </>
  );
};

export default FlightTicketing;