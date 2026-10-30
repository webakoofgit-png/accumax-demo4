/** Company scope and contact details checked against accumaxcontrols.com. Detailed service scopes and sample project profiles require company review. */

export const COMPANY = {
  name: "Accumax Controls Pvt. Ltd.",
  short: "Accumax Controls",
  tagline: "Control Center of Engineering Excellence",
  address: "Saudamini Commercial Complex, Building: C-2, Office: 401, 402, Fourth Floor, Survey No. 101/1, Right Bhusari Colony, Near Chandani Chowk, Paud Road, Kothrud, Pune: 411 038, Maharashtra, India",
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
};

export const SERVICES: Service[] = [
  {
    slug: "epc-projects",
    num: "01",
    title: "EPC Projects",
    short: "Turnkey engineering, procurement and construction for power infrastructure.",
    image: "/images/products/epc-hero.jpg",
    intro:
      "We take substations and industrial power systems from first design review to energised handover under a single line of responsibility. Engineering, procurement and construction are coordinated as one scope, so owners deal with one accountable partner instead of a fragmented supply chain.",
    capabilities: [
      "Turnkey execution from design to handover",
      "Single point of responsibility for cost and schedule",
      "Procurement of primary and secondary plant",
      "Civil, electrical and fire-fighting coordination",
      "Quality plans aligned to customer specifications and codes",
      "Sectors: data centres, industry, power generation, infrastructure",
    ],
  },
  {
    slug: "scada-relay-testing",
    num: "02",
    title: "SCADA & Relay Testing",
    short: "Automation, protection programming and relay testing across all voltage levels.",
    image: "/images/products/scada-and-relay-testing.jpg",
    intro:
      "Protection schemes are only as strong as their settings. Our engineers programme numerical relays, calculate protection settings, test SCADA integrations and audit existing systems so that the network trips exactly when it should â€” and only then.",
    capabilities: [
      "Relay programming and configuration",
      "Protection setting calculations",
      "SCADA and substation automation (SAS) integration",
      "System audits of existing protection schemes",
      "Primary and secondary injection testing",
      "Commissioning support across all voltage levels",
    ],
  },
  {
    slug: "export",
    num: "03",
    title: "Export",
    short: "Trusted export of substation equipment, tools, materials and FRP products.",
    image: "/images/products/export-projects.jpg",
    intro:
      "As a globally trusted exporter, we supply technical expertise alongside hard goods: testing kits, substation equipment, construction tools, building materials, FRP products, panels, end-termination material, trays, supports, fasteners, light fittings, cables and lighting poles.",
    capabilities: [
      "Testing kits and technical instruments",
      "Substation equipment and components",
      "Electrical panels and end-termination material",
      "Cable trays, supports and fasteners",
      "FRP products, light fittings, cables and poles",
      "PPE and construction consumables",
    ],
  },
  {
    slug: "substation-testing-commissioning",
    num: "04",
    title: "Substation Testing & Commissioning",
    short: "Testing and commissioning of all voltage level systems, GIS and AIS.",
    image: "/images/products/substation-t-and-c.jpg",
    intro:
      "From GIS and AIS bays to protection panels, we test and commission every voltage level to specification â€” verifying insulation, protection behaviour and control logic before the first energisation and documenting every result for the owner.",
    capabilities: [
      "GIS and AIS testing & commissioning",
      "Transformer, switchgear and cable testing",
      "Protection and metering verification",
      "Pre-energisation checks and punch-list closure",
      "E-House and SAS commissioning",
      "Documented test records and handover packs",
    ],
  },
  {
    slug: "fabrication-civil-work",
    num: "05",
    title: "Fabrication & Civil Work",
    short: "Substation civil works, mechanical fabrication and site infrastructure.",
    image: "/images/products/material-and-mech-fabrication-and-civil.jpg",
    intro:
      "A substation is only as reliable as its foundations. We execute the civil works and mechanical fabrication around the electrical scope â€” equipment foundations, cable trenches, structures, enclosures and site buildings â€” built to interface cleanly with the electrical package.",
    capabilities: [
      "Equipment foundations and cable trenches",
      "Structural fabrication and galvanised supports",
      "Control room and E-House construction",
      "Fire-fighting and MEP works",
      "Earthing and lightning protection installation",
      "Site development and access roads",
    ],
  },
  {
    slug: "gis-erection-supervision",
    num: "06",
    title: "GIS Erection & Supervision",
    short: "Gas-insulated switchgear erection with expert site supervision.",
    image: "/images/products/gis-direction-and-supervision.jpg",
    intro:
      "GIS demands millimetre-level discipline. Our erection teams handle unloading, assembly, gasket work and gas handling under experienced supervision, so every bay is built to the manufacturer's tolerances and tested before handover.",
    capabilities: [
      "GIS bay unloading, assembly and alignment",
      "SF6 gas handling, filling and monitoring",
      "Busbar and inter-bay connection work",
      "Manufacturer-tolerance supervision",
      "Interface with testing and commissioning teams",
      "AMC and post-commissioning support",
    ],
  },
  {
    slug: "solar-ev-station",
    num: "07",
    title: "Solar & EV Station",
    short: "Solar power projects and EV charging infrastructure, end to end.",
    image: "/images/products/solar-and-ev-station.jpg",
    intro:
      "The grid is changing and we build for it. From rooftop and ground-mounted solar plants to EV charging stations with the electrical backbone to support them, we deliver renewable and mobility infrastructure ready for the next decade of load growth.",
    capabilities: [
      "Rooftop and ground-mounted solar plants",
      "EV charging station design and installation",
      "Inverters, transformers and grid interfaces",
      "Solar evacuation and net-metering support",
      "Charging load management infrastructure",
      "Operation and maintenance support",
    ],
  },
  {
    slug: "trading",
    num: "08",
    title: "Trading",
    short: "Sourcing and supply of electrical and industrial materials, importer & exporter.",
    image: "/images/products/trading.jpg",
    intro:
      "We trade in the materials that keep projects moving â€” as importer and exporter of electrical panels, substation components, trays, fasteners, fittings and building materials, with the sourcing network to meet aggressive project schedules.",
    capabilities: [
      "Importer and exporter of electrical goods",
      "Substation components and spares",
      "Cable trays, supports and fasteners",
      "Light fittings and lighting poles",
      "Building materials for electrical works",
      "Supplier development and quality vetting",
    ],
  },
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
  {
    num: '01',
    title: 'EPC & Project Execution',
    short: 'End-to-end Engineering, Procurement and Construction (EPC) solutions for industrial, commercial and infrastructure projects.',
    image: '/images/products/epc-hero.jpg',
    points: [
      'Electrical EPC, industrial electrification and MEP works.',
      'Power distribution systems, substations, HT/LT installations and cabling.',
      'Electrical infrastructure for data centres, automotive, process industries, metro rail and manufacturing plants.',
      'Design engineering, procurement, installation, testing, commissioning and project management.',
      'LV panels, MCCs, PCCs, control panels and electrical system retrofitting.',
    ],
  },
  {
    num: '02',
    title: 'Solar & Renewable Energy',
    short: 'Comprehensive solar power solutions, from feasibility assessment to commissioning and long-term asset performance.',
    image: '/images/products/solar-and-ev-station.jpg',
    points: [
      'Ground-mounted and rooftop solar PV EPC projects.',
      'Captive and open-access solar power project development support.',
      'Feasibility studies, DPRs, design engineering and project management consultancy (PMC).',
      'DC/AC electrical systems, evacuation infrastructure and grid connectivity.',
      'Solar plant testing, commissioning, O&M and performance monitoring.',
    ],
  },
  {
    num: '03',
    title: 'Substations, GIS & AIS Switchgear',
    short: 'Specialized engineering and execution services for high-voltage substations and power transmission infrastructure.',
    image: '/images/products/gis-direction-and-supervision.jpg',
    points: [
      'GIS and AIS substations, switchyards and associated electrical works up to 400 kV.',
      'Substation engineering, equipment installation, erection supervision and commissioning.',
      'GIS installation, gas handling, cable terminations and associated testing.',
      'Protection, control, SCADA and Substation Automation Systems (SAS).',
      'Substation retrofitting, upgrades and reliability improvement.',
    ],
  },
  {
    num: '04',
    title: 'Operations, Maintenance & AMC',
    short: 'Preventive, predictive and corrective maintenance services for reliable electrical and industrial operations.',
    image: '/images/products/substation-t-and-c.jpg',
    points: [
      'Annual Maintenance Contracts (AMC) for electrical installations and MEP systems.',
      'HT/LT switchgear, transformers, substations and distribution equipment maintenance.',
      'Electrical system audits, condition assessment and preventive maintenance.',
      'Breakdown support, fault identification, rectification and equipment refurbishment.',
      'Solar plant O&M and performance optimization.',
    ],
  },
  {
    num: '05',
    title: 'Live Electrical Panel Cleaning',
    short: 'Specialized online/live electrical panel cleaning solutions designed to minimize production interruptions.',
    image: '/images/products/scada-and-relay-testing.jpg',
    points: [
      'Cleaning of energized electrical panels using specialized non-conductive cleaning chemicals.',
      'Applications for MCCs, PCCs, control panels, distribution boards and industrial electrical equipment.',
      'Removal of dust, oil, grease and industrial contaminants.',
      'Planned cleaning programs supporting electrical reliability and preventive maintenance.',
      'Supply of NKW 99 OPP and NWK 747 cleaning chemicals, on-site services and customer maintenance-team training.',
    ],
  },
  {
    num: '06',
    title: 'Electrical Testing & Commissioning',
    short: 'Integrated testing, protection engineering and commissioning services for electrical power systems.',
    image: '/images/products/substation-t-and-c.jpg',
    points: [
      'Testing and commissioning of MV/EHV switchgear, transformers, cables and substations.',
      'Numerical relay testing, protection coordination and relay setting configuration.',
      'SCADA, SAS, communication systems and control circuit testing.',
      'GIS/AIS equipment testing, cable fault location and rectification.',
      'Transformer oil filtration, diagnostic testing and electrical system troubleshooting.',
    ],
  },
  {
    num: '07',
    title: 'Exports & Engineered Products',
    short: 'International sourcing and supply of electrical, industrial and infrastructure products.',
    image: '/images/products/export-projects.jpg',
    points: [
      'Substation and transmission-line equipment, electrical enclosures and cable accessories.',
      'PPE, industrial safety products, construction tools and measuring instruments.',
      'FRP enclosures, cable trays, handrails, cabinets and engineered structures.',
      'Structural steel, lighting poles, earthing materials and electrical installation accessories.',
      'Industrial MEP materials and customized engineering products.',
    ],
  },
];
export const INDUSTRIES: Industry[] = [
  { name: "Power Utilities", image: "/images/portfolio/i7.jpg", applications: "Substations, protection systems, network audits" },
  { name: "Data Centers", image: "/images/portfolio/i16.jpg", applications: "Reliable power distribution, E-House solutions" },
  { name: "Automobiles", image: "/images/portfolio/i1.jpg", applications: "Plant electrification, EV charging infrastructure" },
  { name: "Refineries", image: "/images/portfolio/i4.jpg", applications: "Hazardous-area electrical works, testing" },
  { name: "Chemical Industries", image: "/images/portfolio/i2.jpg", applications: "Process power systems, substation civil works" },
  { name: "Pharmaceutical", image: "/images/portfolio/i8.jpg", applications: "Clean-power distribution, AMC support" },
  { name: "Food & Beverage", image: "/images/portfolio/i3.jpg", applications: "Plant power systems, lighting and panels" },
  { name: "Cement Industries", image: "/images/portfolio/i10.jpg", applications: "Heavy-drive power systems, substations" },
  { name: "Metro", image: "/images/portfolio/i11.jpg", applications: "Traction and auxiliary substation works" },
  { name: "Defence", image: "/images/portfolio/i12.jpg", applications: "Secure power infrastructure, testing" },
  { name: "EV Stations", image: "/images/portfolio/i13.jpg", applications: "Charging infrastructure end to end" },
  { name: "Textile Industries", image: "/images/portfolio/i14.jpg", applications: "Plant electrification, power quality" },
  { name: "Mining Industry", image: "/images/portfolio/i15.jpg", applications: "Rugged distribution, mobile substations" },
  { name: "Plastic Industries", image: "/images/portfolio/i17.jpg", applications: "Process power, panels and switchgear" },
  { name: "Educational", image: "/images/portfolio/i5.jpg", applications: "Campus electrification, safety upgrades" },
  { name: "Pulp & Paper", image: "/images/portfolio/i9.jpg", applications: "Continuous-process power reliability" },
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

