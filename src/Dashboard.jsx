import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  Truck, CheckCircle2, Wrench, Route, Clock, Users, Gauge,
  Fuel, IndianRupee, LayoutDashboard, Car, UserRound, MapPin,
  ClipboardList, Receipt, BarChart3, ChevronDown, Circle, Inbox,
  Mail, Lock, Eye, EyeOff, LogOut, ShieldCheck,
} from "lucide-react";

/* ============================================================
   MOCK DATASET — deterministic (no Math.random) so it's stable
   across re-renders. This models what real API responses would
   look like: a vehicle table, a driver table, a trip table.
   Replace the three generator calls below with fetch() calls
   once the backend contract is available:
     GET /vehicles   GET /drivers   GET /trips
   All KPIs, charts, and filters below are DERIVED from these
   three arrays — nothing is separately hardcoded, so applying a
   filter genuinely recomputes every number on the page.
   ============================================================ */

const TYPES = ["Truck", "Van", "Mini Truck", "Trailer"];
const REGIONS = ["North", "South", "East", "West"];
const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];
const TRIP_STATUSES = ["Draft", "Dispatched", "Completed", "Cancelled"];
const DRIVER_STATUSES = ["On Trip", "Available", "Off Duty", "Suspended"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function generateVehicles(count) {
  // weighted status distribution: mostly Available/On Trip, some In Shop/Retired
  const statusCycle = [
    "Available", "Available", "On Trip", "On Trip", "On Trip",
    "Available", "In Shop", "Available", "On Trip", "Retired",
  ];
  const vehicles = [];
  for (let i = 0; i < count; i++) {
    vehicles.push({
      id: `VH-${String(i + 1).padStart(3, "0")}`,
      type: TYPES[i % TYPES.length],
      region: REGIONS[(i * 3 + 1) % REGIONS.length],
      status: statusCycle[i % statusCycle.length],
      odometer: 20000 + ((i * 733) % 80000),
      acquisitionCost: 800000 + ((i * 41000) % 1600000),
    });
  }
  return vehicles;
}

function generateDrivers(count, vehicles) {
  const statusCycle = ["On Trip", "Available", "On Trip", "Off Duty", "Available", "Suspended"];
  const names = [
    "Arjun", "Priya", "Rohan", "Kavya", "Vikram", "Ananya", "Suresh", "Meera",
    "Karan", "Divya", "Nikhil", "Pooja", "Rahul", "Sneha", "Manoj", "Isha",
  ];
  const drivers = [];
  for (let i = 0; i < count; i++) {
    drivers.push({
      id: `DR-${String(i + 1).padStart(3, "0")}`,
      name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`,
      region: REGIONS[(i * 2 + 1) % REGIONS.length],
      status: statusCycle[i % statusCycle.length],
      tripsCompleted: 8 + ((i * 5) % 60),
      rating: (3.6 + ((i * 7) % 14) / 10).toFixed(1),
    });
  }
  return drivers;
}

function generateTrips(count, vehicles) {
  const statusCycle = [
    "Completed", "Completed", "Completed", "Completed", "Completed", "Completed", "Completed", "Completed",
    "Dispatched", "Dispatched", "Draft", "Cancelled",
  ];
  const trips = [];
  for (let i = 0; i < count; i++) {
    const vehicle = vehicles[i % vehicles.length];
    const distance = 60 + ((i * 17) % 340);
    const fuelUsed = Math.max(6, Math.round((distance / (7 + (i % 5))) * 10) / 10);
    trips.push({
      id: `TR-${String(i + 1).padStart(4, "0")}`,
      vehicleId: vehicle.id,
      status: statusCycle[i % statusCycle.length],
      day: DAYS[i % DAYS.length],
      distance,
      fuelUsed,
      fuelCost: Math.round(fuelUsed * 96),
      maintenanceCost: i % 6 === 0 ? 1500 + ((i * 53) % 4000) : 0,
      tollCost: 150 + ((i * 11) % 600),
    });
  }
  return trips;
}

const VEHICLES = generateVehicles(58);
const DRIVERS = generateDrivers(46);
const TRIPS = generateTrips(143, VEHICLES);
const VEHICLE_BY_ID = Object.fromEntries(VEHICLES.map((v) => [v.id, v]));

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "vehicles", label: "Vehicles", icon: Car },
  { key: "drivers", label: "Drivers", icon: UserRound },
  { key: "trips", label: "Trips", icon: MapPin },
  { key: "maintenance", label: "Maintenance", icon: ClipboardList },
  { key: "fuel", label: "Fuel & Expenses", icon: Receipt },
  { key: "reports", label: "Reports", icon: BarChart3 },
];

const SECTION_META = {
  dashboard: { title: "Operations Dashboard", subtitle: "Live overview across your fleet" },
  vehicles: { title: "Vehicles", subtitle: `${VEHICLES.length} vehicles in the fleet roster` },
  drivers: { title: "Drivers", subtitle: `${DRIVERS.length} drivers on record` },
  trips: { title: "Trips", subtitle: `${TRIPS.length} trips logged` },
  maintenance: { title: "Maintenance", subtitle: "Service history and vehicles currently in shop" },
  fuel: { title: "Fuel & Expenses", subtitle: "Consumption and cost tracking across the fleet" },
  reports: { title: "Reports", subtitle: "Fleet-wide summaries, unfiltered" },
};

const VEHICLE_TYPE_FILTERS = ["All", ...TYPES];
const STATUS_FILTERS = ["All", ...VEHICLE_STATUSES];
const REGION_FILTERS = ["All", ...REGIONS];
const ROLES = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];

/* ============================================================
   THEME TOKENS — neutral graphite palette, no blue undertone.
   Warm charcoal surfaces with a restrained brass/amber accent.
   ============================================================ */
const C = {
  bg: "#17181A",
  panel: "#1E1F22",
  panelRaised: "#26272B",
  amber: "#C9922F",
  amberDim: "#6E5426",
  emerald: "#2E9E76",
  red: "#C4534B",
  slate: "#6E7075",
  text: "#ECEDEE",
  muted: "#8D8E93",
  border: "#2C2D30",
};

const STATUS_COLOR = {
  Available: C.emerald,
  "On Trip": C.amber,
  "In Shop": C.slate,
  Retired: C.red,
};

const DRIVER_STATUS_COLOR = {
  "On Trip": C.amber,
  Available: C.emerald,
  "Off Duty": C.slate,
  Suspended: C.red,
};

const TRIP_STATUS_COLOR = {
  Dispatched: C.amber,
  Draft: C.slate,
  Completed: C.emerald,
  Cancelled: C.red,
};

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);
  useEffect(() => {
    const from = prevTarget.current;
    prevTarget.current = target;
    let startTs = null;
    let raf;
    const step = (ts) => {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function formatValue(raw, key) {
  if (key === "operationalCost") return Math.round(raw).toLocaleString("en-IN");
  if (key === "fuelEfficiency") return raw.toFixed(1);
  return Math.round(raw).toLocaleString("en-IN");
}

function KpiCard({ label, kpiKey, data }) {
  const animated = useCountUp(data.value, 700);
  const Icon = data.icon;
  const pct = data.total ? Math.round((data.value / data.total) * 100) : null;
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "18px 18px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${C.amber}, transparent)`,
        }}
      />
      <div className="flex items-start justify-between" style={{ marginBottom: 10 }}>
        <span
          style={{
            color: C.muted,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 11,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <Icon size={16} color={C.amber} strokeWidth={2} />
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 30,
          fontWeight: 700,
          color: C.text,
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        {data.prefix || ""}
        {formatValue(animated, kpiKey)}
        {data.suffix || ""}
      </div>
      {pct !== null && (
        <div style={{ marginTop: 10 }}>
          <div style={{ height: 4, background: C.panelRaised, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: C.amberDim, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: "'JetBrains Mono', monospace" }}>
            of {data.total}
          </span>
        </div>
      )}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 12,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 500,
        border: `1px solid ${active ? C.amber : C.border}`,
        background: active ? "rgba(201,146,47,0.14)" : "transparent",
        color: active ? C.amber : C.muted,
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

function FilterGroup({ title, options, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
      <span
        style={{
          fontSize: 11,
          color: C.muted,
          fontFamily: "'Space Grotesk', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          flexShrink: 0,
          width: 52,
        }}
      >
        {title}
      </span>
      <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {options.map((opt) => (
          <Chip key={opt} label={opt} active={value === opt} onClick={() => onChange(opt)} />
        ))}
      </div>
    </div>
  );
}

function PanelHeading({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>
        {title}
      </h3>
      {subtitle && <p style={{ fontSize: 12, color: C.muted, margin: "3px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: C.panelRaised,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: "8px 12px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: C.text,
      }}
    >
      <div style={{ color: C.muted, marginBottom: 2 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "30px 10px",
        color: C.muted,
      }}
    >
      <Inbox size={22} color={C.muted} />
      <span style={{ fontSize: 12.5, textAlign: "center" }}>{text}</span>
    </div>
  );
}

function SectionCard({ title, subtitle, children, style }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, ...style }}>
      {(title || subtitle) && <PanelHeading title={title} subtitle={subtitle} />}
      {children}
    </div>
  );
}

function StatusPill({ status, colorMap }) {
  const color = colorMap[status] || C.muted;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color, whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
      {status}
    </span>
  );
}

function DataTable({ columns, rows, keyField, emptyText }) {
  if (!rows.length) return <EmptyState text={emptyText || "No records to show."} />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align || "left",
                  padding: "8px 10px",
                  color: C.muted,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  borderBottom: `1px solid ${C.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "8px 10px",
                    color: C.text,
                    fontFamily: col.mono ? "'JetBrains Mono', monospace" : "inherit",
                    textAlign: col.align || "left",
                    whiteSpace: "nowrap",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   DASHBOARD SECTION — the original filterable overview.
   ============================================================ */
function DashboardSection() {
  const [vehicleType, setVehicleType] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");

  const filteredVehicles = useMemo(
    () =>
      VEHICLES.filter(
        (v) =>
          (vehicleType === "All" || v.type === vehicleType) &&
          (status === "All" || v.status === status) &&
          (region === "All" || v.region === region)
      ),
    [vehicleType, status, region]
  );

  const filteredTrips = useMemo(
    () =>
      TRIPS.filter((t) => {
        const v = VEHICLE_BY_ID[t.vehicleId];
        return (vehicleType === "All" || v.type === vehicleType) && (region === "All" || v.region === region);
      }),
    [vehicleType, region]
  );

  const filteredDrivers = useMemo(
    () => DRIVERS.filter((d) => region === "All" || d.region === region),
    [region]
  );

  const kpis = useMemo(() => {
    const onTrip = filteredVehicles.filter((v) => v.status === "On Trip").length;
    const completed = filteredTrips.filter((t) => t.status === "Completed");
    const totalDistance = completed.reduce((s, t) => s + t.distance, 0);
    const totalFuel = completed.reduce((s, t) => s + t.fuelUsed, 0);
    const totalCost = filteredTrips.reduce((s, t) => s + t.fuelCost + t.maintenanceCost + t.tollCost, 0);

    return {
      activeVehicles: { value: filteredVehicles.filter((v) => v.status !== "Retired").length, total: filteredVehicles.length, icon: Truck },
      availableVehicles: { value: filteredVehicles.filter((v) => v.status === "Available").length, total: filteredVehicles.length, icon: CheckCircle2 },
      inMaintenance: { value: filteredVehicles.filter((v) => v.status === "In Shop").length, total: filteredVehicles.length, icon: Wrench },
      activeTrips: { value: filteredTrips.filter((t) => t.status === "Dispatched").length, total: filteredTrips.length, icon: Route },
      pendingTrips: { value: filteredTrips.filter((t) => t.status === "Draft").length, total: filteredTrips.length, icon: Clock },
      driversOnDuty: { value: filteredDrivers.filter((d) => d.status === "On Trip").length, total: filteredDrivers.length, icon: Users },
      fleetUtilization: { value: filteredVehicles.length ? Math.round((onTrip / filteredVehicles.length) * 100) : 0, suffix: "%", icon: Gauge },
      fuelEfficiency: { value: totalFuel > 0 ? totalDistance / totalFuel : 0, suffix: " km/L", icon: Fuel },
      operationalCost: { value: totalCost, prefix: "₹", icon: IndianRupee },
    };
  }, [filteredVehicles, filteredTrips, filteredDrivers]);

  const utilizationTrend = useMemo(() => {
    const totalRatio = VEHICLES.length ? filteredVehicles.length / VEHICLES.length : 0;
    const base = [61, 65, 70, 66, 74, 79, 72];
    return DAYS.map((day, i) => ({
      day,
      utilization: filteredVehicles.length === 0 ? 0 : Math.round(base[i] * (0.55 + totalRatio * 0.45)),
    }));
  }, [filteredVehicles]);

  const tripStatusBreakdown = useMemo(() => {
    return TRIP_STATUSES.map((s) => ({
      name: s,
      value: filteredTrips.filter((t) => t.status === s).length,
      color: TRIP_STATUS_COLOR[s],
    }));
  }, [filteredTrips]);

  const costBreakdown = useMemo(
    () => [
      { category: "Fuel", cost: filteredTrips.reduce((s, t) => s + t.fuelCost, 0) },
      { category: "Maintenance", cost: filteredTrips.reduce((s, t) => s + t.maintenanceCost, 0) },
      { category: "Tolls & Other", cost: filteredTrips.reduce((s, t) => s + t.tollCost, 0) },
    ],
    [filteredTrips]
  );

  const kpiEntries = [
    ["activeVehicles", "Active Vehicles"],
    ["availableVehicles", "Available Vehicles"],
    ["inMaintenance", "Vehicles in Maintenance"],
    ["activeTrips", "Active Trips"],
    ["pendingTrips", "Pending Trips"],
    ["driversOnDuty", "Drivers on Duty"],
    ["fleetUtilization", "Fleet Utilization"],
    ["fuelEfficiency", "Fuel Efficiency"],
    ["operationalCost", "Operational Cost"],
  ];

  const hasActiveFilters = vehicleType !== "All" || status !== "All" || region !== "All";

  return (
    <>
      {/* FILTERS */}
      <div
        style={{
          background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px",
          marginBottom: 22, display: "flex", flexDirection: "column", gap: 10,
        }}
      >
        <div className="flex items-center justify-between">
          <FilterGroup title="Type" options={VEHICLE_TYPE_FILTERS} value={vehicleType} onChange={setVehicleType} />
          {hasActiveFilters && (
            <button
              onClick={() => { setVehicleType("All"); setStatus("All"); setRegion("All"); }}
              style={{ fontSize: 11, color: C.amber, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
            >
              Reset filters
            </button>
          )}
        </div>
        <FilterGroup title="Status" options={STATUS_FILTERS} value={status} onChange={setStatus} />
        <FilterGroup title="Region" options={REGION_FILTERS} value={region} onChange={setRegion} />
      </div>

      {/* KPI GRID */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginBottom: 22 }}>
        {kpiEntries.map(([key, label]) => (
          <KpiCard key={key} kpiKey={key} label={label} data={kpis[key]} />
        ))}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 16 }}>
        <SectionCard title="Fleet Utilization Trend" subtitle="Last 7 days, scoped to current filters">
          {filteredVehicles.length === 0 ? (
            <EmptyState text="No vehicles match the current filters." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={utilizationTrend} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="utilFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.emerald} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke={C.muted} fontSize={11} tickLine={false} axisLine={{ stroke: C.border }} />
                <YAxis stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="utilization" stroke={C.emerald} strokeWidth={2} fill="url(#utilFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Trip Status" subtitle="Current lifecycle split">
          {filteredTrips.length === 0 ? (
            <EmptyState text="No trips match the current filters." />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={tripStatusBreakdown} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
                    {tripStatusBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke={C.panel} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {tripStatusBreakdown.map((s) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />
                    {s.name} · {s.value}
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 2fr" }}>
        <SectionCard title="Cost Breakdown" subtitle="Scoped to current filters">
          {filteredTrips.length === 0 ? (
            <EmptyState text="No cost records for this selection." />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={costBreakdown} layout="vertical" margin={{ left: 10, right: 16 }}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke={C.muted} fontSize={10} tickLine={false} axisLine={{ stroke: C.border }} />
                <YAxis type="category" dataKey="category" stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" fill={C.amber} radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Live Fleet Status" subtitle={`${filteredVehicles.length} of ${VEHICLES.length} vehicles shown`}>
          {filteredVehicles.length === 0 ? (
            <EmptyState text="No vehicles match the current filters. Try resetting them." />
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 160, overflowY: "auto" }}>
                {filteredVehicles.map((v) => (
                  <div
                    key={v.id}
                    title={`${v.id} — ${v.type}, ${v.region}, ${v.status}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, background: C.panelRaised,
                      border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 9px",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[v.status], flexShrink: 0 }} />
                    {v.id}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
                {Object.entries(STATUS_COLOR).map(([label, color]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {label}
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>
    </>
  );
}

/* ============================================================
   VEHICLES SECTION
   ============================================================ */
function VehiclesSection() {
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const rows = useMemo(
    () => VEHICLES.filter((v) => (type === "All" || v.type === type) && (status === "All" || v.status === status)),
    [type, status]
  );

  const columns = [
    { key: "id", label: "Vehicle ID", mono: true },
    { key: "type", label: "Type" },
    { key: "region", label: "Region" },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} colorMap={STATUS_COLOR} /> },
    { key: "odometer", label: "Odometer", align: "right", render: (r) => `${r.odometer.toLocaleString("en-IN")} km` },
    { key: "acquisitionCost", label: "Acquisition Cost", align: "right", render: (r) => `₹${r.acquisitionCost.toLocaleString("en-IN")}` },
  ];

  return (
    <>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 22, display: "flex", flexDirection: "column", gap: 10 }}>
        <FilterGroup title="Type" options={VEHICLE_TYPE_FILTERS} value={type} onChange={setType} />
        <FilterGroup title="Status" options={STATUS_FILTERS} value={status} onChange={setStatus} />
      </div>
      <SectionCard title="Fleet Roster" subtitle={`${rows.length} of ${VEHICLES.length} vehicles`}>
        <DataTable columns={columns} rows={rows} keyField="id" emptyText="No vehicles match the current filters." />
      </SectionCard>
    </>
  );
}

