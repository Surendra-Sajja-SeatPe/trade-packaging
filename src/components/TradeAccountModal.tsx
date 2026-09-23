import React, { useState } from 'react';
import type { TradeUser, TradeOrder, BusinessType, CartItem } from '../types/trade';
import { tradeService } from '../services/tradeService';

interface TradeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TradeUser | null;
  onUserUpdate: (user: TradeUser | null) => void;
  onReorder: (items: CartItem[]) => void;
}

export const TradeAccountModal: React.FC<TradeAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onReorder
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Registration Form State
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('takeaway');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');

  if (!isOpen) return null;

  const orders: TradeOrder[] = tradeService.getOrders();

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !contactName) return;
    const user = tradeService.registerUser({
      companyName,
      contactName,
      email,
      phone,
      vatNumber,
      businessType,
      street: street || 'Commercial Warehouse Unit',
      city: city || 'London',
      postcode: postcode || 'EC1A 1BB'
    });
    onUserUpdate(user);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    const user = tradeService.loginUser(loginEmail);
    onUserUpdate(user);
  };

  const handleLogout = () => {
    tradeService.logout();
    onUserUpdate(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: 720, padding: 0, overflow: 'hidden' }}
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
              🏢
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                {currentUser ? 'Trade Account Dashboard' : 'Trade Account Portal'}
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                {currentUser ? `Logged in as ${currentUser.companyName}` : 'B2B Wholesale Trade Pricing & Order Management'}
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

        {/* Modal Content */}
        <div style={{ padding: 28, maxHeight: 'calc(85vh - 90px)', overflowY: 'auto' }}>
          {currentUser ? (
            /* Logged-In Dashboard View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Account Overview Header Card */}
              <div style={{
                background: '#fffbe6',
                border: '1.5px solid #fef08a',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                      {currentUser.companyName}
                    </h3>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: '#d1fae5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0'
                    }}>
                      ✓ Verified Trade Member
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#475569' }}>
                    Contact: <strong style={{ color: '#0f172a' }}>{currentUser.contactName}</strong> ({currentUser.email}) 
                    {currentUser.vatNumber && <span style={{ marginLeft: 8 }}>| VAT: <strong style={{ color: '#0f172a' }}>{currentUser.vatNumber}</strong></span>}
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#92400e', fontWeight: 700 }}>
                    🏷️ Tier Rate: <strong>5% Standard Bulk Trade Rate Applied</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="button button-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  Log Out
                </button>
              </div>

              {/* Order History Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>📦 Past Trade Orders</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#f1f5f9', color: '#475569', borderRadius: 12 }}>
                      {orders.length} orders
                    </span>
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Fast 1-Click Reorder available for all invoices</span>
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>No past orders found for this trade account.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: 14,
                          padding: 18,
                          background: '#ffffff',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid #f1f5f9',
                          paddingBottom: 12,
                          marginBottom: 12
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{order.id}</span>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 12,
                                background: order.status === 'Delivered' ? '#d1fae5' : '#dbeafe',
                                color: order.status === 'Delivered' ? '#065f46' : '#1e40af'
                              }}>
                                {order.status}
                              </span>
                            </div>
                            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                              Placed on {order.date} • Ref: {order.referenceCode}
                            </p>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                              £{order.totalAmount.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>inc. 20% VAT</span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                          {order.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: '#f8fafc',
                                padding: '8px 12px',
                                borderRadius: 8,
                                fontSize: '0.82rem'
                              }}
                            >
                              <span style={{ fontWeight: 700, color: '#0f172a' }}>
                                {item.cartons} ctn ({item.cartons * (item.product?.specs?.packSize || 500)} pcs) • {item.product?.name || 'Sugarcane Bagasse Container'}
                              </span>
                              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Code: {item.product?.specs?.modelCode || 'HG-PK'}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Downloading Proforma VAT Invoice PDF for Order ${order.id}...`);
                            }}
                            className="button button-secondary"
                            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                          >
                            📄 VAT Invoice (PDF)
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onReorder(order.items);
                              onClose();
                            }}
                            className="button button-primary"
                            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                          >
                            🔁 1-Click Re-Order All
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Login / Register Views */
            <div>
              {/* Tab Switcher */}
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: 4,
                borderRadius: 12,
                marginBottom: 24
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    borderRadius: 8,
                    border: 'none',
                    background: activeTab === 'login' ? '#ffffff' : 'transparent',
                    color: activeTab === 'login' ? '#0f172a' : '#64748b',
                    boxShadow: activeTab === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  🔐 Registered Trade Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    borderRadius: 8,
                    border: 'none',
                    background: activeTab === 'register' ? '#ffffff' : 'transparent',
                    color: activeTab === 'register' ? '#0f172a' : '#64748b',
                    boxShadow: activeTab === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  📝 Open New Trade Account
                </button>
              </div>

              {activeTab === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} style={{ maxWidth: 440, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ textAlign: 'center', marginBottom: 6 }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Sign in to your Trade Account</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>Access trade invoices, fast re-order cart, and custom quotes.</p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Trade Account Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. orders@restaurant.co.uk"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="button button-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginTop: 6 }}
                  >
                    Log In to Trade Dashboard →
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                    Tip: Enter any email to preview trade dashboard session.
                  </p>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: '#fffbe6', border: '1px solid #fef08a', padding: 12, borderRadius: 10, fontSize: '0.82rem', color: '#92400e' }}>
                    ✨ Registered trade buyers get <strong>instant access to volume discounts</strong>, automatic 30-day invoice tracking, and fast pallet delivery options.
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Company / Business Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Taste of India Catering Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Contact Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="orders@business.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="07700 900000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>VAT Reg Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. GB123456789"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>Business Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit', background: '#ffffff' }}
                      >
                        <option value="takeaway">Takeaway / Fast Food</option>
                        <option value="restaurant">Restaurant / Dine-In</option>
                        <option value="caterer">Event Caterer</option>
                        <option value="dark_kitchen">Dark Kitchen / Cloud Kitchen</option>
                        <option value="wholesaler">Packaging Wholesaler</option>
                        <option value="other">Other Commercial Business</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Address Details */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, marginTop: 4 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: 8 }}>Default Warehouse / Delivery Address</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <input
                        type="text"
                        placeholder="Street Address / Unit #"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        style={{ padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'inherit' }}
                      />
                      <input
                        type="text"
                        placeholder="City / Town"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'inherit' }}
                      />
                      <input
                        type="text"
                        placeholder="Postcode"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        style={{ padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="button button-primary"
                    style={{ width: '100%', padding: '14px', marginTop: 10 }}
                  >
                    🚀 Create Trade Account & Access Trade Portal
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
