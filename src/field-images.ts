import gisHall from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.15 PM (2).jpeg';
import outdoorSubstation from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.15 PM.jpeg';
import siteInstallation from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.16 PM (1).jpeg';
import transformer from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.16 PM (2).jpeg';
import switchgearPanels from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.16 PM.jpeg';
import team from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.17 PM.jpeg';
import controlPanels from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.15 PM (4).jpeg';
import testing from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.19 PM (2).jpeg';
import relayTestKit from './assets/all images/WhatsApp Image 2026-11-12 at 2.21.20 PM (3).jpeg';

/** Selected by visible equipment; duplicate photos and unidentified portraits are omitted. */
export const FIELD_IMAGES = { gisHall, outdoorSubstation, siteInstallation, transformer, switchgearPanels, team, controlPanels, testing, relayTestKit };

export const FIELD_SERVICE_IMAGES: Record<string, string> = {
  'epc-projects': outdoorSubstation,
  'panel-cleaning': switchgearPanels,
  'scada-relay-testing': relayTestKit,
  'substation-testing-commissioning': testing,
  'gis-erection-supervision': gisHall,
};

export const FIELD_GALLERY = [
  [gisHall, 'Gas-insulated switchgear inside a substation hall'],
  [outdoorSubstation, 'Outdoor high-voltage substation equipment'],
  [siteInstallation, 'Crane and site team positioning equipment beside an industrial building'],
  [transformer, 'Power transformer and electrical connections at a substation'],
  [switchgearPanels, 'Indoor switchgear panels and overhead cable infrastructure'],
  [controlPanels, 'Electrical control and protection panel lineup'],
  [testing, 'Engineers testing gas-insulated substation equipment'],
  [relayTestKit, 'Protective relay test kit'],
] as const;