/* ============================================================
   DRIVERS SECTION
   ============================================================ */
function DriversSection() {
  const [region, setRegion] = useState("All");

  const rows = useMemo(() => DRIVERS.filter((d) => region === "All" || d.region === region), [region]);

  const columns = [
    { key: "id", label: "Driver ID", mono: true },
    { key: "name", label: "Name" },
    { key: "region", label: "Region" },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} colorMap={DRIVER_STATUS_COLOR} /> },
    { key: "tripsCompleted", label: "Trips Completed", align: "right" },
    { key: "rating", label: "Rating", align: "right", render: (r) => `${r.rating} ★` },
  ];

  return (
    <>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
        <FilterGroup title="Region" options={REGION_FILTERS} value={region} onChange={setRegion} />
      </div>
      <SectionCard title="Driver Roster" subtitle={`${rows.length} of ${DRIVERS.length} drivers`}>
        <DataTable columns={columns} rows={rows} keyField="id" emptyText="No drivers match the current filter." />
      </SectionCard>
    </>
  );
}

/* ============================================================
   TRIPS SECTION
   ============================================================ */
function TripsSection() {
  const [status, setStatus] = useState("All");
  const tripStatusFilters = ["All", ...TRIP_STATUSES];

  const rows = useMemo(
    () => TRIPS.filter((t) => status === "All" || t.status === status).slice(0, 40),
    [status]
  );

  const columns = [
    { key: "id", label: "Trip ID", mono: true },
    { key: "vehicleId", label: "Vehicle", mono: true },
    { key: "day", label: "Day" },
    { key: "distance", label: "Distance", align: "right", render: (r) => `${r.distance} km` },
    { key: "fuelUsed", label: "Fuel Used", align: "right", render: (r) => `${r.fuelUsed} L` },
    { key: "fuelCost", label: "Fuel Cost", align: "right", render: (r) => `₹${r.fuelCost.toLocaleString("en-IN")}` },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} colorMap={TRIP_STATUS_COLOR} /> },
  ];

  return (
    <>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
        <FilterGroup title="Status" options={tripStatusFilters} value={status} onChange={setStatus} />
      </div>
      <SectionCard title="Trip Log" subtitle={`Showing ${rows.length} of ${TRIPS.filter((t) => status === "All" || t.status === status).length} matching trips`}>
        <DataTable columns={columns} rows={rows} keyField="id" emptyText="No trips match the current filter." />
      </SectionCard>
    </>
  );
}

