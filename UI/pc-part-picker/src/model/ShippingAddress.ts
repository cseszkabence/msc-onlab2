// shipping-address.model.ts
export interface ShippingAddressDto {
  recipientName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string; // e.g., 'HU'
  phone?: string;
  currency: string; // 'eur' if you bill in EUR; 'usd' otherwise
}
