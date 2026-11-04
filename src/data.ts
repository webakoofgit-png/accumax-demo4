/** Service copy adapted from accumaxcontrols.com; see docs/official-content-review.md for sources and unresolved details. */

export const COMPANY = {
  name: "Accumax Controls Pvt. Ltd.",
  short: "Accumax Controls",
  tagline: "Expedite Efficiency with Excellence",
  address: "Offices 401–402, C-2, Saudamini Commercial Complex, Kothrud, Pune 411038, Maharashtra, India",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Saudamini+Commercial+Complex+Kothrud+Pune+411038",
  mapsEmbed: "https://maps.google.com/maps?q=Saudamini%20Commercial%20Complex%20Kothrud%20Pune%20411038&output=embed",
  phones: ["+91 99201 77441", "+91 73502 00025"],
  emails: ["info@accumaxcontrols.com"],
  whatsapp: "https://wa.link/yypj14",
  logo: "/images/logo.png",
};



export type Service = {
  slug: string;
  num: string;
  title: string;
  short: string;
  image: string;
  intro: string;
  capabilities: string[];
  details: { title: string; text: string }[];
  applications: string;
};

export const SERVICES: Service[] = [
  {
    "slug": "epc-projects",
    "num": "01",
    "title": "EPC Projects",
    "image": "/images/products/epc-hero.jpg",
    "short": "Engineering, procurement and construction coordinated from design through project handover.",
    "intro": "Accumax brings engineering, material procurement and construction together for power, industrial and infrastructure projects. A coordinated EPC scope connects design decisions, sourcing and site delivery through one project framework.",
    "capabilities": [
      "Engineering and design coordination",
      "Procurement and material sourcing",
      "Construction and installation coordination",
      "Turnkey project delivery and handover",
      "Quality control against agreed specifications",
      "Project planning and execution support"
    ],
    "details": [
      {
        "title": "One coordinated project scope",
        "text": "Combining engineering, procurement and construction helps align resources, interfaces and schedules. The EPC approach provides a clear point of coordination for the owner, from initial design through delivery."
      },
      {
        "title": "Quality throughout execution",
        "text": "Project quality plans, customer requirements and applicable safety and performance standards guide the work. Scope, responsibilities and handover expectations are established for the individual project."
      }
    ],
    "applications": "Data centres, industrial facilities, oil and gas, power generation, substations and infrastructure projects."
  },
  {
    "slug": "scada-relay-testing",
    "num": "02",
    "title": "SCADA & Relay Testing",
    "image": "/images/products/scada-and-relay-testing.jpg",
    "short": "Real-time monitoring, substation automation and testing of electrical protection schemes.",
    "intro": "SCADA connects system monitoring with remote control, while relay testing checks how protection responds to electrical faults. Accumax supports these complementary disciplines alongside relay programming, protection settings and system audits.",
    "capabilities": [
      "SCADA monitoring and control integration",
      "Substation Automation Systems (SAS)",
      "Protective relay programming",
      "Protection setting calculations",
      "Primary and secondary injection testing",
      "End-to-end protection scheme testing"
    ],
    "details": [
      {
        "title": "Monitoring and operational visibility",
        "text": "SCADA combines field hardware and software to collect operating data, support fault identification and enable remote supervision. It helps operators understand changing conditions across substations and industrial power systems."
      },
      {
        "title": "Protection testing methods",
        "text": "Primary injection checks the response of the wider protection system. Secondary injection uses simulated signals to test relays, while end-to-end testing checks coordination between protection points."
      }
    ],
    "applications": "Electrical utilities, substations, industrial networks, power generation and infrastructure facilities."
  },
  {
    "slug": "export",
    "num": "03",
    "title": "Export",
    "image": "/images/products/export-projects.jpg",
    "short": "Export and import support for electrical equipment, site materials, tools and engineered products.",
    "intro": "Accumax combines engineering knowledge with the supply of equipment and materials for energy projects. The published product range includes substation components, testing kits, PPE, construction tools, electrical goods, building materials and FRP products.",
    "capabilities": [
      "Substation equipment and testing kits",
      "Electrical panels and cable end terminations",
      "Cable trays, supports and fasteners",
      "PPE and construction tools",
      "Building materials and FRP products",
      "Light fittings, cables and lighting poles"
    ],
    "details": [
      {
        "title": "Equipment and installation materials",
        "text": "The supply range brings together electrical equipment and the accessories used around it, including panels, terminations, cable supports and lighting products. Requirements can be discussed alongside the engineering scope."
      },
      {
        "title": "Specify the required product",
        "text": "Share the equipment description, quantity, technical specification and intended application with the team. These details help establish the supply scope for your project."
      }
    ],
    "applications": "Power-sector projects, substation installations, construction works and industrial electrical infrastructure."
  },
  {
    "slug": "substation-testing-commissioning",
    "num": "04",
    "title": "Substation Testing & Commissioning",
    "image": "/images/products/substation-t-and-c.jpg",
    "short": "Testing and commissioning support for GIS, AIS and electrical systems across voltage levels.",
    "intro": "Accumax provides testing and commissioning services for power infrastructure, supported by expertise in GIS, AIS, substation automation and E-House solutions. System audits, relay programming and protection settings connect the equipment scope with its control and protection requirements.",
    "capabilities": [
      "GIS and AIS testing and commissioning",
      "Electrical systems across voltage levels",
      "Substation Automation Systems (SAS)",
      "E-House commissioning support",
      "Protective relay programming and settings",
      "System audits and protection checks"
    ],
    "details": [
      {
        "title": "Equipment, automation and protection",
        "text": "Commissioning brings together the substation equipment and its automation and protection interfaces. The work is defined around the installation, customer requirements and the systems included in the agreed scope."
      },
      {
        "title": "Plan the commissioning scope",
        "text": "Discuss the equipment list, voltage levels, protection arrangements and project schedule with the team. This establishes the testing requirements and coordination needed for the installation."
      }
    ],
    "applications": "GIS and AIS substations, industrial power systems, E-Houses and substation automation projects."
  },
  {
    "slug": "fabrication-civil-work",
    "num": "05",
    "title": "Fabrication & Civil Work",
    "image": "/images/products/material-and-mech-fabrication-and-civil.jpg",
    "short": "Custom steel fabrication and civil works coordinated with substation and electrical project requirements.",
    "intro": "Accumax supports customised steel fabrication and substation civil works as part of its power-sector offering. Civil, mechanical and electrical requirements are considered together so that the construction scope supports the wider installation.",
    "capabilities": [
      "Custom steel fabrication",
      "Substation civil works",
      "Coordination with electrical installation requirements",
      "Material sourcing and construction planning",
      "Project quality and safety coordination",
      "Site execution and handover support"
    ],
    "details": [
      {
        "title": "Fabrication around the installation",
        "text": "Custom fabrication connects material selection and construction with the needs of the electrical project. The required steelwork and civil scope are established from the project specifications."
      },
      {
        "title": "Coordinated construction",
        "text": "A combined project approach helps align design, procurement and construction activities. Customer specifications and agreed quality requirements guide the fabrication and civil works."
      }
    ],
    "applications": "Substations, industrial facilities, energy projects and infrastructure developments."
  },
  {
    "slug": "gis-erection-supervision",
    "num": "06",
    "title": "GIS Erection & Supervision",
    "image": "/images/products/gis-direction-and-supervision.jpg",
    "short": "GIS installation supervision, assembly, gas handling, testing and commissioning coordination.",
    "intro": "Gas-insulated substations bring high-voltage components into a compact installation. Accumax supports GIS erection and supervision, coordinating assembly, installation, testing and handover with the project requirements.",
    "capabilities": [
      "GIS module positioning, assembly and alignment",
      "SF6 filling and leakage checks",
      "Cable terminations and busbar connections",
      "Insulation, contact resistance and withstand testing",
      "Protection coordination and SCADA interfaces",
      "Operator training and handover documentation"
    ],
    "details": [
      {
        "title": "Installation and testing supervision",
        "text": "Supervision covers component positioning, assembly and the interfaces between gas handling, electrical connections and testing. The installation is checked against the applicable project and utility requirements."
      },
      {
        "title": "Safety and handover",
        "text": "Risk assessments, safe gas handling and quality inspections support execution. Commissioning coordination, operator guidance and reporting help prepare the installation for handover."
      }
    ],
    "applications": "High-voltage GIS substations and power distribution installations for utilities and industry."
  },
  {
    "slug": "solar-ev-station",
    "num": "07",
    "title": "Solar & EV Station",
    "image": "/images/products/solar-and-ev-station.jpg",
    "short": "Solar power and EV charging infrastructure supported by experience on projects across India.",
    "intro": "Accumax works in solar power and EV station infrastructure across India. The service connects renewable generation with electrical charging requirements, bringing together the systems needed for a practical solar and mobility installation.",
    "capabilities": [
      "Solar photovoltaic generation systems",
      "Inverter and electrical conversion systems",
      "EV charging infrastructure",
      "Battery storage integration options",
      "Smart charging and load management",
      "Grid connection and net-metering requirements"
    ],
    "details": [
      {
        "title": "Connecting solar generation with charging",
        "text": "A solar-powered charging installation combines PV panels, inverters and charging equipment. Battery storage may support energy availability, depending on the site and system design."
      },
      {
        "title": "Design around the application",
        "text": "Charging demand, grid access and the available solar resource shape the solution. Discuss charger requirements, storage, load balancing and net metering with the team for your site."
      }
    ],
    "applications": "Commercial premises, industrial sites and EV charging facilities with solar generation opportunities."
  },
  {
    "slug": "trading",
    "num": "08",
    "title": "Trading",
    "image": "/images/products/trading.jpg",
    "short": "Sourcing and supply of electrical products and construction materials for project requirements.",
    "intro": "Accumax supports material sourcing alongside its engineering and import-export activities. The product range connects substation components and electrical installation goods with tools, safety products and construction materials.",
    "capabilities": [
      "Electrical products and substation components",
      "Panels and cable accessories",
      "Cable trays, structural supports and fasteners",
      "Lighting products, cables and poles",
      "Construction tools and building materials",
      "PPE and FRP products"
    ],
    "details": [
      {
        "title": "Materials for the wider project",
        "text": "Sourcing considers the equipment and supporting materials needed around the electrical installation. Product requirements can be discussed together with the engineering or construction scope."
      },
      {
        "title": "Start with your specification",
        "text": "Provide the product description, quantities, preferred specification and intended use. The team can then discuss the supply requirement and its place in the project schedule."
      }
    ],
    "applications": "Electrical installations, substation projects, industrial facilities and construction works."
  }
];

