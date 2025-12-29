import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchBills = createAsyncThunk('purchase/fetchAll', async (companyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/purchases?companyId=${companyId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createBill = createAsyncThunk('purchase/create', async ({ billData, companyId }, { rejectWithValue }) => {
  try {
     const response = await api.post(`/purchases?companyId=${companyId}`, billData);
     return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState: {
    bills: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => { state.loading = true; })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
      });
  },
});

export default purchaseSlice.reducer;
