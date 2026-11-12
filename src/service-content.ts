import { FIELD_SERVICE_IMAGES } from './field-images';
import type { Service } from './data';

/** Revised from Accumax's official service pages; see docs/content-refresh-2026-11-04.md. */
const services: Service[] = [
  {
    slug: 'epc-projects', num: '01', title: 'EPC Projects', image: '/images/products/epc-hero.jpg',
    headline: 'One project. Every stage connected.',
    short: 'Turn your project brief into a coordinated plan for engineering, procurement, construction and handover.',
    intro: 'Build with a clear connection between what is designed, what is sourced and what happens on site. Accumax coordinates EPC services for electrical infrastructure, bringing project decisions and execution into one delivery scope.',
    capabilities: ['Engineering and design coordination', 'Equipment and material procurement', 'Civil and electrical construction coordination', 'Installation and site execution', 'Project quality and safety planning', 'Turnkey delivery and handover coordination'],
    details: [
      { title: 'Fewer gaps between project stages', text: 'Engineering decisions shape procurement. Material availability shapes construction. We bring these activities together so interfaces, responsibilities and site priorities can be addressed early.' },
      { title: 'A scope your team can work with', text: 'The project brief sets the direction for design, sourcing and installation. Customer specifications and quality requirements guide execution through to handover.' },
    ],
    applications: 'Substations, industrial plants, data centres, renewable energy facilities and infrastructure developments.',
    enquiryItems: ['Project location and target completion date', 'Single-line diagram or initial technical brief', 'Engineering, procurement and construction scope', 'Customer specifications and site constraints'],
  },
  {
    slug: 'panel-cleaning', num: '09', title: 'Live Electric Panel Cleaning', image: '/images/products/scada-and-relay-testing.jpg',
    headline: 'Plan panel care around your installation.',
    short: 'Discuss electrical panel cleaning, equipment suitability and site requirements with our team.',
    intro: 'Share your panel details and operating conditions so the team can review the cleaning scope, access and maintenance requirements. The method and work schedule are agreed around the equipment and site conditions.',
    capabilities: ['Panel and equipment scope review', 'Site access and operating-condition review', 'Cleaning method and equipment suitability discussion', 'Maintenance and work scheduling coordination'],
    details: [
      { title: 'Start with the equipment', text: 'Tell us the panel type, quantity, condition and installation environment. These details help the team understand the cleaning requirement.' },
      { title: 'Agree the site plan', text: 'Discuss isolation requirements, access, site procedures and the preferred maintenance window before work is scheduled.' },
    ],
    applications: 'Electrical panels in industrial facilities, commercial installations and substation environments.',
    enquiryItems: ['Panel type, quantity and condition', 'Site location and operating environment', 'Access and isolation requirements', 'Preferred maintenance date or service schedule'],
  },
  {
    slug: 'scada-relay-testing', num: '02', title: 'SCADA & Relay Testing', image: '/images/products/scada-and-relay-testing.jpg',
    headline: 'See the system. Check the protection.',
    short: 'Connect real-time monitoring with relay testing, protection settings and substation automation.',
    intro: 'Keep operating data and protection performance in the same conversation. Accumax supports Supervisory Control and Data Acquisition (SCADA), Substation Automation Systems (SAS), relay programming and testing for electrical networks.',
    capabilities: ['SCADA monitoring and remote-control integration', 'Substation automation interfaces', 'Protective relay programming', 'Protection setting calculations', 'Primary and secondary injection testing', 'End-to-end protection scheme testing'],
    details: [
      { title: 'Visibility for the operating team', text: 'SCADA brings field signals into a shared view of operating conditions. Monitoring and remote-control requirements are considered alongside the substation automation scope.' },
      { title: 'Testing that follows the protection scheme', text: 'Primary injection evaluates the wider protection path. Secondary injection checks relay response using simulated signals. End-to-end testing assesses coordination between protection points.' },
    ],
    applications: 'Utility substations, industrial power networks, generation facilities and infrastructure projects.',
    enquiryItems: ['Relay make, model and protection functions', 'Approved settings or coordination requirements', 'Single-line diagram and automation architecture', 'Testing scope, site access and outage window'],
  },
  {
    slug: 'export', num: '03', title: 'Exports', image: '/images/products/export-projects.jpg',
    headline: 'Source the right equipment for your project.',
    short: 'Electrical equipment, testing kits and installation materials sourced around your technical requirements.',
    intro: 'Bring your equipment list to a team that understands the installation around it. Accumax supports export and import requirements for power-sector equipment, electrical goods and construction materials.',
    capabilities: ['Substation components and testing kits', 'Electrical panels and cable terminations', 'Cable trays, supports and fasteners', 'Cables, lighting equipment and poles', 'Construction tools and building materials', 'Personal protective equipment and FRP products'],
    details: [
      { title: 'A practical supply conversation', text: 'Start with the specification, quantity and intended use. These details give the team a clear basis for discussing product suitability and the supply requirement.' },
      { title: 'Equipment and its supporting materials', text: 'Review the main equipment together with installation accessories. Panels, cable products and supporting materials can be discussed as part of the same enquiry.' },
    ],
    applications: 'Substation installations, industrial electrical works and energy infrastructure supply requirements.',
    enquiryItems: ['Item descriptions, quantities and technical specifications', 'Required drawings, datasheets or approved makes', 'Destination and delivery requirements', 'Target procurement date and documentation needs'],
  },
  {
    slug: 'substation-testing-commissioning', num: '04', title: 'Substation Testing & Commissioning', image: '/images/products/substation-t-and-c.jpg',
    headline: 'Bring equipment, control and protection together.',
    short: 'Coordinated testing and commissioning for GIS, AIS, automation and E-House systems.',
    intro: 'An installed system needs its equipment and interfaces checked together. Accumax supports substation testing and commissioning across voltage levels, with relay programming, protection settings and system audits within the agreed scope.',
    capabilities: ['Gas-insulated substation (GIS) commissioning', 'Air-insulated substation (AIS) commissioning', 'Substation Automation Systems (SAS)', 'E-House commissioning support', 'Relay programming and protection settings', 'System audits and protection checks'],
    details: [
      { title: 'Look beyond individual equipment', text: 'The commissioning scope connects the installed plant with its automation and protection requirements. Equipment lists, drawings and customer specifications establish the checks needed.' },
      { title: 'Plan around site readiness', text: 'Define the test scope and schedule alongside access, installation progress and operating constraints. Agree the reporting and handover requirements before the work begins.' },
    ],
    applications: 'New substations, industrial power installations, E-Houses and automation projects.',
    enquiryItems: ['Equipment list and voltage levels', 'Single-line diagrams and protection details', 'Installation status and proposed test schedule', 'Customer test requirements and handover expectations'],
  },
  {
    slug: 'fabrication-civil-work', num: '05', title: 'Fabrication & Civil Work', image: '/images/products/material-and-mech-fabrication-and-civil.jpg',
    headline: 'Build the foundations for electrical execution.',
    short: 'Custom steel fabrication and substation civil works aligned with your electrical installation.',
    intro: 'Good site execution starts with the physical works around the equipment. Accumax supports customised steel fabrication and substation civil works, coordinating construction needs with the wider electrical project.',
    capabilities: ['Customised steel fabrication', 'Substation civil works', 'Coordination with electrical installation layouts', 'Material sourcing and construction planning', 'Project quality and safety coordination', 'Site execution and handover support'],
    details: [
      { title: 'Fabrication shaped by the project', text: 'The equipment layout, material requirements and approved drawings guide the fabrication scope. Discuss the steelwork and its interfaces before construction activities are planned.' },
      { title: 'Civil and electrical work in step', text: 'Coordinating the two disciplines helps teams identify installation dependencies early. Customer specifications and the project quality plan provide the basis for execution.' },
    ],
    applications: 'Substations, industrial electrical installations, energy projects and infrastructure works.',
    enquiryItems: ['Site location and available drawings', 'Fabrication quantities and material specifications', 'Civil scope and electrical layout', 'Site access, sequence and target schedule'],
  },
  {
    slug: 'gis-erection-supervision', num: '06', title: 'GIS Erection & Supervision', image: '/images/products/gis-direction-and-supervision.jpg',
    headline: 'Precision at every installation interface.',
    short: 'Specialist supervision for GIS assembly, gas handling, electrical connections, testing and handover.',
    intro: 'Gas-insulated substations combine high-voltage equipment in a compact footprint. Accumax supports GIS erection and supervision, connecting installation checks with testing, protection and automation interfaces.',
    capabilities: ['Module positioning, assembly and alignment', 'SF6 filling and leakage checks', 'Cable terminations and busbar connections', 'Insulation, contact resistance and withstand tests', 'Protection coordination and SCADA interfaces', 'Operator guidance and handover documentation'],
    details: [
      { title: 'Supervise the complete installation', text: 'Module alignment, connections and gas handling are considered together. Inspection and testing requirements follow the project specification and applicable utility requirements.' },
      { title: 'Prepare for operation and handover', text: 'Risk assessment, gas-handling practices and installation checks support safe execution. Testing supervision, operator guidance and documentation help carry the project through handover.' },
    ],
    applications: 'GIS substations for utilities, industrial facilities and space-constrained power infrastructure.',
    enquiryItems: ['GIS make, configuration and voltage rating', 'Installation drawings and manufacturer requirements', 'Erection, gas handling and testing scope', 'Site readiness and handover schedule'],
  },
  {
    slug: 'solar-ev-station', num: '07', title: 'Solar & EV Station', image: '/images/products/solar-and-ev-station.jpg',
    headline: 'Connect cleaner power with everyday mobility.',
    short: 'Plan solar generation and EV charging around your site, available power and energy needs.',
    intro: 'Make solar and EV charging part of one electrical plan. Accumax brings experience from work across India to renewable generation and charging infrastructure, with system options considered around the site requirement.',
    capabilities: ['Solar photovoltaic generation systems', 'Inverter and electrical conversion systems', 'EV charging infrastructure', 'Battery storage integration options', 'Smart charging and load management', 'Grid connection and net-metering considerations'],
    details: [
      { title: 'Start with how the site uses energy', text: 'Available installation space, electricity demand and vehicle usage help shape the system. Solar generation and charging loads need to be considered together.' },
      { title: 'Choose options around the application', text: 'Storage, charging management and grid interfaces depend on the operating need. Net-metering eligibility and connection requirements need to be reviewed for the project location.' },
    ],
    applications: 'Industrial premises, commercial sites, institutional campuses and EV charging locations.',
    enquiryItems: ['Site location and available installation area', 'Electricity demand and available sanctioned load', 'Vehicle types, charger count and usage pattern', 'Solar, storage and grid-connection requirements'],
  },
  {
    slug: 'trading', num: '08', title: 'Trading', image: '/images/products/trading.jpg',
    headline: 'Keep your material list moving.',
    short: 'Source electrical products, site tools and installation materials through one focused enquiry.',
    intro: 'From core electrical equipment to the accessories around it, Accumax supports sourcing for project and installation requirements. Share your material list to start a clear, specification-led supply discussion.',
    capabilities: ['Electrical equipment and substation components', 'Panels and cable accessories', 'Cable trays, supports and fasteners', 'Cables, light fittings and poles', 'Construction tools and building materials', 'Personal protective equipment and FRP products'],
    details: [
      { title: 'A clearer starting point for sourcing', text: 'Group products by specification, quantity and intended application. Drawings and preferred makes, where relevant, help explain exactly what your site requires.' },
      { title: 'Plan procurement around the work', text: 'Discuss installation priorities and required dates with your material list. Equipment and supporting accessories can then be considered in the context of the project.' },
    ],
    applications: 'Electrical installations, substation works, industrial facilities and construction projects.',
    enquiryItems: ['Bill of materials with item quantities', 'Product specifications and approved makes', 'Delivery location and required dates', 'Drawings or datasheets for specialist items'],
  },

];

export const SERVICE_CONTENT: Service[] = services.map(service => ({ ...service, image: FIELD_SERVICE_IMAGES[service.slug] ?? service.image }));
