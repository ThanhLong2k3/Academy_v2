const API_URL = '/api';

export const CallApi = {
  getAll: async <T>(nameApi: string): Promise<T[]> => {
    const res = await fetch(`${API_URL}/${nameApi}`);
    if (!res.ok)
      throw new Error(`Failed to fetch ${nameApi}, status: ${res.status}`);
    return res.json();
  },

  create: async <T>(nameApi: string, data: unknown): Promise<number> => {
    const res = await fetch(`${API_URL}/${nameApi}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok)
      throw new Error(`Failed to create in ${nameApi}, status: ${res.status}`);

    const result = await res.json();
    return result;
  },

  update: async <T>(nameApi: string, data: unknown): Promise<number> => {
    const res = await fetch(`${API_URL}/${nameApi}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok)
      throw new Error(`Failed to update in ${nameApi}, status: ${res.status}`);

    const result = await res.json();
    return result;
  },

  delete: async <T>(nameApi: string, id: number): Promise<number> => {
    const res = await fetch(`${API_URL}/${nameApi}?id=${id}`, {
      method: 'DELETE',
    });

    if (!res.ok)
      throw new Error(`Failed to delete in ${nameApi}, status: ${res.status}`);

    const result = await res.json();
    return result;
  },
};
