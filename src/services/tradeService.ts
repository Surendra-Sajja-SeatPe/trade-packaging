import type { TradeUser, TradeOrder, BusinessType } from '../types/trade';
import { PRODUCTS_DATA } from '../data/products';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY_USER = 'honeygreen_trade_user';
const STORAGE_KEY_ORDERS = 'honeygreen_trade_orders';

// Initial sample order history for instant demo delight
const INITIAL_DEMO_ORDERS: TradeOrder[] = [
  {
    id: 'TRD-8829',
    date: '2026-09-12',
    items: [
      {
        product: PRODUCTS_DATA[0],
        cartons: 5
      },
      {
        product: PRODUCTS_DATA[2],
        cartons: 2
      }
    ],
    subtotal: 184.00,
    vatAmount: 36.80,
    totalAmount: 220.80,
    status: 'Delivered',
    paymentMethod: 'BACS Bank Transfer',
    shippingMethod: 'Parcel Next-Day',
    referenceCode: 'QT-882901'
  }
];

const INITIAL_DEMO_USER: TradeUser = {
  id: 'usr_demo_101',
  companyName: 'Royal Spice Takeaway Ltd',
  contactName: 'Sanjay Kumar',
  email: 'trade@royalspice.co.uk',
  phone: '07700 900123',
  vatNumber: 'GB 384 9201 12',
  companyRegNumber: '12940291',
  businessType: 'takeaway',
  discountTier: 'Standard Trade (5%)',
  deliveryAddress: {
    street: '142 High Street, Unit 4',
    city: 'Birmingham',
    postcode: 'B1 2AA'
  },
  createdAt: '2026-08-15'
};

async function syncUserToSupabase(user: TradeUser) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('trade_users').insert([{
      id: user.id,
      company_name: user.companyName,
      contact_name: user.contactName,
      email: user.email,
      phone: user.phone,
      vat_number: user.vatNumber,
      business_type: user.businessType,
      street: user.deliveryAddress.street,
      city: user.deliveryAddress.city,
      postcode: user.deliveryAddress.postcode
    }]);
  } catch (e) {
    // silent fallback
  }
}

async function syncOrderToSupabase(order: TradeOrder) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('trade_orders').insert([{
      id: order.id,
      items: JSON.stringify(order.items),
      subtotal: order.subtotal,
      vat_amount: order.vatAmount,
      total_amount: order.totalAmount,
      status: order.status,
      payment_method: order.paymentMethod,
      shipping_method: order.shippingMethod,
      reference_code: order.referenceCode
    }]);
  } catch (e) {
    // silent fallback
  }
}

export const tradeService = {
  getActiveUser(): TradeUser | null {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(INITIAL_DEMO_USER));
      return INITIAL_DEMO_USER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  registerUser(details: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    vatNumber?: string;
    businessType: BusinessType;
    street: string;
    city: string;
    postcode: string;
  }): TradeUser {
    const newUser: TradeUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      companyName: details.companyName,
      contactName: details.contactName,
      email: details.email,
      phone: details.phone,
      vatNumber: details.vatNumber || undefined,
      businessType: details.businessType,
      discountTier: 'Standard Trade (5%)',
      deliveryAddress: {
        street: details.street,
        city: details.city,
        postcode: details.postcode
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    syncUserToSupabase(newUser);

    return newUser;
  },

  loginUser(email: string): TradeUser {
    const existing = this.getActiveUser();
    if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      return existing;
    }
    const user: TradeUser = {
      ...INITIAL_DEMO_USER,
      email,
      companyName: email.split('@')[0].toUpperCase() + ' Catering Trade'
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  getOrders(): TradeOrder[] {
    const data = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  },

  recordOrder(order: {
    items: any[];
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
    paymentMethod: 'BACS Bank Transfer' | 'Pay via Proforma Invoice' | 'Credit Account';
    shippingMethod: 'Pallet Delivery' | 'Parcel Next-Day' | 'Warehouse Collection';
    referenceCode: string;
  }): TradeOrder {
    const orders = this.getOrders();
    const newOrder: TradeOrder = {
      id: 'TRD-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      items: order.items,
      subtotal: order.subtotal,
      vatAmount: order.vatAmount,
      totalAmount: order.totalAmount,
      status: 'Processing',
      paymentMethod: order.paymentMethod,
      shippingMethod: order.shippingMethod,
      referenceCode: order.referenceCode
    };

    const updated = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
    syncOrderToSupabase(newOrder);

    return newOrder;
  }
};
