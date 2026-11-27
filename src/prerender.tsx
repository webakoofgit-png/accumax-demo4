import { renderToString } from 'react-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { EnquiryPopup } from './components/EnquiryPopup';

export { pageSeo, sitePaths } from './seo';

export function renderPage(path: string) {
  const context = {} as { helmet: HelmetServerState };
  const body = renderToString(
    <HelmetProvider context={context}>
      <StaticRouter location={path}>
        <EnquiryPopup><App prerendered /></EnquiryPopup>
      </StaticRouter>
    </HelmetProvider>,
  );
  const { title, meta, link, script } = context.helmet;
  return { body, head: [title, meta, link, script].map(tag => tag.toString()).join('\n') };
}
