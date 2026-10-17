import React, { useState, useEffect } from 'react';
import type { ContactInquiry } from '../types/trade';
import { contactService } from '../services/contactService';

interface ContactSectionProps {
  onToast?: (message: string) => void;
}

const initialForm = {
  name: '',
  companyName: '',
  email: '',
  phone: '',
  inquiryType: 'general' as ContactInquiry['inquiryType'],
  estimatedMonthlyVolume: '5,000 - 25,000 units',
  message: ''
};

export const ContactSection: React.FC<ContactSectionProps> = ({ onToast }) => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<ContactInquiry | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<ContactInquiry[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    setRecentInquiries(contactService.getStoredInquiries());
  }, [submittedInquiry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.companyName) {
      onToast?.('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await contactService.submitInquiry(formData);
      setSubmittedInquiry(result);
      onToast?.(`Inquiry ${result.id} submitted!`);
    } catch (err) {
      console.error('Submission failed:', err);
      onToast?.('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedInquiry(null);
    setFormData(initialForm);
  };

  return (
    <section id="contact-section" className="contact-section">
      <div className="section-heading">
        <h2>Contact Us</h2>
        <p>
          Get in touch with our packaging team for custom printing, bulk quotes, or general inquiries.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          <div>
            <div className="info-header">
              <h3>PackTrade UK</h3>
              <p>Direct wholesale support &amp; custom printing sales.</p>
            </div>

            <div className="info-channels">
              <div className="channel-item">
                <div className="channel-icon">📞</div>
                <div>
                  <strong>Phone</strong>
                  <a href="tel:+442081234567" className="channel-link">+44 (0) 20 8123 4567</a>
                  <span className="channel-sub">Mon–Fri, 8am–6pm GMT</span>
                </div>
              </div>

              <div className="channel-item">
                <div className="channel-icon">✉️</div>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:trade@packtrade-bagasse.co.uk" className="channel-link">trade@packtrade-bagasse.co.uk</a>
                  <span className="channel-sub">Fast 2-hour response</span>
                </div>
              </div>

              <div className="channel-item">
                <div className="channel-icon">📍</div>
                <div>
                  <strong>Warehouse &amp; Hub</strong>
                  <span className="channel-text">Apex Trade Park, Birmingham, UK</span>
                </div>
              </div>
            </div>
          </div>

          {recentInquiries.length > 0 && (
            <div className="recent-log-bar">
              <span>📋 {recentInquiries.length} Saved Inquiry Log(s)</span>
              <button
                type="button"
                className="button-link-accent"
                onClick={() => setShowLogModal(true)}
              >
                View Log →
              </button>
            </div>
          )}
        </div>

        <div className="contact-form-card">
          {submittedInquiry ? (
            <div className="contact-success-state">
              <div className="success-icon-wrap">✓</div>
              <h3>Thank You!</h3>
              <p className="success-sub">
                Your inquiry reference is <span className="ref-badge">{submittedInquiry.id}</span>.
              </p>

              <div className="success-details-box">
                <div className="detail-row">
                  <span>Name:</span>
                  <strong>{submittedInquiry.name} ({submittedInquiry.companyName})</strong>
                </div>
                <div className="detail-row">
                  <span>Email:</span>
                  <strong>{submittedInquiry.email}</strong>
                </div>
                <div className="detail-row">
                  <span>Inquiry Type:</span>
                  <strong>{submittedInquiry.inquiryType.replace('_', ' ')}</strong>
                </div>
              </div>

              <p className="success-next-steps">
                We'll respond to your email within 2 business hours.
              </p>

              <div className="success-actions">
                <button type="button" className="button button-primary" onClick={handleReset}>
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="trade-contact-form">
              <h3>Send us a message</h3>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="contact-name">Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-company">Company *</label>
                  <input
                    id="contact-company"
                    type="text"
                    required
                    placeholder="Business / Company name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="contact-email">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="Enter business email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">Phone</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="contact-inquiry-type">Inquiry Type</label>
                  <select
                    id="contact-inquiry-type"
                    value={formData.inquiryType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inquiryType: e.target.value as ContactInquiry['inquiryType']
                      })
                    }
                  >
                    <option value="general">General Wholesale Inquiry</option>
                    <option value="distributor_account">Distributor &amp; Reseller Account</option>
                    <option value="custom_printing">Custom Logo &amp; Branding</option>
                    <option value="pallet_discount">Pallet &amp; Bulk Container Pricing</option>
                    <option value="sample_kit">Free Sample Pack Request</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-volume">Estimated Monthly Usage</label>
                  <select
                    id="contact-volume"
                    value={formData.estimatedMonthlyVolume}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedMonthlyVolume: e.target.value })
                    }
                  >
                    <option value="< 5,000 units">&lt; 5,000 units</option>
                    <option value="5,000 - 25,000 units">5,000 - 25,000 units</option>
                    <option value="25,000 - 100,000 units">25,000 - 100,000 units</option>
                    <option value="100,000+ units">100,000+ units</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  rows={3}
                  required
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="form-submit-row">
                <button
                  type="submit"
                  className="button button-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showLogModal && (
        <div className="modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="modal-card wide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submitted Inquiries Log</h3>
              <button
                type="button"
                className="close-button"
                onClick={() => setShowLogModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {recentInquiries.length === 0 ? (
                <p className="empty-log">No inquiries logged yet.</p>
              ) : (
                <div className="inquiry-table-wrapper">
                  <table className="inquiry-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Name / Company</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInquiries.map((inq) => (
                        <tr key={inq.id}>
                          <td><code>{inq.id}</code></td>
                          <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                          <td>
                            <strong>{inq.name}</strong>
                            <div className="table-sub">{inq.companyName} ({inq.email})</div>
                          </td>
                          <td><span className="inquiry-type-chip">{inq.inquiryType}</span></td>
                          <td><span className="status-badge-pending">{inq.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button button-danger-ghost"
                onClick={() => {
                  contactService.clearStoredInquiries();
                  setRecentInquiries([]);
                  onToast?.('Log cleared.');
                }}
                disabled={recentInquiries.length === 0}
              >
                Clear Log
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShowLogModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
