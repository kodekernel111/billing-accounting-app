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
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
            state.items[index] = action.payload;
        }
      })
      .addCase(uploadItems.fulfilled, (state, action) => {
          // Assuming payload is array of items
          if(Array.isArray(action.payload)) {
            state.items.push(...action.payload);
          }
      });
  },
});

export const updateItem = createAsyncThunk('item/update', async ({ id, itemData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/items/${id}`, itemData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export const uploadItems = createAsyncThunk('item/upload', async ({ file, companyId }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/items/upload?companyId=${companyId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

export default itemSlice.reducer;