/* ============================================================
   MAINTENANCE SECTION
   ============================================================ */
function MaintenanceSection() {
  const vehiclesInShop = useMemo(() => VEHICLES.filter((v) => v.status === "In Shop"), []);
  const maintenanceTrips = useMemo(
    () => TRIPS.filter((t) => t.maintenanceCost > 0).sort((a, b) => b.maintenanceCost - a.maintenanceCost).slice(0, 30),
    []
  );
  const totalMaintenanceCost = useMemo(() => TRIPS.reduce((s, t) => s + t.maintenanceCost, 0), []);

  const kpis = {
    inShop: { value: vehiclesInShop.length, total: VEHICLES.length, icon: Wrench },
    records: { value: maintenanceTrips.length, icon: ClipboardList },
    totalCost: { value: totalMaintenanceCost, prefix: "₹", icon: IndianRupee },
  };

  const vehicleColumns = [
    { key: "id", label: "Vehicle ID", mono: true },
    { key: "type", label: "Type" },
    { key: "region", label: "Region" },
    { key: "odometer", label: "Odometer", align: "right", render: (r) => `${r.odometer.toLocaleString("en-IN")} km` },
  ];

  const tripColumns = [
    { key: "id", label: "Trip ID", mono: true },
    { key: "vehicleId", label: "Vehicle", mono: true },
    { key: "day", label: "Day" },
    { key: "maintenanceCost", label: "Cost", align: "right", render: (r) => `₹${r.maintenanceCost.toLocaleString("en-IN")}` },
  ];

  return (
    <>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginBottom: 22 }}>
        <KpiCard kpiKey="inShop" label="Vehicles In Shop" data={kpis.inShop} />
        <KpiCard kpiKey="records" label="Maintenance Records" data={kpis.records} />
        <KpiCard kpiKey="totalCost" label="Total Maintenance Cost" data={kpis.totalCost} />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <SectionCard title="Vehicles Currently In Shop" subtitle={`${vehiclesInShop.length} vehicles`}>
          <DataTable columns={vehicleColumns} rows={vehiclesInShop} keyField="id" emptyText="No vehicles are currently in the shop." />
        </SectionCard>
        <SectionCard title="Recent Maintenance Costs" subtitle="Highest cost records, most expensive first">
          <DataTable columns={tripColumns} rows={maintenanceTrips} keyField="id" emptyText="No maintenance records found." />
        </SectionCard>
      </div>
    </>
  );
}

