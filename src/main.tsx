import { ButtonMotion } from './components/ButtonMotion';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import App from './App';
import { EnquiryPopup } from './components/EnquiryPopup';
import './style.css';
import './motion/homepage-motion.css';
import './responsive.css';
import './home-viewport.css';
import './components/section-headings.css';
import './review-updates.css';
import './section-spacing.css';
import './buttons.css';
import './about-content.css';
import './heading-colors.css';
import './mobile-updates.css';
import './hero-banner.css';
import './section-refinements.css';
import './cta-design.css';
const root = document.getElementById('root')!;
const prerendered = root.hasAttribute('data-prerendered');
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ButtonMotion />
        <EnquiryPopup><App prerendered={prerendered} /></EnquiryPopup>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

if (prerendered) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
