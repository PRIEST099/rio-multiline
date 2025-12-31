const safe = (v) => (v === undefined || v === null || v === "" ? "-" : v);
const compact = (v) => String(v || "").replace(/\s+/g, " ").trim();

export const stripDataUriPrefix = (dataUrl = "") => {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex === -1) return { data: dataUrl, encoding: "base64" };
  const base64 = dataUrl.slice(commaIndex + 1);
  return { data: base64, encoding: "base64" };
};

const wrapEmail = ({ title, subtitle = "", body }) => `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f7fb; padding: 24px; color: #111827; }
    .card { background: #ffffff; border-radius: 12px; padding: 24px; max-width: 720px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
    h1 { margin: 0 0 8px 0; font-size: 22px; color: #0f172a; }
    h2 { margin: 16px 0 8px 0; font-size: 16px; color: #0f172a; }
    p { margin: 6px 0; line-height: 1.5; }
    .muted { color: #6b7280; }
    .section { margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    th { background: #f3f4f6; color: #111827; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 8px; background: #e0f2fe; color: #0ea5e9; font-weight: 600; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <h1>${title}</h1>
      <span class="badge">RIO</span>
    </div>
    ${subtitle ? `<p class="muted">${subtitle}</p>` : ""}
    ${body}
  </div>
</body>
</html>`;

export const buildFlightAdminParams = (data) => {
  const trip = data?.tripInformation || {};
  const passengers = data?.passengers || [];
  const special = data?.specialRequests || {};
  const payment = data?.payment || {};
  const totals = data?.totals || {};
  const first = passengers[0] || {};

  const v1 = `${safe(first.fullName)} (Phone: ${safe(first.phone)})`;
  const v2 = `${safe(trip.departureAirport)} to ${safe(trip.destinationAirport)} (${safe(trip.tripType)})`;
  const v3 = `${safe(trip.departureDate)}${trip.returnDate ? ` - ${safe(trip.returnDate)}` : ""}, ${safe(
    trip.preferredCabinClass
  )}, ${safe(trip.preferredAirline || "Not specified")}`;
  const v4 = `${safe(totals.totalPassengers || trip.passengersText || "") || safe(trip.passengersText)} ${
    trip.passengersText ? `(${trip.passengersText})` : ""
  }`.trim();
  const v5 = `${safe(special.seatPreference)}, ${safe(special.mealPreference)}, ${safe(special.wheelchairAssistance)}`;
  const v6 = `${safe(payment.paymentMethod)} - Bill to: ${safe(payment.billingName)}`;

  return [v1, v2, v3, v4, v5, v6].map(compact);
};

export const buildFlightClientParams = (data) => {
  const trip = data?.tripInformation || {};
  const passengers = data?.passengers || [];
  const first = passengers[0] || {};
  const v1 = safe(first.fullName);
  const v2 = `${safe(trip.departureAirport)} -> ${safe(trip.destinationAirport)} (${safe(trip.tripType)}), ${safe(
    trip.departureDate
  )}${trip.returnDate ? ` - ${safe(trip.returnDate)}` : ""}`;
  return [compact(v1), compact(v2)];
};

export const buildLogisticsAdminParams = (data) => {
  const request = data?.request || {};
  const shipper = data?.shipper || {};
  const receiver = data?.receiver || {};
  const shipment = data?.shipmentDetails || {};
  const pd = data?.pickupDelivery || {};
  const insurance = data?.insurance || {};
  const notes = data?.notes || {};
  const volume = data?.volume;
  const dim = shipment.dimensions || {};

  const v1 = `${safe(shipper.fullName || receiver.fullName)} (Phone: ${safe(shipper.phone || receiver.phone)})`;
  const v2 = `${safe(pd.pickupAddress)} -> ${safe(pd.deliveryAddress)} (${safe(request.logisticsType)}/${safe(
    request.serviceType
  )})`;
  const v3 = `${safe(shipment.description)}, ${safe(shipment.weight)}kg, ${safe(shipment.cargoType)}, Packages: ${safe(
    shipment.packages
  )}, Dim: L${safe(dim.length)}xW${safe(dim.width)}xH${safe(dim.height)}, Vol: ${safe(volume)}`;
  const v4 = `Urgency: ${safe(request.shipmentUrgency)}, Pickup: ${safe(pd.pickupDate)}, Delivery: ${safe(pd.deliveryDate)}`;
  const v5 = `Insurance: ${safe(insurance.needInsurance)} (${safe(insurance.declaredValue)} USD), Packing: ${safe(
    pd.needPacking
  )}, Customs: ${safe(pd.needCustoms)}`;
  const v6 = `Notes: ${safe(notes.specialHandling || "None")}, Attachments: ${notes.files && notes.files.length ? "Yes" : "No"}`;

  return [v1, v2, v3, v4, v5, v6].map(compact);
};