export type Industry = {
  name: string;
  image: string;
  applications: string;
};

export type ExpertiseCategory = {
  num: string;
  title: string;
  short: string;
  image: string;
  points: string[];
};

export const EXPERTISE_CATEGORIES: ExpertiseCategory[] = [
  { num: '01', title: 'EPC & Project Execution', short: SERVICES[0].short, image: SERVICES[0].image, points: SERVICES[0].capabilities },
  { num: '02', title: 'Solar & Renewable Energy', short: SERVICES[6].short, image: SERVICES[6].image, points: SERVICES[6].capabilities },
  { num: '03', title: 'Substations, GIS & AIS Switchgear', short: SERVICES[5].short, image: SERVICES[5].image, points: SERVICES[5].capabilities },
  { num: '04', title: 'Operations, Maintenance & AMC', short: 'Annual maintenance support for electrical installations and substation systems.', image: '/images/products/substation-t-and-c.jpg', points: ['Annual Maintenance Contracts for electrical installations.', 'Maintenance planning around the equipment and operating requirements.', 'System audits, protection settings and commissioning coordination.', 'Discuss the site scope, service schedule and support requirements with the team.'] },
  { num: '05', title: 'Live Electrical Panel Cleaning', short: 'Discuss electrical panel cleaning requirements, equipment suitability and site conditions with our team.', image: '/images/products/scada-and-relay-testing.jpg', points: ['Share panel and equipment details for a scope review.', 'Confirm operating conditions and site safety requirements.', 'Discuss cleaning methods, access and maintenance planning with the team.'] },
  { num: '06', title: 'Electrical Testing & Commissioning', short: SERVICES[3].short, image: SERVICES[3].image, points: [...SERVICES[3].capabilities, 'Primary, secondary injection and end-to-end relay testing.'] },
  { num: '07', title: 'Exports & Engineered Products', short: SERVICES[2].short, image: SERVICES[2].image, points: SERVICES[2].capabilities },
];
export const INDUSTRIES: Industry[] = [
  { name: "Power Utilities", image: "/images/portfolio/i7.jpg", applications: "GIS and AIS substations, protection testing and automation" },
  { name: "Data Centers", image: "/images/portfolio/i16.jpg", applications: "Electrical EPC, substation systems and E-House solutions" },
  { name: "Automobiles", image: "/images/portfolio/i1.jpg", applications: "Industrial electrical infrastructure and EV charging" },
  { name: "Refineries", image: "/images/portfolio/i4.jpg", applications: "Electrical infrastructure, SCADA and protection testing" },
  { name: "Chemical Industries", image: "/images/portfolio/i2.jpg", applications: "Substation infrastructure and electrical project support" },
  { name: "Pharmaceutical", image: "/images/portfolio/i8.jpg", applications: "Electrical EPC, testing and maintenance support" },
  { name: "Food & Beverage", image: "/images/portfolio/i3.jpg", applications: "Industrial electrical systems and equipment supply" },
  { name: "Cement Industries", image: "/images/portfolio/i10.jpg", applications: "Substations, electrical works and commissioning" },
  { name: "Metro", image: "/images/portfolio/i11.jpg", applications: "Power infrastructure, substations and electrical works" },
  { name: "Defence", image: "/images/portfolio/i12.jpg", applications: "Electrical infrastructure, equipment supply and testing" },
  { name: "EV Stations", image: "/images/portfolio/i13.jpg", applications: "Solar generation, charging infrastructure and load management" },
  { name: "Textile Industries", image: "/images/portfolio/i14.jpg", applications: "Electrical installation, substation and AMC requirements" },
  { name: "Mining Industry", image: "/images/portfolio/i15.jpg", applications: "Substation infrastructure, electrical systems and testing" },
  { name: "Plastic Industries", image: "/images/portfolio/i17.jpg", applications: "Electrical installation, automation and equipment supply" },
  { name: "Educational", image: "/images/portfolio/i5.jpg", applications: "Electrical infrastructure, maintenance and equipment supply" },
  { name: "Pulp & Paper", image: "/images/portfolio/i9.jpg", applications: "Industrial electrical systems, testing and maintenance" },
];

