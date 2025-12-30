import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Parties from './pages/Parties';
import Ledgers from './pages/Ledgers';
import Items from './pages/Items';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import CreateInvoice from './pages/CreateInvoice';
import CreatePurchase from './pages/CreatePurchase';
import Transactions from './pages/Transactions';
import CreateTransaction from './pages/CreateTransaction';

import TrialBalance from './pages/TrialBalance';
import POS from './pages/POS';

// Sales Subsections
import Estimates from './pages/sales/Estimates';
import Proforma from './pages/sales/Proforma';
import PaymentIn from './pages/sales/PaymentIn';
import SaleOrder from './pages/sales/SaleOrder';
import DeliveryChallan from './pages/sales/DeliveryChallan';
import SaleReturn from './pages/sales/SaleReturn';

import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
           <Route index element={<Navigate to="/dashboard" replace />} />
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="parties" element={<Parties />} />
           <Route path="ledgers" element={<Ledgers />} />
           <Route path="items" element={<Items />} />
           <Route path="sales" element={<Sales />} />
           <Route path="sales/create" element={<CreateInvoice />} />
           <Route path="sales/estimates" element={<Estimates />} />
           <Route path="sales/proforma" element={<Proforma />} />
           <Route path="sales/payment-in" element={<PaymentIn />} />
           <Route path="sales/orders" element={<SaleOrder />} />
           <Route path="sales/delivery-challan" element={<DeliveryChallan />} />
           <Route path="sales/return" element={<SaleReturn />} />
           <Route path="pos" element={<POS />} />
           <Route path="purchases" element={<Purchases />} />
           <Route path="purchases/create" element={<CreatePurchase />} />
           <Route path="transactions" element={<Transactions />} />
           <Route path="payments/create" element={<CreateTransaction />} />
           <Route path="receipts/create" element={<CreateTransaction />} />
           <Route path="journal/create" element={<CreateTransaction />} />
           <Route path="reports" element={<TrialBalance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
