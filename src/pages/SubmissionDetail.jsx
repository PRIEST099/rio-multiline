import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";

const formTypeLabels = {
  flight: "Flight Ticketing",
  logistics: "Logistics Quotation",
};

const formatDateTime = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch (e) {
    return String(value);
  }
};

const SubmissionDetail = () => {
  const { formType, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState(null);

  const label = useMemo(() => formTypeLabels[formType] || "Submission", [formType]);

  useEffect(() => {
    const fetchOne = async () => {
      if (!apiBase) {
        console.error('[SubmissionDetail] API base URL is not configured');
        setError("API base URL is not configured");
        setLoading(false);
        return;
      }
      try {
        console.log('[SubmissionDetail] Fetching submission:', formType, id);
        const res = await fetch(`${apiBase}/admin/submissions/${formType}/${id}`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
          console.error('[SubmissionDetail] Failed to load submission - status:', res.status, 'data:', data);
          throw new Error(data.message || "Failed to load submission");
        }
        console.log('[SubmissionDetail] Submission loaded successfully');
        setSubmission(data.submission || null);
      } catch (err) {
        console.error('[SubmissionDetail] Error fetching submission:', err);
        setError(err.message || "Failed to load submission");
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [formType, id]);

  const idString = useMemo(() => {
    if (!submission?._id) return id;
    if (typeof submission._id === "string") return submission._id;
    if (submission._id?.$oid) return submission._id.$oid;
    return id;
  }, [submission, id]);

  const rows = [
    { label: "Reference ID", value: idString },
    { label: "Form Type", value: label },
    { label: "Created", value: formatDateTime(submission?.createdAt) },
  ];

  const renderFlightDetail = () => {
    const data = submission?.data || {};
    const trip = data.tripInformation || {};
    const passengers = data.passengers || [];
    const special = data.specialRequests || {};
    const payment = data.payment || {};

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Trip overview</h2>
            <p className="text-sm text-slate-700 font-semibold">{trip.tripType || "Trip"}</p>
            <p className="text-sm text-slate-700">{trip.departureAirport || "-"} → {trip.destinationAirport || "-"}</p>
            <p className="text-sm text-slate-500">Depart: {trip.departureDate || "-"}{trip.returnDate ? ` · Return: ${trip.returnDate}` : ""}</p>
            <p className="text-sm text-slate-500">Cabin: {trip.preferredCabinClass || "-"} · Airline: {trip.preferredAirline || "Any"}</p>
            <p className="text-sm text-slate-500">Passengers: {trip.passengersText || data.totals?.totalPassengers || "-"}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Payment & contact</h2>
            <p className="text-sm text-slate-700">Billing name: {payment.billingName || "-"}</p>
            <p className="text-sm text-slate-700">Payment method: {payment.paymentMethod || "-"}</p>
            <p className="text-sm text-slate-500">Billing address: {payment.billingAddress || "-"}</p>
            {passengers[0] && (
              <p className="text-sm text-slate-500">Primary contact: {passengers[0].fullName || "-"} · {passengers[0].phone || passengers[0].email || "-"}</p>
            )}
          </div>
        </div>

        {passengers.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Passengers</h2>
              <span className="text-xs text-slate-500">{passengers.length} record(s)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {passengers.map((p, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                  <p className="text-sm font-semibold text-slate-900">{p.fullName || `Passenger ${idx + 1}`}</p>
                  <p className="text-xs text-slate-600">{p.gender || "-"} · DOB: {p.dob || "-"}</p>
                  <p className="text-xs text-slate-600">Passport: {p.passportNumber || "-"} (exp {p.passportExpiry || "-"})</p>
                  <p className="text-xs text-slate-500">{p.email || ""}</p>
                  <p className="text-xs text-slate-500">{p.phone || ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Special requests</h2>
            <p className="text-sm text-slate-700">Seat: {special.seatPreference || "-"}</p>
            <p className="text-sm text-slate-700">Meal: {special.mealPreference || "-"}</p>
            <p className="text-sm text-slate-700">Wheelchair: {special.wheelchairAssistance || "-"}</p>
            <p className="text-sm text-slate-500">Notes: {special.additionalRequests || "None"}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Notes</h2>
            <p className="text-sm text-slate-700">No additional business notes captured.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderLogisticsDetail = () => {
    const data = submission?.data || {};
    const req = data.request || {};
    const shipper = data.shipper || {};
    const receiver = data.receiver || {};
    const shipment = data.shipmentDetails || {};
    const pd = data.pickupDelivery || {};
    const insurance = data.insurance || {};
    const notes = data.notes || {};
    const dim = shipment.dimensions || {};

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Request overview</h2>
            <p className="text-sm text-slate-700">Type: {req.logisticsType || "-"}</p>
            <p className="text-sm text-slate-700">Service: {req.serviceType || "-"}</p>
            <p className="text-sm text-slate-700">Urgency: {req.shipmentUrgency || "Standard"}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Shipment</h2>
            <p className="text-sm text-slate-700">Description: {shipment.description || "-"}</p>
            <p className="text-sm text-slate-700">Cargo: {shipment.cargoType || "-"}</p>
            <p className="text-sm text-slate-700">Weight: {shipment.weight || "-"} · Packages: {shipment.packages || "-"}</p>
            <p className="text-sm text-slate-700">Dimensions: L{dim.length || "-"} x W{dim.width || "-"} x H{dim.height || "-"}</p>
            {data.volume && <p className="text-sm text-slate-500">Volume: {data.volume} m³</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Pickup & delivery</h2>
            <p className="text-sm text-slate-700">Pickup: {pd.pickupAddress || "-"}</p>
            <p className="text-sm text-slate-700">Delivery: {pd.deliveryAddress || "-"}</p>
            <p className="text-sm text-slate-700">Pickup date: {pd.pickupDate || "-"}</p>
            <p className="text-sm text-slate-700">Delivery date: {pd.deliveryDate || "-"}</p>
            <p className="text-sm text-slate-500">Packing: {pd.needPacking || "-"} · Customs: {pd.needCustoms || "-"}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Insurance & notes</h2>
            <p className="text-sm text-slate-700">Insurance: {insurance.needInsurance || "-"}</p>
            <p className="text-sm text-slate-700">Declared value: {insurance.declaredValue || "-"}</p>
            <p className="text-sm text-slate-500">Special handling: {notes.specialHandling || "None"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Shipper</h2>
            <p className="text-sm text-slate-700">{shipper.fullName || shipper.company || "-"}</p>
            <p className="text-sm text-slate-500">{shipper.country || ""} {shipper.city || ""}</p>
            <p className="text-sm text-slate-500">{shipper.phone || ""}</p>
            <p className="text-sm text-slate-500">{shipper.email || ""}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">Receiver</h2>
            <p className="text-sm text-slate-700">{receiver.fullName || receiver.company || "-"}</p>
            <p className="text-sm text-slate-500">{receiver.country || ""} {receiver.city || ""}</p>
            <p className="text-sm text-slate-500">{receiver.phone || ""}</p>
            <p className="text-sm text-slate-500">{receiver.email || ""}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl p-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Admin Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-900">{label} Submission</h1>
            <p className="text-slate-600 mt-1">Review details for this record.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <Link
              to={`/admin/submissions?formType=${formType}`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              View All
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading && <div className="text-sm text-slate-600">Loading submission…</div>}

        {!loading && !error && submission && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rows.map((row) => (
                <div key={row.label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{row.label}</p>
                  <p className="text-sm text-slate-800 mt-1 break-all">{row.value || "-"}</p>
                </div>
              ))}
            </div>

            {formType === "flight" ? renderFlightDetail() : renderLogisticsDetail()}

            {submission.attachmentsMetadata?.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Attachments</h2>
                <ul className="text-sm text-slate-700 space-y-1">
                  {submission.attachmentsMetadata.map((f) => (
                    <li key={f.name} className="flex justify-between border-b border-slate-100 pb-1">
                      <span>{f.name}</span>
                      <span className="text-xs text-slate-500">{f.size ? `${Math.round(f.size / 1024)} KB` : ""}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetail;
