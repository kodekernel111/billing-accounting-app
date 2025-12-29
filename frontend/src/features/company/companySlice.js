import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchCompanies = createAsyncThunk('company/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/companies');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createCompany = createAsyncThunk('company/create', async (companyData, { rejectWithValue }) => {
  try {
    const response = await api.post('/companies', companyData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    activeCompany: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveCompany: (state, action) => {
        state.activeCompany = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
          state.companies.push(action.payload);
      });
  },
});

export const { setActiveCompany } = companySlice.actions;
export default companySlice.reducer;
