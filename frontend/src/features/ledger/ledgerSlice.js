import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchLedgers = createAsyncThunk('ledger/fetchAll', async (companyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/ledgers?companyId=${companyId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createLedger = createAsyncThunk('ledger/create', async ({ ledgerData, companyId }, { rejectWithValue }) => {
  try {
     const response = await api.post(`/ledgers?companyId=${companyId}`, ledgerData);
     return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState: {
    ledgers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLedgers.pending, (state) => { state.loading = true; })
      .addCase(fetchLedgers.fulfilled, (state, action) => {
        state.loading = false;
        state.ledgers = action.payload;
      })
      .addCase(createLedger.fulfilled, (state, action) => {
        state.ledgers.push(action.payload);
      });
  },
});

export default ledgerSlice.reducer;
