import { PAGE_DESCRIPTIONS } from './company-content';
import { COMPANY, FEATURED_INDUSTRIES, PROJECTS, SERVICES } from './data';

const pageTitles: Record<string, string> = {
  '/': 'Electrical EPC & Substation Engineering in Pune',
  '/about': 'About Our Electrical Engineering Company',
  '/services': 'Electrical Engineering & EPC Services',
  '/industries': 'Electrical Engineering for Industrial Sectors',
  '/projects': 'Electrical Engineering Project Applications',
  '/featured-works': 'Featured Electrical Engineering Applications',
  '/quality-safety': 'Electrical Project Quality & Safety',
  '/gallery': 'Substation & Electrical Equipment Photo Gallery',
  '/videos': 'Electrical Engineering & Equipment Videos',
  '/catalogue': 'Electrical Equipment & Services Catalogue',
  '/careers': 'Electrical Engineering Careers in Pune',
  '/contact': 'Contact Our Electrical Engineering Team in Pune',
};

const serviceTitles: Record<string, string> = {
  'epc-projects': 'Electrical EPC & Turnkey Project Services',
  'panel-cleaning': 'Live Electrical Panel Cleaning Services',
  'scada-relay-testing': 'Substation SCADA & Protection Relay Testing',
  export: 'Electrical Equipment Supply & Export',
  'substation-testing-commissioning': 'Substation Testing & Commissioning Services',
  'fabrication-civil-work': 'Substation Fabrication & Civil Works',
  'gis-erection-supervision': 'GIS Switchgear Erection & Supervision',
  'solar-ev-station': 'Solar EPC & EV Charging Infrastructure',
  trading: 'Industrial Electrical Equipment Trading',
};

export const sitePaths = [
  ...Object.keys(pageTitles),
  ...SERVICES.map(({ slug }) => '/services/' + slug),
  ...FEATURED_INDUSTRIES.map(({ slug }) => '/industries/' + slug),
  ...PROJECTS.map(({ slug }) => '/projects/' + slug),
];

export function pageSeo(pathname: string, siteUrl?: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const service = SERVICES.find(({ slug }) => path === '/services/' + slug);
  const industry = FEATURED_INDUSTRIES.find(({ slug }) => path === '/industries/' + slug);
  const project = PROJECTS.find(({ slug }) => path === '/projects/' + slug);
  const pageTitle = pageTitles[path] || (service && (serviceTitles[service.slug] || service.title)) || (industry && 'Electrical Engineering for ' + industry.name) || project?.title;
  const title = (pageTitle || 'Page Not Found') + ' | ' + COMPANY.short;
  const description = service?.short || industry?.overview || (project && `Illustrative ${project.category} scope covering ${project.scope.join(', ')}.`) || PAGE_DESCRIPTIONS[path] || 'This page could not be found. Explore Accumax Controls’ electrical engineering and equipment services.';
  const indexable = Boolean(pageTitle && !project);
  const origin = siteUrl ? new URL(siteUrl).origin : undefined;
  const canonical = origin && indexable ? origin + path : undefined;
  const image = canonical ? new URL(service?.image || industry?.image || COMPANY.logo, canonical).href : undefined;
  const organizationId = origin && origin + '/#organization';
  const graph = [];

  if (canonical && path === '/') {
    graph.push({
      '@type': 'Organization',
      '@id': organizationId,
      name: COMPANY.name,
      url: canonical,
      logo: new URL(COMPANY.logo, canonical).href,
      email: COMPANY.emails[0],
      telephone: COMPANY.phones[0],
      sameAs: ['https://www.linkedin.com/company/accumaxcontrols/'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Offices 401–402, C-2, Saudamini Commercial Complex, Kothrud',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '411038',
        addressCountry: 'IN',
      },
    }, {
      '@type': 'WebSite',
      '@id': canonical + '#website',
      name: COMPANY.short,
      url: canonical,
      publisher: { '@id': organizationId },
    });
  }

  if (canonical && service) {
    graph.push({
      '@type': 'Service',
      '@id': canonical + '#service',
      name: service.title,
      description,
      url: canonical,
      provider: { '@id': organizationId, '@type': 'Organization', name: COMPANY.name },
    });
  }

  return {
    title, description, indexable, canonical, image,
    robots: canonical ? 'index,follow' : 'noindex,follow',
    schema: graph.length ? { '@context': 'https://schema.org', '@graph': graph } : undefined,
  };
}
