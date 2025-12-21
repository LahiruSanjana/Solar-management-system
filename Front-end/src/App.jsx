import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RootLayout from './layout/Root.layout';
import HomePage from './page/home/Home.page';
import Store from '@/lib/redux/Store';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import MainLayout from './layout/main.layout';
import Dashboard from './layout/Dashboard.layout';
import DashboardPage from './page/dashboard/dashboard.page';
import { ClerkProvider } from '@clerk/clerk-react';
import SignInPage from './page/auth/Sign-in-page';
import SignUpPage from './page/auth/Sign-up-page';
import ProtectLayout from './layout/Protect.layout';
import AuthorizedLayout from './layout/authorized.layout';
import Admindashboard from './page/admin/Admindashboard.jsx';
import SolarUnitAdd from './page/admin/SolarUnitAdd';
import View from './page/admin/View';
import SettingsPage from './page/admin/SettingsPage';
import UserDetails from './page/admin/components/user/Userdetails';
import Editdetails from './page/admin/Editdetails';
import DashboardAnalytics from './page/dashboard/DashboardAnalytics';
import Anomaly from './page/dashboard/Anomaly';
import InvoicesPage from './page/invoices/invoices.page.jsx';
import PaymentPage from './page/invoices/payment.page.jsx';
import PaymentCompletePage from './page/invoices/complete.page';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

function App() {
  return (
    <StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route element={<SignInPage />} path="/sign-in" />
              <Route element={<SignUpPage />} path="/sign-up" />
              <Route element={<MainLayout />}>
                <Route element={<HomePage />} path="/" />
              </Route>
              <Route element={<ProtectLayout />}>
                <Route element={<Dashboard />} >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
                  <Route path="/dashboard/anomaly" element={<Anomaly />} />
                  <Route path="/dashboard/invoices" element={<InvoicesPage />} />
                  <Route path="/dashboard/invoices/:id/pay" element={<PaymentPage />} />
                  <Route path="/dashboard/invoices/complete" element={<PaymentCompletePage />} />
                </Route>
                <Route element={<AuthorizedLayout />}>
                  <Route path="/admin" element={<Admindashboard />} />
                  <Route path="/admin/solar-units" element={<SolarUnitAdd/>} />
                  <Route path="/admin/solar-units/view/:id" element={<View/>} />
                  <Route path="/admin/settings" element={<SettingsPage/>} />
                  <Route path="/admin/user" element={<UserDetails/>} />
                  <Route path="/admin/Editdetails/:id" element={<Editdetails/>} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </ClerkProvider>
      </BrowserRouter>
    </Provider>
    </StrictMode>
  );
}

export default App;
