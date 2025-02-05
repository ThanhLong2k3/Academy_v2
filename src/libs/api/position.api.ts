import { GetPosition, AddPoistion } from '../../models/position.model';

const API_URL = '/api';

export const PositionAPI = {
  getAll: async (): Promise<GetPosition[]> => {
    const res = await fetch(`${API_URL}/position`);
    return res.json();
  },

  create: async (data: AddPoistion): Promise<number> => {
    const res = await fetch(`${API_URL}/position`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async ( data: GetPosition): Promise<number> => {
    const res = await fetch(`${API_URL}/position`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/position?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
