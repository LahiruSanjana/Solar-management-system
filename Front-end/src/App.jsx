import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layout/Root.layout';
import HomePage from './page/home/Home.page';
import DashboardPage from './page/dashboard/dashboard.page';
import Store from '@/lib/redux/Store';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';

function App() {
  return (
    <StrictMode>
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
    </StrictMode>
  );
}

export default App;
