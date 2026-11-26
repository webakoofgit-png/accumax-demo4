import powerUtilitiesPhoto from './assets/all images/industry-power-utilities.jpg';
import dataCentresPhoto from './assets/all images/industry-data-centres.jpg';
import automobilesPhoto from './assets/all images/industry-automobiles.jpg';
import refineriesPhoto from './assets/all images/industry-refineries.jpg';
import chemicalPhoto from './assets/all images/industry-chemical-480.webp';
import pharmaceuticalPhoto from './assets/all images/industry-pharmaceutical.jpg';
import foodBeveragePhoto from './assets/all images/industry-food-beverage-960.webp';
import cementPhoto from './assets/all images/industry-cement.jpg';
import metroPhoto from './assets/all images/industry-metro-480.webp';
import evStationsPhoto from './assets/all images/industry-ev-stations.jpg';
import textilesPhoto from './assets/all images/industry-textiles.jpg';
import miningPhoto from './assets/all images/industry-mining.jpg';
import plasticsPhoto from './assets/all images/industry-plastics-1600.webp';
import educationPhoto from './assets/all images/industry-education.jpg';
import pulpPaperPhoto from './assets/all images/industry-pulp-paper.jpg';
import logo from './assets/images/logo.png';
import { FIELD_IMAGES, FIELD_GALLERY } from './field-images';
import { SERVICE_CONTENT } from './service-content';

/** Service copy adapted from accumaxcontrols.com; see docs/official-content-review.md for sources and unresolved details. */

export const COMPANY = {
  name: "Accumax Controls Pvt. Ltd.",
  short: "Accumax Controls",
  tagline: "Expedite Efficiency with Excellence",
  address: "Offices 401–402, C-2, Saudamini Commercial Complex, Kothrud, Pune 411038, Maharashtra, India",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Accumax+Controls+Pvt+Ltd+Saudamini+Commercial+Complex+Kothrud+Pune+411038",
  mapsEmbed: "https://maps.google.com/maps?q=Accumax%20Controls%20Pvt%20Ltd%20Saudamini%20Commercial%20Complex%20Kothrud%20Pune%20411038&z=16&output=embed",
  phones: ["+91 99201 77441", "+91 73502 00025"],
  emails: ["info@accumaxcontrols.com"],
  whatsapp: "https://wa.link/yypj14",
  logo,
};



export type Service = {
  slug: string;
  num: string;
  title: string;
  short: string;
  image: string;
  intro: string;
  headline: string;
  enquiryItems: string[];
  capabilities: string[];
  details: { title: string; text: string }[];
  applications: string;
};

export const SERVICES: Service[] = SERVICE_CONTENT;
export const SERVICE_OPTIONS = SERVICES.map(service => service.title);

export type Industry = {
  name: string;
  image: string;
  applications: string;
};

export type ExpertiseCategory = {
  num: string;
  title: string;
  slug: string;
  relatedSlug?: string;
  short: string;
  image: string;
  points: string[];
};

const category = (num: string, title: string, slug: string): ExpertiseCategory => {
  const service = SERVICES.find(item => item.slug === slug)!;
  return { num, title, slug, short: service.short, image: service.image, points: service.capabilities };
};

export const EXPERTISE_CATEGORIES: ExpertiseCategory[] = [
  category('01', 'EPC', 'epc-projects'),
  category('02', 'Live Electrical Panel Cleaning', 'panel-cleaning'),
  category('03', 'Substation', 'substation-testing-commissioning'),
  category('04', 'Relay', 'scada-relay-testing'),
  category('05', 'Exports', 'export'),
  category('06', 'Fabrication', 'fabrication-civil-work'),
  category('07', 'Solar & EV', 'solar-ev-station'),
  {
    ...category('08', 'GIS & Trading', 'gis-erection-supervision'),
    relatedSlug: 'trading',
    short: 'GIS erection and supervision, alongside electrical equipment, tools and installation material supply.',
    points: [...SERVICES.find(item => item.slug === 'gis-erection-supervision')!.capabilities,
      ...SERVICES.find(item => item.slug === 'trading')!.capabilities],
  },
];
/** Original seven points used by the homepage expertise experience. */
export const HOME_EXPERTISE_CATEGORIES: ExpertiseCategory[] = [
  category('01', 'EPC & Project Execution', 'epc-projects'),
  category('02', 'Solar & Renewable Energy', 'solar-ev-station'),
  category('03', 'Substations, GIS & AIS Switchgear', 'gis-erection-supervision'),
  {
    num: '04', title: 'Operations, Maintenance & AMC', slug: '',
    short: 'Annual maintenance support for electrical installations and substation systems.',
    image: FIELD_IMAGES.switchgearPanels,
    points: ['Annual Maintenance Contracts for electrical installations.', 'Maintenance planning around the equipment and operating requirements.', 'System audits, protection settings and commissioning coordination.', 'Discuss the site scope, service schedule and support requirements with the team.'],
  },
  {
    ...category('05', 'Live Electrical Panel Cleaning', 'panel-cleaning'),
    short: 'Discuss electrical panel cleaning requirements, equipment suitability and site conditions with our team.',
    points: ['Share panel and equipment details for a scope review.', 'Confirm operating conditions and site safety requirements.', 'Discuss cleaning methods, access and maintenance planning with the team.'],
  },
  {
    ...category('06', 'Electrical Testing & Commissioning', 'substation-testing-commissioning'),
    points: [...SERVICES.find(item => item.slug === 'substation-testing-commissioning')!.capabilities, 'Primary, secondary injection and end-to-end relay testing.'],
  },
  category('07', 'Exports & Engineered Products', 'export'),
];

