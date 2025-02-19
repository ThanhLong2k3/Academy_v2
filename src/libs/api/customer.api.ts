import { AddCustomer, GetCustomer } from '@/models/customer.model';
import { CallApi } from '@/libs/call_API';

export const CustomerAPI = {
  getCustomersByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    CustomerName?: string,
    PhoneNumber?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (CustomerName) {
      queryParams.append('customerName', CustomerName);
    }

    if (PhoneNumber) {
      queryParams.append('phoneNumber', PhoneNumber);
    }

    const data: GetCustomer[] = await CallApi.getAll<GetCustomer>(
      `customer?${queryParams.toString()}`,
    );

    return data;
  },

  createCustomer: async (newCustomer: AddCustomer) => {
    const data = await CallApi.create<number>('customer', newCustomer);
    return data;
  },

  updateCustomer: async (Customer: AddCustomer) => {
    const data = await CallApi.update<number>('customer', Customer);
    return data;
  },

  deleteCustomer: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('customer', Id);
    return data;
  },
};
