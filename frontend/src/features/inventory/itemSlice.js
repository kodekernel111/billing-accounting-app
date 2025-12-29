import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchItems = createAsyncThunk('item/fetchAll', async (companyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/items?companyId=${companyId}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createItem = createAsyncThunk('item/create', async ({ itemData, companyId }, { rejectWithValue }) => {
  try {
     const response = await api.post(`/items?companyId=${companyId}`, itemData);
     return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const itemSlice = createSlice({
  name: 'item',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => { state.loading = true; })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default itemSlice.reducer;
