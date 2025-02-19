import {
  Get_Product,
  Update_Product,
  Add_Product,
} from '@/models/product.model';
import { CallApi } from '@/libs/call_API';

export const productAPI = {
  getproductsByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    productName?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (productName) {
      queryParams.append('productName', productName);
    }

    const data: Get_Product[] = await CallApi.getAll<Get_Product>(
      `product?${queryParams.toString()}`,
    );

    return data;
  },

  createproduct: async (newproduct: Add_Product) => {
    const data = await CallApi.create<number>('product', newproduct);
    return data;
  },

  updateproduct: async (product: Update_Product) => {
    const data = await CallApi.update<number>('product', product);
    return data;
  },

  deleteproduct: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('product', Id);
    return data;
  },
};