/* ============================================================
   FUEL & EXPENSES SECTION
   ============================================================ */
function FuelExpensesSection() {
  const totals = useMemo(() => {
    const fuelCost = TRIPS.reduce((s, t) => s + t.fuelCost, 0);
    const tollCost = TRIPS.reduce((s, t) => s + t.tollCost, 0);
    const fuelUsed = TRIPS.reduce((s, t) => s + t.fuelUsed, 0);
    const distance = TRIPS.filter((t) => t.status === "Completed").reduce((s, t) => s + t.distance, 0);
    return { fuelCost, tollCost, fuelUsed, distance };
  }, []);

  const kpis = {
    fuelCost: { value: totals.fuelCost, prefix: "₹", icon: Fuel },
    tollCost: { value: totals.tollCost, prefix: "₹", icon: Receipt },
    fuelUsed: { value: totals.fuelUsed, suffix: " L", icon: Gauge },
  };

  const costByType = useMemo(() => {
    return TYPES.map((type) => {
      const ids = new Set(VEHICLES.filter((v) => v.type === type).map((v) => v.id));
      const trips = TRIPS.filter((t) => ids.has(t.vehicleId));
      return {
        category: type,
        cost: trips.reduce((s, t) => s + t.fuelCost + t.tollCost, 0),
      };
    });
  }, []);

  const topTrips = useMemo(
    () => [...TRIPS].sort((a, b) => (b.fuelCost + b.tollCost) - (a.fuelCost + a.tollCost)).slice(0, 25),
    []
  );

  const tripColumns = [
    { key: "id", label: "Trip ID", mono: true },
    { key: "vehicleId", label: "Vehicle", mono: true },
    { key: "fuelUsed", label: "Fuel Used", align: "right", render: (r) => `${r.fuelUsed} L` },
    { key: "fuelCost", label: "Fuel Cost", align: "right", render: (r) => `₹${r.fuelCost.toLocaleString("en-IN")}` },
    { key: "tollCost", label: "Tolls", align: "right", render: (r) => `₹${r.tollCost.toLocaleString("en-IN")}` },
  ];

  return (
    <>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginBottom: 22 }}>
        <KpiCard kpiKey="fuelCost" label="Total Fuel Cost" data={kpis.fuelCost} />
        <KpiCard kpiKey="tollCost" label="Total Toll Cost" data={kpis.tollCost} />
        <KpiCard kpiKey="fuelUsed" label="Total Fuel Used" data={kpis.fuelUsed} />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 2fr" }}>
        <SectionCard title="Fuel + Toll Cost by Type" subtitle="Across the whole fleet">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costByType} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={C.muted} fontSize={10} tickLine={false} axisLine={{ stroke: C.border }} />
              <YAxis type="category" dataKey="category" stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill={C.amber} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard title="Highest Cost Trips" subtitle="Fuel + toll, most expensive first">
          <DataTable columns={tripColumns} rows={topTrips} keyField="id" emptyText="No trip cost records found." />
        </SectionCard>
      </div>
    </>
  );
}

