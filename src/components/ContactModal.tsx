import React, { useState } from 'react';
import { contactService } from '../services/contactService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInquiryType?: 'custom_printing' | 'pallet_discount' | 'sample_kit' | 'general';
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultInquiryType = 'custom_printing'
}) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState(defaultInquiryType);
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState('5,000 - 15,000 units/mo');
  const [message, setMessage] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !companyName) return;

    contactService.submitInquiry({
      name,
      companyName,
      email,
      phone,
      inquiryType,
      estimatedMonthlyVolume,
      message
    }).then((inquiry) => {
      setSubmittedRef(inquiry.id);
    });
  };

  const handleReset = () => {
    setSubmittedRef(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: 640, padding: 0, overflow: 'hidden' }}
      >
        
        {/* Modal Header */}
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ea580c, #f97316)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.4)'
            }}>
              💬
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                Bespoke Printing & Wholesale Support
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Custom logo embossing, container loads & dedicated trade support
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="modal-close"
            style={{ position: 'static', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 28, maxHeight: 'calc(85vh - 90px)', overflowY: 'auto' }}>
          {submittedRef ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                width: 64,
                height: 64,
                background: '#d1fae5',
                color: '#059669',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: '2rem',
                margin: '0 auto',
                border: '4px solid #ecfdf5'
              }}>
                ✓
              </div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Inquiry Received!</h3>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569' }}>
                Thank you <strong>{name}</strong>. Your inquiry reference code is{' '}
                <span style={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  color: '#ea580c',
                  background: '#fffbe6',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: '1px solid #fef08a'
                }}>
                  {submittedRef}
                </span>.
              </p>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: 16,
                fontSize: '0.82rem',
                color: '#475569',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                maxWidth: 440,
                margin: '0 auto'
              }}>
                <div>• <strong>Response Time SLA:</strong> Within 2 business hours</div>
                <div>• <strong>Dedicated Account Manager:</strong> Assigned immediately</div>
                <div>• <strong>Direct Phone Support:</strong> 020 8123 4567 (Mon-Fri 8am-6pm)</div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="button button-primary"
                style={{ padding: '12px 28px', margin: '8px auto 0' }}
              >
                Back to Site
              </button>
            </div>
          ) : (
            /* Inquiry Form */
            <form 
              onSubmit={handleSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              data-netlify="true"
              name="contact-inquiry"
            >
              <input type="hidden" name="form-name" value="contact-inquiry" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Company / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GreenBites Catering"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@greenbites.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="07700 900123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Inquiry Type</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit', background: '#ffffff' }}
                  >
                    <option value="custom_printing">🎨 Custom Logo Embossing / Printing</option>
                    <option value="pallet_discount">🚛 Full Container-Load / Pallet Pricing</option>
                    <option value="sample_kit">📦 Customized Bespoke Sample Kit</option>
                    <option value="general">❓ General Wholesale Support Query</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Estimated Monthly Volume</label>
                  <select
                    value={estimatedMonthlyVolume}
                    onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit', background: '#ffffff' }}
                  >
                    <option value="< 2,000 units/mo">Under 2,000 units / month</option>
                    <option value="2,000 - 10,000 units/mo">2,000 – 10,000 units / month</option>
                    <option value="10,000 - 50,000 units/mo">10,000 – 50,000 units / month</option>
                    <option value="50,000+ units/mo">50,000+ units / month (Pallet Loads)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Message / Specifications</label>
                <textarea
                  rows={3}
                  placeholder="Describe your packaging requirements, custom logo details, or timeline..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ background: '#fffbe6', border: '1px solid #fef08a', padding: 12, borderRadius: 10, fontSize: '0.82rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚡</span>
                <span>Our wholesale printing specialists respond with digital proofs & container pricing within 2 business hours.</span>
              </div>

              <button
                type="submit"
                className="button button-primary"
                style={{ width: '100%', padding: '14px', marginTop: 4 }}
              >
                Send Inquiry to Wholesale Team →
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
