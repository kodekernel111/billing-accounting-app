import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchTrialBalance = createAsyncThunk('report/fetchTrialBalance', async (companyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/reports/trial-balance?companyId=${companyId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    trialBalance: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrialBalance.pending, (state) => { state.loading = true; })
      .addCase(fetchTrialBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.trialBalance = action.payload;
      });
  },
});

export default reportSlice.reducer;