export const buildLogisticsClientParams = (data) => {
  const shipper = data?.shipper || {};
  const receiver = data?.receiver || {};
  const pd = data?.pickupDelivery || {};
  const v1 = safe(shipper.fullName || receiver.fullName);
  const v2 = `${safe(pd.pickupAddress)} -> ${safe(pd.deliveryAddress)} (${safe(pd.pickupDate)} to ${safe(pd.deliveryDate)})`;
  return [compact(v1), compact(v2)];
};

const renderRows = (rows = []) => `
  <table>
    <tbody>
      ${rows
        .map(
          (r) => `
            <tr>
              <th style="width: 36%;">${r.label}</th>
              <td>${safe(r.value)}</td>
            </tr>`
        )
        .join("")}
    </tbody>
  </table>`;

const renderPassengers = (passengers = []) => {
  if (!Array.isArray(passengers) || passengers.length === 0) return "<p class='muted'>No passengers provided.</p>";
  const header = `
    <table>
      <thead>
        <tr>
          <th>#</th><th>Name</th><th>Gender</th><th>DOB</th><th>Nationality</th><th>Passport</th><th>Email</th><th>Phone</th>
        </tr>
      </thead>
      <tbody>`;
  const body = passengers
    .map(
      (p, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${safe(p.fullName)}</td>
          <td>${safe(p.gender)}</td>
          <td>${safe(p.dob)}</td>
          <td>${safe(p.nationality)}</td>
          <td>${safe(p.passportNumber)} (exp: ${safe(p.passportExpiry)})</td>
          <td>${safe(p.email)}</td>
          <td>${safe(p.phone)}</td>
        </tr>`
    )
    .join("");
  return `${header}${body}</tbody></table>`;
};

const buildFlightTemplates = (data) => {
  const trip = data?.tripInformation || {};
  const passengers = data?.passengers || [];
  const special = data?.specialRequests || {};
  const payment = data?.payment || {};
  const totals = data?.totals || {};

  const tripSection = renderRows([
    { label: "Trip Type", value: trip.tripType },
    { label: "From", value: trip.departureAirport },
    { label: "To", value: trip.destinationAirport },
    { label: "Departure Date", value: trip.departureDate },
    { label: "Return Date", value: trip.returnDate },
    { label: "Departure Time", value: trip.preferredDepartureTime },
    { label: "Preferred Airline", value: trip.preferredAirline },
    { label: "Cabin Class", value: trip.preferredCabinClass },
    { label: "Passengers (A/C/I)", value: trip.passengersText },
    { label: "Total Passengers", value: totals.totalPassengers },
  ]);

  const requestsSection = renderRows([
    { label: "Seat Preference", value: special.seatPreference },
    { label: "Meal Preference", value: special.mealPreference },
    { label: "Wheelchair Assistance", value: special.wheelchairAssistance },
    { label: "Additional Requests", value: special.additionalRequests },
  ]);

  const paymentSection = renderRows([
    { label: "Payment Method", value: payment.paymentMethod },
    { label: "Billing Name", value: payment.billingName },
    { label: "Billing Address", value: payment.billingAddress },
    { label: "Agreement Confirmed", value: payment.agreement ? "Yes" : "No" },
  ]);

  const body = `
    <div class="section">
      <h2>Trip Information</h2>
      ${tripSection}
    </div>
    <div class="section">
      <h2>Passenger Details</h2>
      ${renderPassengers(passengers)}
    </div>
    <div class="section">
      <h2>Special Requests</h2>
      ${requestsSection}
    </div>
    <div class="section">
      <h2>Payment & Confirmation</h2>
      ${paymentSection}
    </div>
  `;

  const adminSubject = `Flight Ticketing Request - ${safe(trip.departureAirport)} to ${safe(trip.destinationAirport)}`;
  const clientSubject = "We received your flight ticketing request";

  const firstPassengerEmail = passengers.find((p) => p?.email)?.email;

  return {
    admin: { subject: adminSubject, html: wrapEmail({ title: "New Flight Ticketing Submission", body }) },
    client: firstPassengerEmail
      ? {
          to: firstPassengerEmail,
          subject: clientSubject,
          html: wrapEmail({
            title: "Your flight request is confirmed",
            subtitle: "Thank you for submitting your booking details. Our team will contact you shortly.",
            body,
          }),
        }
      : null,
  };
};

const buildLogisticsTemplates = (data) => {
  const request = data?.request || {};
  const shipper = data?.shipper || {};
  const receiver = data?.receiver || {};
  const shipment = data?.shipmentDetails || {};
  const pd = data?.pickupDelivery || {};
  const insurance = data?.insurance || {};
  const notes = data?.notes || {};
  const volume = data?.volume;
  const dim = shipment.dimensions || {};

  const requestSection = renderRows([
    { label: "Logistics Type", value: request.logisticsType },
    { label: "Service Type", value: request.serviceType },
    { label: "Shipment Urgency", value: request.shipmentUrgency },
  ]);

  const shipperSection = renderRows([
    { label: "Company", value: shipper.company },
    { label: "Full Name", value: shipper.fullName },
    { label: "Phone", value: shipper.phone },
    { label: "Email", value: shipper.email },
    { label: "Country", value: shipper.country },
    { label: "City", value: shipper.city },
  ]);

  const receiverSection = renderRows([
    { label: "Company", value: receiver.company },
    { label: "Full Name", value: receiver.fullName },
    { label: "Phone", value: receiver.phone },
    { label: "Email", value: receiver.email },
    { label: "Country", value: receiver.country },
    { label: "City", value: receiver.city },
  ]);

  const shipmentSection = renderRows([
    { label: "Description", value: shipment.description },
    { label: "Cargo Type", value: shipment.cargoType },
    { label: "Packages", value: shipment.packages },
    { label: "Weight (kg)", value: shipment.weight },
    { label: "Dimensions (cm)", value: `L ${safe(dim.length)} x W ${safe(dim.width)} x H ${safe(dim.height)}` },
    { label: "Calculated Volume (m³)", value: volume },
  ]);

  const pickupSection = renderRows([
    { label: "Pickup Address", value: pd.pickupAddress },
    { label: "Pickup Date", value: pd.pickupDate },
    { label: "Delivery Address", value: pd.deliveryAddress },
    { label: "Delivery Date", value: pd.deliveryDate },
    { label: "Need Packing Service", value: pd.needPacking },
    { label: "Need Customs Clearance", value: pd.needCustoms },
  ]);

  const insuranceSection = renderRows([
    { label: "Need Cargo Insurance", value: insurance.needInsurance },
    { label: "Declared Cargo Value (USD)", value: insurance.declaredValue },
  ]);

  const notesSection = renderRows([
    { label: "Special Handling Instructions", value: notes.specialHandling },
    { label: "Attachments", value: notes.files && notes.files.length ? "Included" : "None" },
  ]);

  const body = `
    <div class="section"><h2>Request Type</h2>${requestSection}</div>
    <div class="section"><h2>Shipper Information</h2>${shipperSection}</div>
    <div class="section"><h2>Receiver Information</h2>${receiverSection}</div>
    <div class="section"><h2>Shipment Details</h2>${shipmentSection}</div>
    <div class="section"><h2>Pickup & Delivery</h2>${pickupSection}</div>
    <div class="section"><h2>Insurance</h2>${insuranceSection}</div>
    <div class="section"><h2>Additional Notes</h2>${notesSection}</div>
  `;

  const adminSubject = `Logistics Quotation Request - ${safe(request.logisticsType)}`;
  const clientSubject = "We received your logistics quotation request";
  const clientEmail = shipper.email || receiver.email;

  return {
    admin: { subject: adminSubject, html: wrapEmail({ title: "New Logistics Submission", body }) },
    client: clientEmail
      ? {
          to: clientEmail,
          subject: clientSubject,
          html: wrapEmail({
            title: "Your logistics request is confirmed",
            subtitle: "Thank you for submitting your shipment details. Our team will contact you shortly.",
            body,
          }),
        }
      : null,
  };
};

export const buildTemplates = (formType, data) => {
  if (formType === "flight") return buildFlightTemplates(data);
  if (formType === "logistics") return buildLogisticsTemplates(data);
  throw new Error("Unsupported form type");
};

export const mapAttachments = (attachments = []) =>
  (attachments || []).map((file) => {
    const { data, encoding } = stripDataUriPrefix(file.data || "");
    return {
      filename: file.name || "attachment",
      content: data,
      encoding,
    };
  });
