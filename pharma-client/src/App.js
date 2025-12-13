import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import ClientHomeUltra from './pages/ClientHomeUltra';
import LiveTracking from './pages/LiveTracking';
import LiveTrackingPro from './pages/LiveTrackingPro';
import UploadPrescription from './pages/UploadPrescription';
import ScanOrdonnance from './pages/ScanOrdonnance';
import EmergencyMode from './pages/EmergencyMode';
import NotificationSettings from './pages/NotificationSettings';
import OrderHistory from './pages/OrderHistory';
import MedicationReminders from './pages/MedicationReminders';
import FavoritePharmacies from './pages/FavoritePharmacies';
import SavedAddresses from './pages/SavedAddresses';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Assistance from './pages/Assistance';
import './App.css';

// Composant interne pour gérer les routes
function AppContent() {
  return (
    <Routes>
      <Route path="/" element={localStorage.getItem('onboardingSeen') === 'true' ? <Login /> : <Onboarding />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<ClientHomeUltra />} />
      <Route path="/live-tracking" element={<LiveTracking />} />
      <Route path="/live-tracking-pro" element={<LiveTrackingPro />} />
      <Route path="/scan-ordonnance" element={<ScanOrdonnance />} />
      <Route path="/emergency" element={<EmergencyMode />} />
      <Route path="/notifications" element={<NotificationSettings />} />
      <Route path="/upload-prescription" element={<UploadPrescription />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/reminders" element={<MedicationReminders />} />
      <Route path="/favorites" element={<FavoritePharmacies />} />
      <Route path="/addresses" element={<SavedAddresses />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/assistance" element={<Assistance />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// APP CLIENT - Onboarding au premier lancement
function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
