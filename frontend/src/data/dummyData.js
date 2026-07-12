export const kpiData = [
  { title: 'Active Vehicles', value: 128, change: '+8.2%', icon: 'bi-truck', color: '#2563eb' },
  { title: 'Available Vehicles', value: 94, change: '+5.1%', icon: 'bi-check2-circle', color: '#16a34a' },
  { title: 'Vehicles in Maintenance', value: 17, change: '-2.4%', icon: 'bi-tools', color: '#f59e0b' },
  { title: 'Active Trips', value: 56, change: '+9.6%', icon: 'bi-sign-turn-right', color: '#0891b2' },
  { title: 'Pending Trips', value: 22, change: '-1.1%', icon: 'bi-hourglass-split', color: '#7c3aed' },
  { title: 'Drivers on Duty', value: 73, change: '+4.4%', icon: 'bi-people', color: '#0ea5e9' },
  { title: 'Fleet Utilization', value: '84%', change: '+3.8%', icon: 'bi-speedometer2', color: '#1d4ed8' },
  { title: 'Fuel Efficiency', value: '12.4 km/l', change: '+2.3%', icon: 'bi-fuel-pump', color: '#10b981' },
  { title: 'Operational Cost', value: '$48.2k', change: '-6.5%', icon: 'bi-cash-stack', color: '#dc2626' }
];

export const vehicles = [
  { id: 'VH-101', type: 'Truck', model: 'Volvo FH16', plate: 'KA01AB1234', status: 'Active', location: 'Bengaluru', fuel: '74%', mileage: '182,300 km' },
  { id: 'VH-102', type: 'Van', model: 'Mercedes Sprinter', plate: 'MH12CD5678', status: 'Maintenance', location: 'Pune', fuel: '42%', mileage: '96,800 km' },
  { id: 'VH-103', type: 'Bus', model: 'Tata Starbus', plate: 'DL04EF9876', status: 'Available', location: 'Delhi', fuel: '89%', mileage: '140,120 km' },
  { id: 'VH-104', type: 'Truck', model: 'Ashok Leyland 4220', plate: 'TN10GH3321', status: 'Active', location: 'Chennai', fuel: '65%', mileage: '205,650 km' },
  { id: 'VH-105', type: 'Mini Truck', model: 'Eicher Pro 2049', plate: 'GJ05JK1122', status: 'Available', location: 'Ahmedabad', fuel: '58%', mileage: '78,450 km' }
];

export const drivers = [
  { id: 'DR-201', name: 'Amit Sharma', license: 'DL-TR-88921', phone: '+91 9876543210', status: 'On Duty', rating: '4.8', assignedVehicle: 'VH-101' },
  { id: 'DR-202', name: 'Rahul Verma', license: 'MH-TR-78211', phone: '+91 9811122233', status: 'Off Duty', rating: '4.6', assignedVehicle: 'VH-102' },
  { id: 'DR-203', name: 'Karan Mehta', license: 'KA-TR-99212', phone: '+91 9898989898', status: 'On Leave', rating: '4.5', assignedVehicle: 'VH-103' },
  { id: 'DR-204', name: 'Suresh Pillai', license: 'TN-TR-44198', phone: '+91 9765432109', status: 'On Duty', rating: '4.9', assignedVehicle: 'VH-104' },
  { id: 'DR-205', name: 'Imran Khan', license: 'GJ-TR-66344', phone: '+91 9700011122', status: 'On Duty', rating: '4.7', assignedVehicle: 'VH-105' }
];

