import { RouterProvider } from 'react-router';
import { router } from './routes';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { PropertiesProvider } from './contexts/PropertiesContext';
import { CasesProvider } from './contexts/CasesContext';
import { MasterDataProvider } from './contexts/MasterDataContext';

// VYBE Platform - Main App Entry Point
export default function App() {
  return (
    <ThemeProvider>
      <MasterDataProvider>
        <PropertiesProvider>
          <CasesProvider>
            <RouterProvider router={router} />
          </CasesProvider>
        </PropertiesProvider>
      </MasterDataProvider>
    </ThemeProvider>
  );
}