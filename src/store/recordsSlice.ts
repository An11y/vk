import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRecords, createRecord } from '../api';
import { Record, RecordFormData, PaginationParams } from '../types';

interface RecordsState {
  items: Record[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
}

const initialState: RecordsState = {
  items: [],
  status: 'idle',
  error: null,
  totalCount: 0,
  currentPage: 1,
  hasNextPage: false
};

export const fetchRecordsThunk = createAsyncThunk(
  'records/fetchRecords',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      return await fetchRecords(params);
    } catch (error) {
      return rejectWithValue('Не удалось загрузить записи');
    }
  }
);

export const addRecordThunk = createAsyncThunk(
  'records/addRecord',
  async (record: RecordFormData, { rejectWithValue }) => {
    try {
      return await createRecord(record);
    } catch (error) {
      return rejectWithValue('Не удалось добавить запись');
    }
  }
);

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    resetRecords: (state) => {
      state.items = [];
      state.status = 'idle';
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecordsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecordsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        if (state.currentPage === 1) {
          state.items = action.payload.data;
        } else {
          const ids = new Set(state.items.map(item => item.id));
          const newItems = action.payload.data.filter(item => !ids.has(item.id));
          state.items = [...state.items, ...newItems];
        }
        
        state.totalCount = action.payload.total;
        state.hasNextPage = state.items.length < state.totalCount;
        state.currentPage += 1;
      })
      .addCase(fetchRecordsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      .addCase(addRecordThunk.pending, () => {
      })
      .addCase(addRecordThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(addRecordThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});
export default recordsSlice.reducer;

export const selectAllRecords = (state: { records: RecordsState }) => state.records.items;
export const selectRecordsStatus = (state: { records: RecordsState }) => state.records.status;
export const selectHasNextPage = (state: { records: RecordsState }) => state.records.hasNextPage;
