import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import companyReducer from '../features/company/companySlice';
import ledgerReducer from '../features/ledger/ledgerSlice';
import partyReducer from '../features/party/partySlice';
import itemReducer from '../features/inventory/itemSlice';
import salesReducer from '../features/sales/salesSlice';
import purchaseReducer from '../features/purchase/purchaseSlice';
import transactionReducer from '../features/transaction/transactionSlice';
import reportReducer from '../features/report/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    ledger: ledgerReducer,
    party: partyReducer,
    item: itemReducer,
    sales: salesReducer,
    purchase: purchaseReducer,
    transaction: transactionReducer,
    report: reportReducer,
  },
});
