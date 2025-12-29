import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchTransactions = createAsyncThunk('transaction/fetchAll', async (companyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/transactions?companyId=${companyId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createTransaction = createAsyncThunk('transaction/create', async ({ transactionData, companyId }, { rejectWithValue }) => {
  try {
     const response = await api.post(`/transactions?companyId=${companyId}`, transactionData);
     return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      });
  },
});

export default transactionSlice.reducer;