/** Company scope and contact details checked against accumaxcontrols.com. Detailed service scopes and sample project profiles require company review. */
export type Project = {
  slug: string;
  num: string;
  category: string;
  title: string;
  image: string;
  note: string;
  scope: string[];
};

export const SAMPLE_NOTE =
  "Sample project profile shown for design review. Names, locations and figures are published only after client verification.";

export const PROJECTS: Project[] = [
  {
    slug: "gis-substation-erection",
    num: "01",
    category: "GIS Substation",
    title: "Gas-Insulated Switchgear Erection",
    image: "/images/gallery/3.jpg",
    note: SAMPLE_NOTE,
    scope: ["Bay assembly & alignment", "SF6 gas handling", "Testing & commissioning interface"],
  },
  {
    slug: "ais-substation-epc",
    num: "02",
    category: "AIS Substation",
    title: "Air-Insulated Substation EPC Package",
    image: "/images/gallery/4.jpg",
    note: SAMPLE_NOTE,
    scope: ["Civil & electrical works", "Primary plant erection", "Energisation support"],
  },
  {
    slug: "solar-power-project",
    num: "03",
    category: "Solar",
    title: "Ground-Mounted Solar Power Plant",
    image: "/images/gallery/5.jpg",
    note: SAMPLE_NOTE,
    scope: ["Module mounting structures", "Inverter & transformer installation", "Grid evacuation"],
  },
  {
    slug: "relay-panel-commissioning",
    num: "04",
    category: "Protection",
    title: "Relay Panel Testing & Commissioning",
    image: "/images/gallery/9.jpg",
    note: SAMPLE_NOTE,
    scope: ["Relay programming", "Setting calculations", "Secondary injection testing"],
  },
  {
    slug: "ehouse-solution",
    num: "05",
    category: "E-House",
    title: "Prefabricated E-House Power Solution",
    image: "/images/gallery/12.jpg",
    note: SAMPLE_NOTE,
    scope: ["E-House fabrication", "Equipment integration", "Site installation"],
  },
  {
    slug: "ev-charging-infrastructure",
    num: "06",
    category: "EV Infrastructure",
    title: "EV Charging Station Network",
    image: "/images/gallery/13.jpg",
    note: SAMPLE_NOTE,
    scope: ["Charger installation", "Load management", "O&M support"],
  },
];

