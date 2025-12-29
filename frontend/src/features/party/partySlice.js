import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchParties = createAsyncThunk('party/fetchAll', async (companyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/parties?companyId=${companyId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createParty = createAsyncThunk('party/create', async ({ partyData, companyId }, { rejectWithValue }) => {
  try {
     const response = await api.post(`/parties?companyId=${companyId}`, partyData);
     return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const partySlice = createSlice({
  name: 'party',
  initialState: {
    parties: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParties.pending, (state) => { state.loading = true; })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.loading = false;
        state.parties = action.payload;
      })
      .addCase(createParty.fulfilled, (state, action) => {
        state.parties.push(action.payload);
      });
  },
});

export default partySlice.reducer;
