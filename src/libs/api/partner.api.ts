import { Partner_DTO, AddPartner_DTO } from '@/models/partners.model';
import { CallApi } from '@/libs/call_API';

export const PartnerAPI = {
  getPartnersByPageOrder: async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    PartnerName?: string,
    PhoneNumber?: string,
  ) => {
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      orderType,
    });

    if (PartnerName) {
      queryParams.append('partnerName', PartnerName);
    }

    if (PhoneNumber) {
      queryParams.append('phoneNumber', PhoneNumber);
    }

    const data: Partner_DTO[] = await CallApi.getAll<Partner_DTO>(
      `partner?${queryParams.toString()}`,
    );

    return data;
  },

  createPartner: async (newPartner: Partner_DTO) => {
    const data = await CallApi.create<number>('partner', newPartner);
    return data;
  },

  updatePartner: async (Partner: AddPartner_DTO) => {
    const data = await CallApi.update<number>('partner', Partner);
    return data;
  },

  deletePartner: async (Id: number): Promise<number> => {
    const data = await CallApi.delete<number>('partner', Id);
    return data;
  },
};