export const CLIENT_LOGOS = Object.entries(import.meta.glob('/src/assets/client logos/*.{jpg,jpeg,png,webp,svg}', { eager: true, query: '?url', import: 'default' })).filter(([path]) => !/^c(?:[1-9]|1[0-9]|2[0-4])\.jpg$/i.test(path.split('/').pop() ?? '')).map(([, url]) => url) as string[];

export const GALLERY = [
  "/images/gallery/3.jpg",
  "/images/gallery/4.jpg",
  "/images/gallery/5.jpg",
  "/images/gallery/9.jpg",
  "/images/gallery/12.jpg",
  "/images/gallery/13.jpg",
  "/images/gallery/14.jpg",
  "/images/gallery/15.jpg",
  "/images/gallery/16.jpg",
  "/images/gallery/20.jpg",
  "/images/gallery/21.jpg",
];

export const NAV_SERVICES = SERVICES.map((s) => ({ slug: s.slug, title: s.title, num: s.num, image: s.image }));

export const QUALITY_POINTS = [
  "Providing products and services of the highest quality standards with safest conditions",
  "Continually reviewing and improving the quality management system",
  "Proven field quality plan for electrical, fire-fighting, MEP & instrumentation",
  "Striving for an accident-free workplace by maintaining the highest EHS standards",
  "Complying with customer specifications, codes and standards with statutory regulations",
  "Building quality culture through teamwork, employee empowerment and supplier development",
];

