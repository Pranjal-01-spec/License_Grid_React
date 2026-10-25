export const initialTools = [
  { 
    id: 1, 
    name: "Figma", 
    category: "Design", 
    monthlyCost: 450, 
    totalSeats: 30, 
    assignedSeats: 2,
    status: "Active",
    vendorUrl: "https://figma.com",
    billingCycle: "Monthly",
    notes: "Enterprise UI/UX collaborative design workspace.",
    assignments: [
      { id: 101, name: "Aarav Sharma", department: "UI/UX Design", assignedDate: "2026-01-15" },
      { id: 102, name: "Sneha Patel", department: "Product Team", assignedDate: "2026-02-01" }
    ]
  },
  { 
    id: 2, 
    name: "GitHub Enterprise", 
    category: "Developer Tools", 
    monthlyCost: 840, 
    totalSeats: 40, 
    assignedSeats: 2,
    status: "Active",
    vendorUrl: "https://github.com",
    billingCycle: "Annual",
    notes: "Core code repositories, CI/CD Actions, and security audit logging.",
    assignments: [
      { id: 103, name: "Rohan Verma", department: "Backend Core", assignedDate: "2025-11-10" },
      { id: 104, name: "Ananya Iyer", department: "DevOps", assignedDate: "2026-01-05" }
    ]
  },
  { 
    id: 3, 
    name: "Zoom Pro", 
    category: "Communication", 
    monthlyCost: 200, 
    totalSeats: 15, 
    assignedSeats: 1,
    status: "Active",
    vendorUrl: "https://zoom.us",
    billingCycle: "Monthly",
    notes: "Client video conferencing and internal all-hands meetings.",
    assignments: [
      { id: 105, name: "Kunal Gupta", department: "Human Resources", assignedDate: "2026-02-14" }
    ]
  },
  {
    id: 4,
    name: "Notion",
    category: "Productivity",
    monthlyCost: 320,
    totalSeats: 25,
    assignedSeats: 4,
    status: "Active",
    vendorUrl: "https://notion.so",
    billingCycle: "Monthly",
    notes: "Team wiki, technical specs, and quarterly planning board.",
    assignments: [
      { id: 106, name: "Pooja Reddy", department: "Product Team", assignedDate: "2026-02-10" },
      { id: 107, name: "Devendra Rao", department: "Engineering", assignedDate: "2026-02-12" },
      { id: 108, name: "Aarav Sharma", department: "UI/UX Design", assignedDate: "2026-02-15" },
      { id: 109, name: "Meera Nair", department: "Marketing", assignedDate: "2026-02-18" }
    ]
  },
  {
    id: 5,
    name: "Datadog APM",
    category: "Developer Tools",
    monthlyCost: 1150,
    totalSeats: 12,
    assignedSeats: 3,
    status: "Active",
    vendorUrl: "https://datadoghq.com",
    billingCycle: "Annual",
    notes: "Infrastructure observability, synthetic monitors, and error alerts.",
    assignments: [
      { id: 110, name: "Ananya Iyer", department: "DevOps", assignedDate: "2026-01-20" },
      { id: 111, name: "Rohan Verma", department: "Backend Core", assignedDate: "2026-01-22" },
      { id: 112, name: "Siddharth Jain", department: "Site Reliability", assignedDate: "2026-02-05" }
    ]
  },
  {
    id: 6,
    name: "Slack Business+",
    category: "Communication",
    monthlyCost: 560,
    totalSeats: 50,
    assignedSeats: 5,
    status: "Active",
    vendorUrl: "https://slack.com",
    billingCycle: "Monthly",
    notes: "Company-wide messaging channels, huddles, and bot workflows.",
    assignments: [
      { id: 113, name: "Kunal Gupta", department: "Human Resources", assignedDate: "2025-10-01" },
      { id: 114, name: "Pooja Reddy", department: "Product Team", assignedDate: "2025-10-01" },
      { id: 115, name: "Aarav Sharma", department: "UI/UX Design", assignedDate: "2025-10-01" },
      { id: 116, name: "Rohan Verma", department: "Backend Core", assignedDate: "2025-10-01" },
      { id: 117, name: "Sneha Patel", department: "Product Team", assignedDate: "2025-10-01" }
    ]
  }
];
