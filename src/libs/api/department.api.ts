import { GetDepartment,AddDepartment } from '@/models/department.model';
const API_URL = '/api';

export const DepartmentAPI = {
  getAll: async (): Promise<GetDepartment[]> => {
    const res = await fetch(`${API_URL}/department`);
    return res.json();
  },

  create: async (data: AddDepartment): Promise<number> => {
    const res = await fetch(`${API_URL}/department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async ( data: GetDepartment): Promise<number> => {
    const res = await fetch(`${API_URL}/department`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/department?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
