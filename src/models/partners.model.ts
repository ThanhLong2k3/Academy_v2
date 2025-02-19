export interface Partner_DTO {
  Id: number;
  PartnerName: String;
  PhoneNumber: string;
  Email: string;
  Address: string;
  StartDate: string;
  EndDate: string | null;
  PartnershipStatus: string;
  TotalRecords: number;
}

export interface AddPartner_DTO {
  PartnerName: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  StartDate: string;
  EndDate: string;
  PartnershipStatus: string;
}
