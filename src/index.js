import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrandingProvider } from './context/BrandingContext';
import { FooterProvider } from './context/FooterContext';
import { HomepageContentProvider } from './context/HomepageContentContext';
import { MaintenanceProvider } from './context/MaintenanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { HeroSectionProvider } from './context/HeroSectionContext';
import { ContentProvider } from './context/ContentContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrandingProvider>
      <FooterProvider>
        <HomepageContentProvider>
          <ContentProvider>
            <HeroSectionProvider>
              <MaintenanceProvider>
                <ThemeProvider>
                  <App />
                </ThemeProvider>
              </MaintenanceProvider>
            </HeroSectionProvider>
          </ContentProvider>
        </HomepageContentProvider>
      </FooterProvider>
    </BrandingProvider>
  </React.StrictMode>
);
