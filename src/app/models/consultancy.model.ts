export interface Consultancy {
  id?: number;
  companyName: string;
  website: string;
  address: string;
  phoneNumber: string;
  careerJobsLink: string;
}

export type ConsultancySortField =
  | 'companyName'
  | 'website'
  | 'address'
  | 'phoneNumber'
  | 'careerJobsLink';

export type SortDirection = 'asc' | 'desc';
