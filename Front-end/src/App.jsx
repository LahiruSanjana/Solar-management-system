import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layout/Root.layout';
import HomePage from './page/home/Home.page';
import DashboardPage from './page/dashboard/dashboard.page';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