export const trips = [
  { id: 'TR-501', route: 'Bengaluru -> Hyderabad', vehicle: 'VH-101', driver: 'Amit Sharma', status: 'In Progress', distance: '570 km', eta: '5 hrs', cargo: 'Electronics' },
  { id: 'TR-502', route: 'Pune -> Mumbai', vehicle: 'VH-102', driver: 'Rahul Verma', status: 'Pending', distance: '150 km', eta: '2 hrs', cargo: 'Retail Goods' },
  { id: 'TR-503', route: 'Delhi -> Jaipur', vehicle: 'VH-103', driver: 'Karan Mehta', status: 'Completed', distance: '280 km', eta: '-', cargo: 'Passenger Service' },
  { id: 'TR-504', route: 'Chennai -> Coimbatore', vehicle: 'VH-104', driver: 'Suresh Pillai', status: 'In Progress', distance: '505 km', eta: '4 hrs', cargo: 'Industrial Parts' },
  { id: 'TR-505', route: 'Ahmedabad -> Surat', vehicle: 'VH-105', driver: 'Imran Khan', status: 'Scheduled', distance: '270 km', eta: '3 hrs', cargo: 'FMCG' }
];

export const maintenance = [
  { id: 'MT-301', vehicle: 'VH-102', issue: 'Brake system inspection', priority: 'High', dueDate: '2026-07-15', status: 'In Progress', cost: '$1,250' },
  { id: 'MT-302', vehicle: 'VH-104', issue: 'Oil change & filter', priority: 'Medium', dueDate: '2026-07-18', status: 'Scheduled', cost: '$340' },
  { id: 'MT-303', vehicle: 'VH-101', issue: 'Tire replacement', priority: 'High', dueDate: '2026-07-21', status: 'Pending', cost: '$980' },
  { id: 'MT-304', vehicle: 'VH-103', issue: 'AC diagnostics', priority: 'Low', dueDate: '2026-07-25', status: 'Completed', cost: '$210' }
];

export const fuelExpenses = [
  { id: 'FE-401', category: 'Fuel', vehicle: 'VH-101', amount: '$420', date: '2026-07-10', status: 'Approved', note: 'Highway refill' },
  { id: 'FE-402', category: 'Repair', vehicle: 'VH-102', amount: '$1,240', date: '2026-07-09', status: 'Pending', note: 'Brake overhaul' },
  { id: 'FE-403', category: 'Toll', vehicle: 'VH-104', amount: '$75', date: '2026-07-08', status: 'Approved', note: 'Route toll booth' },
  { id: 'FE-404', category: 'Fuel', vehicle: 'VH-105', amount: '$295', date: '2026-07-07', status: 'Approved', note: 'City delivery cycle' },
  { id: 'FE-405', category: 'Service', vehicle: 'VH-103', amount: '$610', date: '2026-07-05', status: 'Rejected', note: 'Duplicate claim' }
];

export const activities = [
  { id: 1, title: 'Trip TR-501 departed from Bengaluru', time: '12 mins ago', icon: 'bi-send-check', color: 'primary' },
  { id: 2, title: 'Vehicle VH-102 moved to maintenance bay', time: '28 mins ago', icon: 'bi-tools', color: 'warning' },
  { id: 3, title: 'Fuel expense FE-401 approved by operations', time: '1 hr ago', icon: 'bi-fuel-pump', color: 'success' },
  { id: 4, title: 'Driver Amit Sharma checked in for shift', time: '2 hrs ago', icon: 'bi-person-check', color: 'info' },
  { id: 5, title: 'Maintenance order MT-304 marked complete', time: '4 hrs ago', icon: 'bi-patch-check', color: 'secondary' }
];

export const quickActions = [
  { label: 'Add Vehicle', icon: 'bi-truck', color: 'primary' },
  { label: 'Schedule Trip', icon: 'bi-map', color: 'success' },
  { label: 'Assign Driver', icon: 'bi-person-badge', color: 'info' },
  { label: 'Create Expense', icon: 'bi-receipt', color: 'warning' }
];

export const reportSummary = [
  { label: 'Monthly Revenue', value: '$182,400' },
  { label: 'Avg Trip Completion', value: '96.2%' },
  { label: 'Fuel Spend', value: '$21,300' },
  { label: 'Maintenance Spend', value: '$8,940' }
];
