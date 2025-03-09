import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contactus from './pages/Contactus';
import Dashboard from './pages/UserDashboard';
import UserSettings from './pages/Usersettings';
// import FAQ from './pages/FAQ';
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';
// import Help from './pages/Help';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-settings" element={<UserSettings />} />
        
        {/* <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
