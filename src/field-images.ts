import electricalEpc from './assets/all images/electrical-epc.jpg';
import electricalEpcPreview from './assets/all images/electrical-epc-960.webp';
import gisHall from './assets/all images/gis-gallery-enhanced.jpg';
import outdoorSubstation from './assets/all images/ais-substation-original.jpg';
import siteInstallation from './assets/all images/ehouse-installation.jpg';
import siteLifting from './assets/all images/site-lifting.jpg';
import transformer from './assets/all images/transformer-original.jpg';
import transformerErection from './assets/all images/transformer-erection.jpg';
import switchgearPanels from './assets/all images/switchgear-gallery-enhanced.jpg';
import team from './assets/all images/company-team.jpg';
import engineeringTeam from './assets/all images/engineering-team.jpg';
import siteTeam from './assets/all images/site-engineering-team.jpg';
import teamGroup from './assets/all images/team-group.jpg';
import controlPanels from './assets/all images/control-panels-original.jpg';
import testing from './assets/all images/relay-testing-original.jpg';
import relayTestKit from './assets/all images/cmc356-original.jpg';
import solar from './assets/all images/solar-epc.jpg';
import ev from './assets/all images/ev-infrastructure.jpg';
import fabrication from './assets/all images/fabrication-civil.jpg';
import cableTrays from './assets/all images/cable-trays.jpg';
import gisAccess from './assets/all images/gis-access-platform.jpg';
import gisDetail from './assets/all images/gis-detail-575.webp';

export const FIELD_IMAGES = {
  electricalEpc, electricalEpcPreview, gisHall, outdoorSubstation,
  siteInstallation, transformer, switchgearPanels, team,
  siteTeam, controlPanels, testing, relayTestKit, solar, ev, fabrication,
};

export const FIELD_GALLERY = [
  [gisHall, 'Gas-insulated switchgear inside a substation hall'],
  [outdoorSubstation, 'Outdoor air-insulated substation'],
  [siteInstallation, 'Crane positioning a prefabricated E-House'],
  [transformer, 'Power transformer'],
  [switchgearPanels, 'Indoor switchgear panels and overhead cable trays'],
  [controlPanels, 'Electrical control and protection panels'],
  [testing, 'Technicians working on electrical protection panels'],
  [relayTestKit, 'OMICRON CMC 500 protection relay test set'],
  [gisAccess, 'Access platform beside gas-insulated switchgear'],
  [gisDetail, 'Gas-insulated switchgear close-up'],
  [cableTrays, 'Cable trays and power cables at an installation site'],
  [transformerErection, 'Site crew positioning a power transformer'],
  [siteLifting, 'Crane lifting a prefabricated electrical enclosure'],
  [siteTeam, 'Site engineering team at a safety briefing'],
  [engineeringTeam, 'Accumax Controls team group photo'],
  [teamGroup, 'Accumax Controls team members'],
  [team, 'Accumax Controls anniversary group photo'],
  [solar, 'Ground-mounted solar panels'],
  [ev, 'EV chargers under a solar canopy'],
] as const;
