import type { Product } from '../data/products';

export type BusinessType = 'restaurant' | 'caterer' | 'takeaway' | 'dark_kitchen' | 'wholesaler' | 'other';

export interface CartItem {
  product: Product;
  cartons: number;
}

export interface TradeUser {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  vatNumber?: string;
  companyRegNumber?: string;
  businessType: BusinessType;
  discountTier: 'Standard Trade (5%)' | 'VIP Volume Trade (10%)';
  deliveryAddress: {
    street: string;
    city: string;
    postcode: string;
  };
  createdAt: string;
}

export interface TradeOrder {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: 'Delivered' | 'Processing' | 'Payment Pending';
  paymentMethod: 'BACS Bank Transfer' | 'Pay via Proforma Invoice' | 'Credit Account';
  shippingMethod: 'Pallet Delivery' | 'Parcel Next-Day' | 'Warehouse Collection';
  referenceCode: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  inquiryType: 'custom_printing' | 'pallet_discount' | 'sample_kit' | 'general';
  estimatedMonthlyVolume: string;
  message: string;
  createdAt: string;
  status: 'Pending' | 'Contacted';
}