export const INDUSTRIES: Industry[] = [
  { name: "Power Utilities", image: powerUtilitiesPhoto, applications: "GIS and AIS substations, protection testing and automation" },
  { name: "Data Centers", image: dataCentresPhoto, applications: "Electrical EPC, substation systems and E-House solutions" },
  { name: "Automobiles", image: automobilesPhoto, applications: "Industrial electrical infrastructure and EV charging" },
  { name: "Refineries", image: refineriesPhoto, applications: "Electrical infrastructure, SCADA and protection testing" },
  { name: "Chemical Industries", image: chemicalPhoto, applications: "Substation infrastructure and electrical project support" },
  { name: "Pharmaceutical", image: pharmaceuticalPhoto, applications: "Electrical EPC, testing and maintenance support" },
  { name: "Food & Beverage", image: foodBeveragePhoto, applications: "Industrial electrical systems and equipment supply" },
  { name: "Cement Industries", image: cementPhoto, applications: "Substations, electrical works and commissioning" },
  { name: "Metro", image: metroPhoto, applications: "Power infrastructure, substations and electrical works" },
  { name: "EV Stations", image: evStationsPhoto, applications: "Solar generation, charging infrastructure and load management" },
  { name: "Textile Industries", image: textilesPhoto, applications: "Electrical installation, substation and AMC requirements" },
  { name: "Mining Industry", image: miningPhoto, applications: "Substation infrastructure, electrical systems and testing" },
  { name: "Plastic Industries", image: plasticsPhoto, applications: "Electrical installation, automation and equipment supply" },
  { name: "Educational", image: educationPhoto, applications: "Electrical infrastructure, maintenance and equipment supply" },
  { name: "Pulp & Paper", image: pulpPaperPhoto, applications: "Industrial electrical systems, testing and maintenance" },
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
    image: FIELD_IMAGES.gisHall,
    note: SAMPLE_NOTE,
    scope: ["Bay assembly & alignment", "SF6 gas handling", "Testing & commissioning interface"],
  },
  {
    slug: "ais-substation-epc",
    num: "02",
    category: "AIS Substation",
    title: "Air-Insulated Substation EPC Package",
    image: FIELD_IMAGES.outdoorSubstation,
    note: SAMPLE_NOTE,
    scope: ["Civil & electrical works", "Primary plant erection", "Energisation support"],
  },
  {
    slug: "solar-power-project",
    num: "03",
    category: "Solar",
    title: "Ground-Mounted Solar Power Plant",
    image: FIELD_IMAGES.solar,
    note: SAMPLE_NOTE,
    scope: ["Module mounting structures", "Inverter & transformer installation", "Grid evacuation"],
  },
  {
    slug: "relay-panel-commissioning",
    num: "04",
    category: "Protection",
    title: "Relay Panel Testing & Commissioning",
    image: FIELD_IMAGES.testing,
    note: SAMPLE_NOTE,
    scope: ["Relay programming", "Setting calculations", "Secondary injection testing"],
  },
  {
    slug: "ehouse-solution",
    num: "05",
    category: "E-House",
    title: "Prefabricated E-House Power Solution",
    image: FIELD_IMAGES.siteInstallation,
    note: SAMPLE_NOTE,
    scope: ["E-House fabrication", "Equipment integration", "Site installation"],
  },
  {
    slug: "ev-charging-infrastructure",
    num: "06",
    category: "EV Infrastructure",
    title: "EV Charging Station Network",
    image: FIELD_IMAGES.ev,
    note: SAMPLE_NOTE,
    scope: ["Charger installation", "Load management", "O&M support"],
  },
];

export const CLIENT_LOGOS = Object.entries(import.meta.glob('/src/assets/client logos/*.{jpg,jpeg,png,webp,svg}', { eager: true, query: '?url', import: 'default' })).filter(([path]) => !/^c(?:[1-9]|1[0-9]|2[0-4])\.jpg$/i.test(path.split('/').pop() ?? '')).map(([, url]) => url) as string[];

export const GALLERY = FIELD_GALLERY.map(([image]) => image);

export const GALLERY_CAPTIONS: Record<string, string> = Object.fromEntries(FIELD_GALLERY);

export const NAV_SERVICES = SERVICES.map((s) => ({ slug: s.slug, title: s.title, num: s.num, image: s.image }));

export const QUALITY_POINTS = [
  "Quality products and services, supported by safe working practices",
  "Continuous review and improvement of quality processes",
  "Field quality plans for electrical, firefighting, MEP and instrumentation works",
  "Health and safety planning aimed at accident prevention",
  "Work guided by customer specifications, applicable codes and regulations",
  "Teamwork, employee involvement and supplier development",
];

