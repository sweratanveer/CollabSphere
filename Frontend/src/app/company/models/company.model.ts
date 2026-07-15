export interface Company {
  id?: string;
  companyName: string;
  companyCode: string;
  name?: string;
  industry?: string;
  description?: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  country: string;
  logo?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}