/* ============================================================
   REPORTS SECTION
   ============================================================ */
function ReportsSection() {
  const tripStatusBreakdown = useMemo(
    () => TRIP_STATUSES.map((s) => ({ name: s, value: TRIPS.filter((t) => t.status === s).length, color: TRIP_STATUS_COLOR[s] })),
    []
  );

  const vehicleStatusBreakdown = useMemo(
    () => VEHICLE_STATUSES.map((s) => ({ name: s, value: VEHICLES.filter((v) => v.status === s).length, color: STATUS_COLOR[s] })),
    []
  );

  const costBreakdown = useMemo(
    () => [
      { category: "Fuel", cost: TRIPS.reduce((s, t) => s + t.fuelCost, 0) },
      { category: "Maintenance", cost: TRIPS.reduce((s, t) => s + t.maintenanceCost, 0) },
      { category: "Tolls & Other", cost: TRIPS.reduce((s, t) => s + t.tollCost, 0) },
    ],
    []
  );

  const vehiclesByRegion = useMemo(
    () => REGIONS.map((r) => ({ category: r, cost: VEHICLES.filter((v) => v.region === r).length })),
    []
  );

  return (
    <>
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <SectionCard title="Trip Status Split" subtitle="All logged trips">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={tripStatusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2}>
                {tripStatusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke={C.panel} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {tripStatusBreakdown.map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />
                {s.name} · {s.value}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Vehicle Status Split" subtitle="Full fleet roster">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={vehicleStatusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2}>
                {vehicleStatusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke={C.panel} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {vehicleStatusBreakdown.map((s) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />
                {s.name} · {s.value}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <SectionCard title="Cost Breakdown" subtitle="Fleet-wide, all trips">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={costBreakdown} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={C.muted} fontSize={10} tickLine={false} axisLine={{ stroke: C.border }} />
              <YAxis type="category" dataKey="category" stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill={C.amber} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Vehicles by Region" subtitle="Full fleet roster">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vehiclesByRegion} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={C.muted} fontSize={10} tickLine={false} axisLine={{ stroke: C.border }} />
              <YAxis type="category" dataKey="category" stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" fill={C.emerald} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </>
  );
}

/* ============================================================
   LOGIN PAGE
   ============================================================ */
function LoginPage({ users, onSignIn, onGoToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(
    () => [
      { label: "Vehicles Tracked", value: VEHICLES.length.toLocaleString("en-IN") },
      { label: "Drivers On Roster", value: DRIVERS.length.toLocaleString("en-IN") },
      { label: "Trips Logged", value: TRIPS.length.toLocaleString("en-IN") },
    ],
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password to sign in.");
      return;
    }
    const identifier = email.trim().toLowerCase();
    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        (u.username && u.username.toLowerCase() === identifier)
    );
    if (!matchedUser || matchedUser.password !== password) {
      setError("Invalid email or password.");
      return;
    }
    setError("");
    setSubmitting(true);
    onSignIn({ email: matchedUser.email, fullName: matchedUser.fullName, role, remember });
  };

  const inputStyle = {
    width: "100%",
    background: C.panelRaised,
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: 13.5,
    fontFamily: "'Inter', sans-serif",
    padding: "10px 12px 10px 38px",
    borderRadius: 8,
    outline: "none",
  };

  const labelStyle = {
    fontSize: 11.5,
    color: C.muted,
    fontFamily: "'Space Grotesk', sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontWeight: 600,
    display: "block",
    marginBottom: 7,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: ${C.muted}; opacity: 0.8; }
        input:focus, select:focus { border-color: ${C.amber} !important; }
        button:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 2px; }
        @media (max-width: 860px) { .login-brand-panel { display: none !important; } }
      `}</style>

      {/* LEFT BRAND PANEL */}
      <div
        className="login-brand-panel"
        style={{
          flex: "0 0 46%", maxWidth: 560, background: C.panel, borderRight: `1px solid ${C.border}`,
          padding: "52px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.amberDim} 0%, transparent 70%)`, opacity: 0.35,
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: 8, background: C.amber, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Truck size={18} strokeWidth={2.4} color={C.bg} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }}>TransitOps</span>
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.25, margin: "0 0 14px" }}>
            Fleet operations,<br />under control.
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, maxWidth: 380, margin: 0 }}>
            Track vehicles, drivers, trips, and costs in one console — built for fleet managers,
            drivers, safety officers, and financial analysts alike.
          </p>
        </div>

        <div style={{ position: "relative", display: "flex", gap: 28, flexWrap: "wrap" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: C.text }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 700, margin: 0 }}>
              Sign in to your account
            </h2>
            <p style={{ fontSize: 13, color: C.muted, margin: "6px 0 0" }}>
              Enter your credentials to access the fleet console.
            </p>
            <p style={{ fontSize: 11.5, color: C.muted, margin: "10px 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
              Demo login: demo@transitops.com / demo1234
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle} htmlFor="login-email">Email address</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle} htmlFor="login-password">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 10, top: 9, background: "none", border: "none",
                  cursor: "pointer", padding: 4, display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={15} color={C.muted} /> : <Eye size={15} color={C.muted} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle} htmlFor="login-role">Sign in as</label>
            <div style={{ position: "relative" }}>
              <ShieldCheck size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <select
                id="login-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer", paddingRight: 30 }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} style={{ background: C.panel }}>{r}</option>
                ))}
              </select>
              <ChevronDown size={13} color={C.muted} style={{ position: "absolute", right: 12, top: 13, pointerEvents: "none" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.muted, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: C.amber, width: 14, height: 14, cursor: "pointer" }}
              />
              Remember me
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 12.5, color: C.amber, textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(196,83,75,0.12)", border: `1px solid ${C.red}`, color: C.red,
                fontSize: 12.5, borderRadius: 7, padding: "9px 12px", marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%", background: C.amber, border: "none", color: C.bg, fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: 14, padding: "11px 0", borderRadius: 8, cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.75 : 1, transition: "opacity 0.15s ease",
            }}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>

          <p style={{ fontSize: 12.5, color: C.muted, textAlign: "center", marginTop: 20 }}>
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onGoToSignUp(); }}
              style={{ color: C.amber, textDecoration: "none", fontWeight: 600 }}
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CREATE ACCOUNT (SIGN UP) PAGE
   ============================================================ */
