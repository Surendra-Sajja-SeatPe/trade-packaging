import type { ContactInquiry } from '../types/trade';

const STORAGE_KEY_INQUIRIES = 'honeygreen_contact_inquiries';

export const contactService = {
  async submitInquiry(data: {
    name: string;
    companyName: string;
    email: string;
    phone: string;
    inquiryType: ContactInquiry['inquiryType'];
    customPrintMethod?: ContactInquiry['customPrintMethod'];
    estimatedMonthlyVolume: string;
    message: string;
  }): Promise<ContactInquiry> {
    const inquiry: ContactInquiry = {
      id: 'INQ-' + Math.floor(1000 + Math.random() * 9000),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    // Save to local storage for instant browser demo / record persistence
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

    // Optional: If CRM / Webhook URL (e.g. Zoho, HubSpot, Web3Forms) is set in env
    const webhookUrl = import.meta.env.VITE_CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry)
        });
      } catch (err) {
        console.warn('Webhook POST failed:', err);
      }
    }

    return inquiry;
  },

  getStoredInquiries(): ContactInquiry[] {
    const existingRaw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (!existingRaw) return [];
    try {
      return JSON.parse(existingRaw);
    } catch {
      return [];
    }
  },

  clearStoredInquiries(): void {
    localStorage.removeItem(STORAGE_KEY_INQUIRIES);
  }
};
