import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";

const formTypes = [
  { value: "flight", label: "Flight Ticketing" },
  { value: "logistics", label: "Logistics Quotation" },
];

const useQuery = () => new URLSearchParams(useLocation().search);

const SubmissionsDashboard = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const initialType = query.get("formType") || "flight";
  const [formType, setFormType] = useState(initialType);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const dashboardTitle = useMemo(() => {
    const found = formTypes.find((f) => f.value === formType);
    return found ? `${found.label} Submissions` : "Submissions";
  }, [formType]);

  const fetchData = async (ft) => {
    if (!apiBase) {
      setError("API base URL is not configured");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/admin/submissions?formType=${ft}`);
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load submissions");
      }
      setSubmissions(data.submissions || []);
      setTotalCount(data.count || (data.submissions || []).length || 0);
    } catch (err) {
      setError(err.message || "Failed to load submissions");
      setSubmissions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ft = formTypes.some((f) => f.value === formType) ? formType : "flight";
    setFormType(ft);
    fetchData(ft);
  }, []);

  useEffect(() => {
    navigate(`/admin/submissions?formType=${formType}`, { replace: true });
    fetchData(formType);
  }, [formType]);

  const latestDate = useMemo(() => {
    if (!submissions.length) return "-";
    const ts = submissions[0]?.createdAt || submissions[submissions.length - 1]?.createdAt;
    return ts ? new Date(ts).toLocaleString() : "-";
  }, [submissions]);

  const renderFlightRow = (s) => {
    const trip = s.data?.tripInformation || {};
    const pax = s.data?.passengers?.[0] || {};
    const created = s.createdAt ? new Date(s.createdAt).toLocaleString() : "-";
    const route = trip.departureAirport && trip.destinationAirport ? `${trip.departureAirport} → ${trip.destinationAirport}` : "Route not set";
    const extras = [trip.preferredCabinClass, trip.preferredAirline].filter(Boolean).join(" · ") || "-";
    const paxCount = s.data?.totals?.totalPassengers || trip.passengersText;
    const id = typeof s._id === "string" ? s._id : s._id?.$oid || s._id;
    const detailPath = `/admin/submissions/flight/${id}`;

    return {
      id,
      created,
      name: pax.fullName || s.data?.payment?.billingName || "Passenger",
      contact: pax.phone || pax.email || "-",
      email: pax.email,
      route,
      date: trip.departureDate || "-",
      badge: trip.tripType || "Trip",
      meta: paxCount ? `${paxCount} pax` : "",
      extras,
      detailPath,
    };
  };

  const renderLogisticsRow = (s) => {
    const req = s.data?.request || {};
    const shipper = s.data?.shipper || {};
    const pd = s.data?.pickupDelivery || {};
    const shipment = s.data?.shipmentDetails || {};
    const created = s.createdAt ? new Date(s.createdAt).toLocaleString() : "-";
    const route = pd.pickupAddress && pd.deliveryAddress ? `${pd.pickupAddress} → ${pd.deliveryAddress}` : "Route not set";
    const extras = [req.serviceType, `Urgency: ${req.shipmentUrgency || "Standard"}`].filter(Boolean).join(" · ");
    const id = typeof s._id === "string" ? s._id : s._id?.$oid || s._id;
    const detailPath = `/admin/submissions/logistics/${id}`;

    return {
      id,
      created,
      name: shipper.fullName || shipper.company || "Shipper",
      contact: shipper.phone || shipper.email || "-",
      email: shipper.email,
      route,
      date: pd.pickupDate || "-",
      badge: req.logisticsType || "Logistics",
      meta: shipment.weight ? `${shipment.weight} kg` : shipment.packages ? `${shipment.packages} pkgs` : "",
      extras,
      detailPath,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white border border-slate-100 shadow-xl rounded-3xl p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-indigo-600 font-semibold">Admin Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-900">{dashboardTitle}</h1>
            <p className="text-slate-600 mt-1">Showing latest submissions from the backend database.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Form Type</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              {formTypes.map((ft) => (
                <option key={ft.value} value={ft.value}>
                  {ft.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Total submissions</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Latest submission</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">{latestDate}</p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">Viewing</p>
            <p className="text-lg font-semibold text-indigo-900 mt-1">{dashboardTitle}</p>
          </div>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}
        {loading && <div className="text-sm text-slate-600">Loading submissions…</div>}

        {!loading && !error && submissions.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 text-slate-700 px-4 py-4 text-sm">
            No submissions found yet.
          </div>
        )}

        {!loading && !error && submissions.length > 0 && (
          <div className="overflow-auto border border-slate-100 rounded-2xl shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Trip / Route</th>
                  <th className="px-4 py-3 text-left">Details</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((s, idx) => {
                  const row = formType === "flight" ? renderFlightRow(s) : renderLogisticsRow(s);
                  return (
                    <tr key={row.id || idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 align-top text-slate-700">{row.created}</td>
                      <td className="px-4 py-3 align-top text-slate-900 font-semibold">
                        <div className="flex items-center gap-2">
                          <span>{row.name}</span>
                          {row.badge && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {row.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{row.meta || ""}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-slate-700">
                        <div className="text-sm text-slate-800">{row.contact}</div>
                        {row.email && <div className="text-xs text-slate-500">{row.email}</div>}
                      </td>
                      <td className="px-4 py-3 align-top text-slate-700">
                        <div className="text-sm font-medium text-slate-900">{row.route}</div>
                        <div className="text-xs text-slate-500">{row.date}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-slate-700">
                        <div className="text-xs text-slate-600 whitespace-pre-line">{row.extras}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-slate-700">
                        {row.id ? (
                          <Link
                            to={row.detailPath}
                            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsDashboard;