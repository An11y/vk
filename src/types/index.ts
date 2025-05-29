export interface Record {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  startDate?: string;
  status?: string;
  address: string;
  skills: string[];
  birthDate?: string;
  education?: string;
  languages?: string[];
  experience?: number;
}

export interface RecordFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number | undefined;
  startDate?: string;
  status?: string;
  address: string;
  skills: string[];
  birthDate?: string;
  education?: string;
  languages?: string[];
  experience?: number | undefined;
}

export interface PaginationParams {
  _page: number;
  _limit: number;
} 