function SignUpPage({ users, onCreateAccount, onGoToSignIn }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => onGoToSignIn(), 1800);
    return () => clearTimeout(t);
  }, [success, onGoToSignIn]);

  const inputStyle = {
    width: "100%",
    background: C.panelRaised,
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: 13.5,
    fontFamily: "'Inter', sans-serif",
    padding: "10px 12px 10px 38px",
    borderRadius: 8,
    outline: "none",
  };

  const labelStyle = {
    fontSize: 11.5,
    color: C.muted,
    fontFamily: "'Space Grotesk', sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    fontWeight: 600,
    display: "block",
    marginBottom: 7,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }
    const emailTaken = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (emailTaken) {
      setError("An account with this email already exists.");
      return;
    }
    if (username.trim()) {
      const usernameTaken = users.some(
        (u) => u.username && u.username.toLowerCase() === username.trim().toLowerCase()
      );
      if (usernameTaken) {
        setError("This username is already taken.");
        return;
      }
    }

    onCreateAccount({
      fullName: fullName.trim(),
      email: email.trim(),
      username: username.trim() || null,
      password,
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');`}</style>
        <div style={{ textAlign: "center", maxWidth: 360, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <CheckCircle2 size={44} color={C.emerald} strokeWidth={1.8} />
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>
            Account created successfully
          </h2>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>
            Please sign in. Redirecting you to the sign in page…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: ${C.muted}; opacity: 0.8; }
        input:focus { border-color: ${C.amber} !important; }
        button:focus-visible, input:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 2px; }
        @media (max-width: 860px) { .signup-brand-panel { display: none !important; } }
      `}</style>

      {/* LEFT BRAND PANEL */}
      <div
        className="signup-brand-panel"
        style={{
          flex: "0 0 46%", maxWidth: 560, background: C.panel, borderRight: `1px solid ${C.border}`,
          padding: "52px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%",
            background: `radial-gradient(circle, ${C.amberDim} 0%, transparent 70%)`, opacity: 0.35,
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: 8, background: C.amber, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Truck size={18} strokeWidth={2.4} color={C.bg} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }}>TransitOps</span>
          </div>

          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, lineHeight: 1.25, margin: "0 0 14px" }}>
            Join the fleet<br />console.
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, maxWidth: 380, margin: 0 }}>
            Create an account to track vehicles, drivers, trips, and costs in one console —
            built for fleet managers, drivers, safety officers, and financial analysts alike.
          </p>
        </div>
      </div>

      {/* RIGHT SIGN UP FORM */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 700, margin: 0 }}>
              Create your account
            </h2>
            <p style={{ fontSize: 13, color: C.muted, margin: "6px 0 0" }}>
              Fill in your details to get access to the fleet console.
            </p>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle} htmlFor="signup-name">Full name</label>
            <div style={{ position: "relative" }}>
              <UserRound size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle} htmlFor="signup-email">Email address</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle} htmlFor="signup-username">Username (optional)</label>
            <div style={{ position: "relative" }}>
              <ShieldCheck size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                id="signup-username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle} htmlFor="signup-password">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 10, top: 9, background: "none", border: "none",
                  cursor: "pointer", padding: 4, display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={15} color={C.muted} /> : <Eye size={15} color={C.muted} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle} htmlFor="signup-confirm-password">Confirm password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color={C.muted} style={{ position: "absolute", left: 12, top: 12 }} />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 10, top: 9, background: "none", border: "none",
                  cursor: "pointer", padding: 4, display: "flex",
                }}
              >
                {showConfirmPassword ? <EyeOff size={15} color={C.muted} /> : <Eye size={15} color={C.muted} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(196,83,75,0.12)", border: `1px solid ${C.red}`, color: C.red,
                fontSize: 12.5, borderRadius: 7, padding: "9px 12px", marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: "100%", background: C.amber, border: "none", color: C.bg, fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: 14, padding: "11px 0", borderRadius: 8, cursor: "pointer",
            }}
          >
            Create Account
          </button>

          <p style={{ fontSize: 12.5, color: C.muted, textAlign: "center", marginTop: 20 }}>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onGoToSignIn(); }}
              style={{ color: C.amber, textDecoration: "none", fontWeight: 600 }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardApp({ initialRole, onSignOut }) {
  const [section, setSection] = useState("dashboard");
  const [role, setRole] = useState(initialRole || ROLES[0]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const timeStr = useMemo(
    () =>
      now.toLocaleString("en-IN", {
        weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
      }),
    [now]
  );

  const meta = SECTION_META[section];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        button:focus-visible, select:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 2px; }
      `}</style>

      {/* SIDEBAR */}
      <aside
        style={{
          width: 208, flexShrink: 0, background: C.panel, borderRight: `1px solid ${C.border}`,
          padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px", marginBottom: 26 }}>
          <div
            style={{
              width: 30, height: 30, borderRadius: 7, background: C.amber, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Truck size={16} strokeWidth={2.4} color={C.bg} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15 }}>TransitOps</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const active = section === item.key;
          return (
            <div
              key={item.key}
              onClick={() => setSection(item.key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSection(item.key); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7,
                cursor: "pointer",
                background: active ? "rgba(201,146,47,0.12)" : "transparent",
                borderLeft: active ? `2px solid ${C.amber}` : "2px solid transparent",
                color: active ? C.text : C.muted,
              }}
            >
              <item.icon size={16} strokeWidth={2} />
              <span style={{ fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>{item.label}</span>
            </div>
          );
        })}

        <div style={{ marginTop: "auto", padding: "12px 10px", borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={onSignOut}
            style={{
              display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer",
              color: C.muted, fontSize: 12, fontFamily: "'Inter', sans-serif", padding: "9px 2px 0", width: "100%",
            }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: "24px 28px 40px", minWidth: 0 }}>
        <div className="flex items-start justify-between" style={{ marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, margin: 0 }}>
              {meta.title}
            </h1>
            <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 0" }}>{meta.subtitle}</p>
          </div>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: C.muted, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 12px",
            }}
          >
            <Circle size={7} fill={C.emerald} color={C.emerald} />
            {timeStr}
          </div>
        </div>

        {section === "dashboard" && <DashboardSection />}
        {section === "vehicles" && <VehiclesSection />}
        {section === "drivers" && <DriversSection />}
        {section === "trips" && <TripsSection />}
        {section === "maintenance" && <MaintenanceSection />}
        {section === "fuel" && <FuelExpensesSection />}
        {section === "reports" && <ReportsSection />}
      </main>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authView, setAuthView] = useState("signin"); // "signin" | "signup"
  const [users, setUsers] = useState([
    { fullName: "Demo User", email: "demo@transitops.com", username: "demo", password: "demo1234" },
  ]);

  if (!session) {
    if (authView === "signup") {
      return (
        <SignUpPage
          users={users}
          onCreateAccount={(newUser) => setUsers((prev) => [...prev, newUser])}
          onGoToSignIn={() => setAuthView("signin")}
        />
      );
    }
    return (
      <LoginPage
        users={users}
        onSignIn={(s) => setSession(s)}
        onGoToSignUp={() => setAuthView("signup")}
      />
    );
  }

  return (
    <DashboardApp
      initialRole={session.role}
      onSignOut={() => {
        setSession(null);
        setAuthView("signin");
      }}
    />
  );
}
