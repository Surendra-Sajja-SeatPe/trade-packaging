import type { ContactInquiry } from '../types/trade';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY_INQUIRIES = 'honeygreen_contact_inquiries';

export const contactService = {
  async submitInquiry(data: {
    name: string;
    companyName: string;
    email: string;
    phone: string;
    inquiryType: 'custom_printing' | 'pallet_discount' | 'sample_kit' | 'general';
    estimatedMonthlyVolume: string;
    message: string;
  }): Promise<ContactInquiry> {
    const inquiry: ContactInquiry = {
      id: 'INQ-' + Math.floor(1000 + Math.random() * 9000),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    // Save to local storage for instant fallback demo
    const existingRaw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    let inquiries: ContactInquiry[] = [];
    if (existingRaw) {
      try {
        inquiries = JSON.parse(existingRaw);
      } catch {
        inquiries = [];
      }
    }
    inquiries.unshift(inquiry);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inquiries));

    // Save to Supabase database if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contact_inquiries').insert([{
          id: inquiry.id,
          name: inquiry.name,
          company_name: inquiry.companyName,
          email: inquiry.email,
          phone: inquiry.phone,
          inquiry_type: inquiry.inquiryType,
          estimated_monthly_volume: inquiry.estimatedMonthlyVolume,
          message: inquiry.message,
          status: inquiry.status
        }]);
      } catch (e) {
        console.warn('Supabase insert skipped or failed:', e);
      }
    }

    return inquiry;
  }
};
