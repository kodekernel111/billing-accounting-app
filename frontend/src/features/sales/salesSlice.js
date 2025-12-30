import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchInvoices = createAsyncThunk('sales/fetchAll', async (companyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/invoices?companyId=${companyId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message || 'Server Error');
  }
});

export const createInvoice = createAsyncThunk('sales/create', async ({ invoiceData, companyId }, { rejectWithValue }) => {
  try {
     const response = await api.post(`/invoices?companyId=${companyId}`, invoiceData);
     return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message || 'Server Error');
  }
});

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    invoices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.loading = true; })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload);
      });
  },
});

export default salesSlice.reducer;
