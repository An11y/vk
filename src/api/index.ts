import axios from 'axios';
import { Record, RecordFormData, PaginationParams } from '../types';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RecordsResponse {
  data: Record[];
  total: number;
}

export const fetchRecords = async (params: PaginationParams): Promise<RecordsResponse> => {
  const response = await api.get('/records', { params });
  const total = parseInt(response.headers['x-total-count'] || '0', 10);
  return { data: response.data, total };
};

export const createRecord = async (record: RecordFormData): Promise<Record> => {
  const response = await api.post('/records', record);
  return response.data;
};
