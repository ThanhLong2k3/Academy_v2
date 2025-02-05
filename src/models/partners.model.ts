export interface Partner_DTO{
        Id: number,
        PartnerName: String,
        PhoneNumber: string,
        Email: string,
        Address: string,
        StartDate:Date,
        EndDate: Date | null,
        PartnershipStatus: string,
}


export interface AddPartner_DTO{
    PartnerName: String,
    PhoneNumber: string,
    Email: string,
    Address: string,
    StartDate:Date,
    EndDate: Date | null,
    PartnershipStatus: string,
}