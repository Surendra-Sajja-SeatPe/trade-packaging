import { useState, useMemo } from 'react'
import './App.css'
import { PRODUCTS_DATA, CERTIFICATIONS, FAQS, type Product } from './data/products'
import { ContactModal } from './components/ContactModal'

interface CartItem {
  product: Product;
  cartons: number;
}

const CATEGORIES = ['All', 'Clamshells', 'Burger', 'Bio Boxes', 'Compartment', 'Custom'] as const;

function App() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quoteCart, setQuoteCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeSpecProduct, setActiveSpecProduct] = useState<Product | null>(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isOrderCheckoutModalOpen, setIsOrderCheckoutModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Mobile Navigation Drawer & Contact Modal States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [contactDefaultType, setContactDefaultType] = useState<'custom_printing' | 'pallet_discount' | 'sample_kit' | 'general'>('custom_printing');

  // Eco Calculator State
  const [monthlyUsage, setMonthlyUsage] = useState<number>(15000);

  // Custom Branding Visualizer State
  const [brandingType, setBrandingType] = useState<string>('Burger Box');
  const [brandingText, setBrandingText] = useState<string>('URBAN BITES');
  const [brandingColor, setBrandingColor] = useState<string>('#059669');

  // Sample Request Form State
  const [sampleForm, setSampleForm] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    selectedProducts: [] as string[],
    notes: ''
  });
  const [sampleSubmitted, setSampleSubmitted] = useState<boolean>(false);
  const [sampleStep, setSampleStep] = useState<1 | 2>(1);

  // Quick Quote Lead Modal State
  const [isQuoteLeadModalOpen, setIsQuoteLeadModalOpen] = useState<boolean>(false);
  const [quoteLeadForm, setQuoteLeadForm] = useState({
    companyName: '',
    contactInfo: ''
  });

  // Step 2 Order & Invoice Request State
  const [orderForm, setOrderForm] = useState({
    fulfillmentMethod: 'delivery', // 'delivery' | 'collection'
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    deliveryNotes: ''
  });
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper for tiered price per unit calculation
  const getUnitPrice = (product: Product, cartons: number) => {
    let price = product.basePrice;
    for (const tier of product.priceTiers) {
      if (cartons >= tier.minCartons) {
        price = tier.pricePerUnit;
      }
    }
    return price;
  };

  // Cart Helper functions
  const handleAddToCart = (product: Product, quantityCartons = 1) => {
    setQuoteCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, cartons: item.cartons + quantityCartons }
            : item
        );
      }
      return [...prev, { product, cartons: quantityCartons }];
    });
    showToast(`Added ${quantityCartons} carton(s) of ${product.name} to quote cart`);
  };

  const handleUpdateCartons = (productId: string, delta: number) => {
    setQuoteCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newCartons = item.cartons + delta;
            return newCartons > 0 ? { ...item, cartons: newCartons } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setQuoteCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Computed Cart Metrics
  const cartSummary = useMemo(() => {
    let totalCartons = 0;
    let totalUnits = 0;
    let totalPrice = 0;
    let totalStandardPrice = 0;
    let totalWeightKg = 0;

    quoteCart.forEach(({ product, cartons }) => {
      totalCartons += cartons;
      const units = cartons * product.specs.packSize;
      totalUnits += units;
      const unitPrice = getUnitPrice(product, cartons);
      totalPrice += units * unitPrice;
      totalStandardPrice += units * product.basePrice;
      totalWeightKg += cartons * product.specs.cartonWeightKg;
    });

    const savings = totalStandardPrice - totalPrice;
    return { totalCartons, totalUnits, totalPrice, savings, totalWeightKg };
  }, [quoteCart]);

  // Filtered Products Catalog
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.modelCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Eco Impact Calculations
  const ecoMetrics = useMemo(() => {
    const plasticKg = Math.round(monthlyUsage * 0.028);
    const co2Kg = Math.round(monthlyUsage * 0.045);
    const sugarcaneKg = Math.round(monthlyUsage * 0.022);
    return { plasticKg, co2Kg, sugarcaneKg };
  }, [monthlyUsage]);

  // 1-Click Instant Price Quote Generator (NO Bank Details - For Lead Capture & Price Comparison)
  const handleDownloadQuickQuotePDF = (companyName: string, contactInfo: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const estimateRef = `EST-${Math.floor(100000 + Math.random() * 900000)}`;

    const itemsHtml = quoteCart.map(({ product, cartons }) => {
      const unitPrice = getUnitPrice(product, cartons);
      const lineTotal = cartons * product.specs.packSize * unitPrice;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${product.specs.modelCode}</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${cartons} ctn (${cartons * product.specs.packSize} pcs)</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">£${unitPrice.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">£${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PackTrade Price Quote Proposal - ${estimateRef}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: bold; }
          .meta { text-align: right; font-size: 14px; color: #64748b; }
          .customer-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; }
          .totals { margin-left: auto; width: 320px; font-size: 14px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .grand-total { border-top: 2px solid #0f172a; font-weight: bold; font-size: 18px; padding-top: 10px; margin-top: 6px; }
          .footer-notes { margin-top: 40px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #475569; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">PackTrade Packaging Ltd</div>
            <div style="font-size: 13px; color: #64748b;">Direct Sugarcane Bagasse Wholesale Supplier</div>
            <div style="font-size: 12px; color: #059669; font-weight: bold; margin-top: 4px;">✔ BRCGS Grade A • BPI • OK Compost HOME • PFAS-Free</div>
          </div>
          <div class="meta">
            <div><strong>WHOLESALE PRICE ESTIMATE</strong></div>
            <div>Ref: <strong>${estimateRef}</strong></div>
            <div>Date: ${dateStr}</div>
            <div>Valid: 30 Days</div>
          </div>
        </div>

        <div class="customer-card">
          <strong style="font-size: 14px; color: #0f172a;">PREPARED FOR:</strong><br/>
          • <strong>Business Name:</strong> ${companyName}<br/>
          • <strong>Contact Info:</strong> ${contactInfo}
        </div>

        <table>
          <thead>
            <tr>
              <th>Model Code</th>
              <th>Product Description</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total (ex. VAT)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Total Cartons:</span>
            <strong>${cartSummary.totalCartons} ctn</strong>
          </div>
          <div class="totals-row">
            <span>Container Count:</span>
            <strong>${cartSummary.totalUnits.toLocaleString()} units</strong>
          </div>
          <div class="totals-row">
            <span>Estimated Shipment Weight:</span>
            <strong>${cartSummary.totalWeightKg.toFixed(1)} kg</strong>
          </div>
          ${cartSummary.savings > 0 ? `
          <div class="totals-row" style="color: #059669; font-weight: bold;">
            <span>Volume Tier Savings:</span>
            <span>-£${cartSummary.savings.toFixed(2)}</span>
          </div>` : ''}
          <div class="totals-row grand-total">
            <span>Total Amount (ex. VAT):</span>
            <span>£${cartSummary.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div style="margin: 20px 0; padding: 16px; background: #ecfdf5; border: 2px solid #059669; border-radius: 8px;">
          <div style="font-size: 14px; font-weight: bold; color: #047857; margin-bottom: 6px;">
            📦 Ready to Order & Issue Proforma Invoice?
          </div>
          <div style="font-size: 12px; color: #064e3b; line-height: 1.5;">
            This document is a formal wholesale price quote. To place an order, specify your delivery address or warehouse pickup, and receive an official <strong>Proforma Invoice with BACS bank transfer details</strong> for 24h dispatch, visit <strong>packtrade.co.uk</strong> or call our trade desk at <strong>020 8123 4567</strong>.
          </div>
        </div>

        <div class="footer-notes">
          <strong>Terms & Dispatch Notes:</strong><br/>
          - 24-Hour UK Stock Dispatch upon order payment confirmation.<br/>
          - All products manufactured in BRCGS Grade A, BPI, OK Compost (EN13432), and FDA Food Contact certified facilities.<br/>
          - Prices exclude VAT and standard UK pallet delivery fees.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Official Proforma Invoice PDF Generator (WITH BACS Bank Details & Delivery/Collection Address)
  const handleDownloadProformaInvoicePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const quoteRef = `QT-${Math.floor(100000 + Math.random() * 900000)}`;

    const itemsHtml = quoteCart.map(({ product, cartons }) => {
      const unitPrice = getUnitPrice(product, cartons);
      const lineTotal = cartons * product.specs.packSize * unitPrice;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${product.specs.modelCode}</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${cartons} ctn (${cartons * product.specs.packSize} pcs)</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">£${unitPrice.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">£${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const fulfillmentText = orderForm.fulfillmentMethod === 'collection'
      ? '🏬 Warehouse Collection (Free Pickup)'
      : `🚚 Delivery to: ${orderForm.address}, ${orderForm.city}, ${orderForm.postcode}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PackTrade Proforma Invoice - ${quoteRef}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: bold; }
          .meta { text-align: right; font-size: 14px; color: #64748b; }
          .customer-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; }
          .totals { margin-left: auto; width: 320px; font-size: 14px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .grand-total { border-top: 2px solid #0f172a; font-weight: bold; font-size: 18px; padding-top: 10px; margin-top: 6px; }
          .footer-notes { margin-top: 40px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #475569; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">PackTrade Packaging Ltd</div>
            <div style="font-size: 13px; color: #64748b;">Direct Sugarcane Bagasse Wholesale Supplier</div>
            <div style="font-size: 12px; color: #059669; font-weight: bold; margin-top: 4px;">✔ BRCGS Grade A • BPI • OK Compost HOME • PFAS-Free</div>
          </div>
          <div class="meta">
            <div><strong>PROFORMA INVOICE</strong></div>
            <div>Ref: <strong>${quoteRef}</strong></div>
            <div>Date: ${dateStr}</div>
            <div>Valid: 30 Days</div>
          </div>
        </div>

        <div class="customer-card">
          <strong style="font-size: 14px; color: #0f172a;">ISSUED TO:</strong><br/>
          • <strong>Business Name:</strong> ${orderForm.companyName}<br/>
          • <strong>Contact:</strong> ${orderForm.contactName} (${orderForm.phone} / ${orderForm.email})<br/>
          • <strong>Fulfillment:</strong> ${fulfillmentText}
          ${orderForm.deliveryNotes ? `<br/>• <strong>Driver Notes:</strong> ${orderForm.deliveryNotes}` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Model Code</th>
              <th>Product Description</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total (ex. VAT)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Total Cartons:</span>
            <strong>${cartSummary.totalCartons} ctn</strong>
          </div>
          <div class="totals-row">
            <span>Container Count:</span>
            <strong>${cartSummary.totalUnits.toLocaleString()} units</strong>
          </div>
          <div class="totals-row">
            <span>Estimated Shipment Weight:</span>
            <strong>${cartSummary.totalWeightKg.toFixed(1)} kg</strong>
          </div>
          ${cartSummary.savings > 0 ? `
          <div class="totals-row" style="color: #059669; font-weight: bold;">
            <span>Volume Tier Savings:</span>
            <span>-£${cartSummary.savings.toFixed(2)}</span>
          </div>` : ''}
          <div class="totals-row grand-total">
            <span>Total Amount (ex. VAT):</span>
            <span>£${cartSummary.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div style="margin: 20px 0; padding: 16px; background: #fffbe6; border: 2px solid #d97706; border-radius: 8px;">
          <div style="font-size: 14px; font-weight: bold; color: #b45309; margin-bottom: 6px;">
            ⚠️ MANDATORY BACS PAYMENT REFERENCE: <span style="background: #fef08a; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 16px;">${quoteRef}</span>
          </div>
          <div style="font-size: 12px; color: #78350f; line-height: 1.5;">
            When completing your bank transfer, you <strong>MUST enter ${quoteRef}</strong> in your bank app's payment reference field. This ensures your payment is automatically matched to your order for immediate 24h UK dispatch.
          </div>
          <div style="margin-top: 12px; font-size: 13px; color: #0f172a; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            <strong>Bank Account Payment Details:</strong><br/>
            • <strong>Account Name:</strong> PackTrade Packaging Ltd<br/>
            • <strong>Bank Name:</strong> Barclays Business UK<br/>
            • <strong>Sort Code:</strong> 20-00-00<br/>
            • <strong>Account Number:</strong> 83920182<br/>
            • <strong>Payment Reference:</strong> <code>${quoteRef}</code>
          </div>
        </div>

        <div class="footer-notes">
          <strong>Terms & Dispatch Notes:</strong><br/>
          - 24-Hour UK Stock Dispatch upon order payment confirmation.<br/>
          - All products manufactured in BRCGS Grade A, BPI, OK Compost (EN13432), and FDA Food Contact certified facilities.<br/>
          - Prices exclude VAT and standard UK pallet delivery fees.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const toggleSampleProduct = (modelCode: string) => {
    setSampleForm((prev) => {
      const exists = prev.selectedProducts.includes(modelCode);
      return {
        ...prev,
        selectedProducts: exists
          ? prev.selectedProducts.filter((code) => code !== modelCode)
          : [...prev.selectedProducts, modelCode]
      };
    });
  };



  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSampleSubmitted(true);
    setTimeout(() => {
      setSampleSubmitted(false);
      setIsSampleModalOpen(false);
      setSampleStep(1);
      showToast('Sample Kit request submitted! Express sample pack dispatched.');
    }, 2000);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setIsOrderCheckoutModalOpen(false);
      handleDownloadProformaInvoicePDF();
      setQuoteCart([]);
      setIsDrawerOpen(false);
      showToast(`Wholesale order & proforma invoice issued for ${orderForm.companyName}!`);
    }, 1500);
  };

  return (
    <div className="page-shell">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <header className="topbar">
        <a href="#" className="brand-wrap">
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name">PackTrade</div>
            <div className="brand-tag">Sugarcane Bagasse Wholesale</div>
          </div>
        </a>

        {/* Desktop Main Nav */}
        <nav className="main-nav desktop-only" aria-label="Main Navigation">
          <a href="#catalog">Products</a>
          <a href="#eco-calculator">Eco ROI</a>
          <a href="#branding">Custom Print</a>
          <a href="#certifications">Standards</a>
          <a 
            href="#contact-section"
            onClick={(e) => {
              e.preventDefault();
              setContactDefaultType('general');
              setIsContactModalOpen(true);
            }}
          >
            Contact Us
          </a>
          <a href="#faq">FAQ</a>
        </nav>

        {/* Header Actions */}
        <div className="nav-actions">
          <button
            type="button"
            className="button button-ghost small-button desktop-only"
            onClick={() => setIsSampleModalOpen(true)}
          >
            Request Samples
          </button>

          <button
            type="button"
            className="button button-primary cart-button small-button"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span>Quote Cart</span>
            {cartSummary.totalCartons > 0 && (
              <span className="cart-badge">{cartSummary.totalCartons}</span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="hamburger-toggle mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay animate-fade-in">
            <div className="mobile-menu-content">
              {/* Navigation Links */}
              <div className="mobile-nav-links">
                <a href="#catalog" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>📦 Products Catalog</span>
                  <span>→</span>
                </a>
                <a href="#eco-calculator" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>🌱 Eco ROI Calculator</span>
                  <span>→</span>
                </a>
                <a href="#branding" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>🎨 Custom Print & Embossing</span>
                  <span>→</span>
                </a>
                <a href="#certifications" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>🏆 Quality Standards</span>
                  <span>→</span>
                </a>
                <a 
                  href="#contact-section" 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    setContactDefaultType('general');
                    setIsContactModalOpen(true);
                  }}
                >
                  <span>💬 Contact Wholesale Desk</span>
                  <span>→</span>
                </a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>❓ Frequently Asked Questions</span>
                  <span>→</span>
                </a>
              </div>

              {/* Action CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="button button-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSampleModalOpen(true);
                  }}
                >
                  🎁 Request Free Sample Kit
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">
              🌱 Certified Home Compostable • B2B Wholesale Packaging
            </span>
            <h1>
              Heavy-Duty <span className="highlight-text">Sugarcane Bagasse</span> Takeaway Packaging
            </h1>
            <p>
              100% compostable, microwave-safe clamshells, ramen bowls, and compartment meal boxes built for fast-paced food businesses, cloud kitchens, and takeaway brands.
            </p>

            <div className="hero-actions">
              <a href="#catalog" className="button button-primary">
                Browse Bagasse Range
              </a>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setIsSampleModalOpen(true)}
              >
                Request Free Sample Kit
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-box">
                <strong>24 Hours</strong>
                <span>UK Stock Dispatch</span>
              </div>
              <div className="stat-box">
                <strong>Up to 25%</strong>
                <span>Volume Tier Discount</span>
              </div>
              <div className="stat-box">
                <strong>PFAS-Free</strong>
                <span>Fluorine Free 2026</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Bagasse packaging showcase">
            <div className="visual-image" />
            <div className="floating-badge badge-top">
              <div className="badge-icon">🌿</div>
              <div className="badge-text">
                <span>100% Plant Fiber</span>
                <strong>Home Compostable</strong>
              </div>
            </div>
            <div className="floating-badge badge-bottom">
              <div className="badge-icon">⚡</div>
              <div className="badge-text">
                <span>Thermal Limit</span>
                <strong>-20°C to +120°C</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Segment Strip */}
        <section className="mini-strip" aria-label="Customer segments served">
          <div className="segment-item">
            <span className="segment-dot" />
            <span>Takeaway Restaurants</span>
          </div>
          <div className="segment-item">
            <span className="segment-dot" />
            <span>Cloud & Dark Kitchens</span>
          </div>
          <div className="segment-item">
            <span className="segment-dot" />
            <span>Cafés & Deli Chains</span>
          </div>
          <div className="segment-item">
            <span className="segment-dot" />
            <span>Catering & Food Courts</span>
          </div>
          <div className="segment-item">
            <span className="segment-dot" />
            <span>Wholesale Distributors</span>
          </div>
        </section>

        {/* Interactive Eco Impact Calculator */}
        <section id="eco-calculator" className="eco-calculator-section">
          <div className="calc-header">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.1)', color: '#6ee7b7' }}>
              Sustainability Calculator
            </span>
            <h2>Calculate Your Restaurant’s Eco Impact</h2>
            <p>
              Switching from single-use plastic or Styrofoam to sugarcane bagasse turns agricultural byproduct waste into circular food packaging.
            </p>
          </div>

          <div className="calc-grid">
            <div className="calc-slider-card">
              <div className="slider-label-row">
                <label htmlFor="usage-range">Monthly Takeaway Orders</label>
                <span className="slider-value">{monthlyUsage.toLocaleString()} meals/mo</span>
              </div>
              <input
                id="usage-range"
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monthlyUsage}
                onChange={(e) => setMonthlyUsage(Number(e.target.value))}
                className="range-slider"
              />
              <div className="slider-ticks">
                <span>1k</span>
                <span>25k</span>
                <span>50k</span>
                <span>75k</span>
                <span>100k+</span>
              </div>
            </div>

            <div className="calc-metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{ecoMetrics.plasticKg.toLocaleString()} kg</div>
                <div className="metric-label">Plastic Pollution Prevented</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{ecoMetrics.co2Kg.toLocaleString()} kg</div>
                <div className="metric-label">CO₂ Carbon Emissions Offset</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{ecoMetrics.sugarcaneKg.toLocaleString()} kg</div>
                <div className="metric-label">Sugarcane Waste Repurposed</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">90 Days</div>
                <div className="metric-label">Full Home Compost Timeline</div>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className="catalog-section">
          <div className="section-heading">
            <span className="eyebrow">Wholesale Product Catalog</span>
            <h2>Stock Sugarcane Bagasse Range</h2>
            <p>Select items below to inspect technical specs or build your bulk quote with automatic volume tier discounts.</p>
          </div>

          <div className="catalog-controls">
            <div className="search-bar-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by product name, volume (e.g. 500ml), or compartment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-pills" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={selectedCategory === cat ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setSelectedCategory(cat)}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                  <span className="product-badge">CODE: {product.modelCode} • {product.badge}</span>
                </div>

                <div className="product-body">
                  <span className="product-type">{product.type}</span>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.shortDesc}</p>

                  <div className="tier-pricing-box">
                    <div className="tier-title">Wholesale Volume Pricing (per unit)</div>
                    <div className="tier-grid">
                      {product.priceTiers.map((tier, idx) => (
                        <div key={idx} className="tier-item">
                          <span className="carton-lbl">
                            {tier.minCartons}+ Cartons
                          </span>
                          <span className="unit-price">£{tier.pricePerUnit.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="spec-pills">
                    <span className="spec-pill">📦 {product.specs.packSize} pcs/ctn</span>
                    <span className="spec-pill">📏 {product.specs.capacity}</span>
                    <span className="spec-pill">🔥 {product.specs.tempRange}</span>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="button button-primary small-button"
                      onClick={() => handleAddToCart(product, 1)}
                    >
                      + Add to Quote
                    </button>
                    <button
                      type="button"
                      className="button button-secondary small-button"
                      onClick={() => setActiveSpecProduct(product)}
                    >
                      Specs & Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Custom Logo Branding Configurator */}
        <section id="branding" className="branding-section">
          <div className="section-heading" style={{ textAlign: 'left', marginBottom: 24 }}>
            <span className="eyebrow">Custom Printed Packaging</span>
            <h2>Put Your Restaurant Logo on Compostable Bagasse</h2>
            <p>Custom soy-ink printing or blind debossing on clamshells, burger boxes, and noodle bowls.</p>
          </div>

          <div className="branding-grid">
            <div className="branding-preview-box">
              <div
                className="mockup-container"
                style={{
                  backgroundImage: `url(${brandingType === 'Burger Box'
                    ? '/images/burger_box_5x5.png'
                    : '/images/clamshell_7x5.png'
                    })`
                }}
              >
                <div
                  className="mockup-logo-overlay"
                  style={{ color: brandingColor, borderColor: brandingColor }}
                >
                  {brandingText || 'YOUR LOGO'}
                </div>
              </div>
              <p style={{ marginTop: 16, fontSize: '0.85rem', color: '#64748b' }}>
                Simulated soy-ink branding preview on eco-friendly unbleached bagasse fiber
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  1. Select Packaging Box Style
                </label>
                <select
                  value={brandingType}
                  onChange={(e) => setBrandingType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="Burger Box">Gourmet Burger Clamshell</option>
                  <option value="Square Clamshell">750ml Square Clamshell Box</option>
                  <option value="Rectangular Pack">900ml 2-Compartment Meal Box</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  2. Restaurant Name or Branding Text
                </label>
                <input
                  type="text"
                  value={brandingText}
                  onChange={(e) => setBrandingText(e.target.value)}
                  maxLength={25}
                  placeholder="Enter your brand text..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  3. Water-Based Soy Ink Color
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { name: 'Eco Emerald', hex: '#059669' },
                    { name: 'Sugarcane Amber', hex: '#d97706' },
                    { name: 'Deep Charcoal', hex: '#0f172a' },
                    { name: 'Kraft Brown', hex: '#78350f' }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setBrandingColor(color.hex)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '999px',
                        border: brandingColor === color.hex ? '2px solid #000' : '1px solid #cbd5e1',
                        background: color.hex,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="button button-eco"
                  style={{ width: '100%' }}
                  onClick={() => {
                    setIsSampleModalOpen(true);
                    showToast('Custom branding configuration saved for sample request!');
                  }}
                >
                  Request Branded Printed Sample
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Grid */}
        <section id="certifications" className="certifications-section">
          <div className="section-heading">
            <span className="eyebrow">International Standards</span>
            <h2>Food Contact Safety & Eco Certifications</h2>
            <p>Our bagasse production facility adheres to strict global food hygiene and compostability benchmarks.</p>
          </div>

          <div className="cert-grid">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.title} className="cert-card">
                <div className="cert-icon-wrap">✔</div>
                <h3>{cert.title}</h3>
                <span className="cert-code">{cert.code}</span>
                <p>{cert.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section">
          <div className="section-heading">
            <span className="eyebrow">Ordering Workflow</span>
            <h2>Four Easy Steps to Wholesale Bagasse Supply</h2>
          </div>

          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-num">01</div>
              <h3>Select Stock or Custom Range</h3>
              <p>Choose your required clamshell dimensions, bowl capacities, or custom print options.</p>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">02</div>
              <h3>Instant Volume Quote</h3>
              <p>Add products to your Quote Builder to review tiered carton discounts and pallet freight rates.</p>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">03</div>
              <h3>Free Physical Samples</h3>
              <p>Test container durability, microwave performance, and meal fitting with a free sample kit.</p>
            </div>
            <div className="timeline-card">
              <div className="timeline-num">04</div>
              <h3>Fast Dispatch & Delivery</h3>
              <p>24h dispatch for ready-stock items or scheduled recurring deliveries for multi-site chains.</p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section id="faq" style={{ marginTop: 70 }}>
          <div className="section-heading">
            <span className="eyebrow">Frequently Asked Questions</span>
            <h2>Wholesale Bagasse Packaging FAQ</h2>
          </div>

          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      fontFamily: 'inherit',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: '#0f172a',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.question}</span>
                    <span style={{ fontSize: '1.2rem' }}>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: '#475569', lineHeight: 1.7 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 80, paddingTop: 30, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, color: '#64748b', fontSize: '0.88rem' }}>
        <div>
          <strong style={{ color: '#0f172a', display: 'block', marginBottom: 4 }}>PackTrade Packaging Ltd</strong>
          <span>Direct Sugarcane Bagasse Importer & B2B Wholesale Distributor</span>
        </div>
        <div>
          <span>© 2026 PackTrade • Food Contact Certified • PFAS-Free Guarantee</span>
        </div>
      </footer>

      {/* Slide-over Quote Cart Drawer (Step 1: Instant Quote View) */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Wholesale Quote Builder</h2>
              <button type="button" className="close-btn" onClick={() => setIsDrawerOpen(false)}>
                ×
              </button>
            </div>

            <div className="drawer-body">
              {quoteCart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  <p>Your quote cart is empty.</p>
                  <a href="#catalog" className="button button-primary" onClick={() => setIsDrawerOpen(false)}>
                    Browse Products
                  </a>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 20 }}>
                    {quoteCart.map(({ product, cartons }) => {
                      const unitPrice = getUnitPrice(product, cartons);
                      const itemTotal = cartons * product.specs.packSize * unitPrice;
                      return (
                        <div key={product.id} className="cart-item-row">
                          <img src={product.image} alt={product.name} className="cart-item-img" />
                          <div className="cart-item-info">
                            <h4>{product.name}</h4>
                            <div className="units-lbl">
                              {cartons} ctn ({cartons * product.specs.packSize} pcs) @ £{unitPrice.toFixed(2)}/unit
                            </div>
                            <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                              £{itemTotal.toFixed(2)}
                            </div>
                          </div>
                          <div className="qty-control">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => handleUpdateCartons(product.id, -1)}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{cartons}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => handleUpdateCartons(product.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(product.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {quoteCart.length > 0 && (
              <div className="drawer-footer">
                <div className="summary-row">
                  <span>Total Cartons:</span>
                  <strong>{cartSummary.totalCartons} cartons</strong>
                </div>
                <div className="summary-row">
                  <span>Total Container Count:</span>
                  <strong>{cartSummary.totalUnits.toLocaleString()} units</strong>
                </div>
                <div className="summary-row">
                  <span>Estimated Total Weight:</span>
                  <strong>{cartSummary.totalWeightKg.toFixed(1)} kg</strong>
                </div>
                {cartSummary.savings > 0 && (
                  <div className="summary-row" style={{ color: '#059669', fontWeight: 800 }}>
                    <span>Volume Tier Discount Applied:</span>
                    <span>-£{cartSummary.savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Estimated Goods Cost (ex. VAT):</span>
                  <span>£{cartSummary.totalPrice.toFixed(2)}</span>
                </div>

                {/* Instant Action Buttons in Drawer Footer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  <button
                    type="button"
                    className="button button-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
                    onClick={() => setIsOrderCheckoutModalOpen(true)}
                  >
                    Proceed to Order & Request Invoice →
                  </button>

                  <button
                    type="button"
                    className="button button-secondary"
                    style={{ width: '100%' }}
                    onClick={() => setIsQuoteLeadModalOpen(true)}
                  >
                    📄 Download Price Proposal (PDF)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2 Order & Invoice Request Modal */}
      {isOrderCheckoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsOrderCheckoutModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <button type="button" className="modal-close" onClick={() => setIsOrderCheckoutModalOpen(false)}>
              ×
            </button>
            <span className="eyebrow" style={{ marginBottom: 6 }}>Step 2 of 2 • Order Submission</span>
            <h2 style={{ margin: '6px 0 10px' }}>Proceed to Order & Request Invoice</h2>

            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 14 }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Quote Summary</div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem', marginTop: 2 }}>
                £{cartSummary.totalPrice.toFixed(2)} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>(ex. VAT)</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: 4 }}>
                {cartSummary.totalCartons} cartons ({cartSummary.totalUnits.toLocaleString()} units) • {cartSummary.totalWeightKg.toFixed(1)} kg
              </div>
            </div>

            <div style={{ background: '#ecfdf5', padding: 12, borderRadius: 10, border: '1px solid #6ee7b7', marginBottom: 16, fontSize: '0.82rem', color: '#047857', lineHeight: 1.5 }}>
              <strong>BACS Payment Reference Notice:</strong> Your Proforma Invoice will display a bold order reference (e.g. <code>QT-849201</code>). Please ensure your accounts team uses this code in your bank transfer so your payment is auto-matched for 24h UK dispatch.
            </div>

            <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 6 }}>
                  1. Fulfillment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setOrderForm({ ...orderForm, fulfillmentMethod: 'delivery' })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: orderForm.fulfillmentMethod === 'delivery' ? '2px solid #059669' : '1px solid #cbd5e1',
                      background: orderForm.fulfillmentMethod === 'delivery' ? '#ecfdf5' : '#ffffff',
                      color: orderForm.fulfillmentMethod === 'delivery' ? '#047857' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🚚 Delivery to Site
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderForm({ ...orderForm, fulfillmentMethod: 'collection' })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: orderForm.fulfillmentMethod === 'collection' ? '2px solid #059669' : '1px solid #cbd5e1',
                      background: orderForm.fulfillmentMethod === 'collection' ? '#ecfdf5' : '#ffffff',
                      color: orderForm.fulfillmentMethod === 'collection' ? '#047857' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    🏬 Warehouse Collection (Free)
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                    Business / Restaurant Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Burger Craft Ltd"
                    required
                    value={orderForm.companyName}
                    onChange={(e) => setOrderForm({ ...orderForm, companyName: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    required
                    value={orderForm.contactName}
                    onChange={(e) => setOrderForm({ ...orderForm, contactName: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                    Business Email *
                  </label>
                  <input
                    type="email"
                    placeholder="orders@yourrestaurant.com"
                    required
                    value={orderForm.email}
                    onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                    Mobile / Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="07123 456789"
                    required
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              {orderForm.fulfillmentMethod === 'delivery' ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                      Street Delivery Address *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14 High Street, Unit 2"
                      required
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                        City / Town *
                      </label>
                      <input
                        type="text"
                        placeholder="London"
                        required
                        value={orderForm.city}
                        onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                        Delivery Postcode *
                      </label>
                      <input
                        type="text"
                        placeholder="EC1A 1BB"
                        required
                        value={orderForm.postcode}
                        onChange={(e) => setOrderForm({ ...orderForm, postcode: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ background: '#ecfdf5', padding: 12, borderRadius: 10, border: '1px solid #a7f3d0', fontSize: '0.85rem', color: '#047857' }}>
                  📍 <strong>Warehouse Collection Address:</strong> Unit 4, Gateway Trade Park, London. Collection hours: Mon-Fri 8am-5pm. Gate pass will be issued upon payment confirmation.
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                  Special Delivery / Driver Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tail lift needed, narrow alley, deliver before 11am"
                  value={orderForm.deliveryNotes}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryNotes: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={orderSubmitted}
                className="button button-primary"
                style={{ width: '100%', padding: '14px', marginTop: 8 }}
              >
                {orderSubmitted
                  ? 'Submitting Order Request...'
                  : orderForm.fulfillmentMethod === 'delivery'
                    ? 'Submit Order & Request Proforma Invoice'
                    : 'Submit Warehouse Collection Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Technical Specs Modal */}
      {activeSpecProduct && (
        <div className="modal-overlay" onClick={() => setActiveSpecProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setActiveSpecProduct(null)}>
              ×
            </button>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
              <img
                src={activeSpecProduct.image}
                alt={activeSpecProduct.name}
                style={{ width: 100, height: 100, borderRadius: 16, objectFit: 'cover' }}
              />
              <div>
                <span className="product-type">{activeSpecProduct.type}</span>
                <h2 style={{ margin: '4px 0', fontSize: '1.4rem' }}>{activeSpecProduct.name}</h2>
                <span className="eyebrow">CODE: {activeSpecProduct.modelCode}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.05rem', marginBottom: 12 }}>Technical Specification Sheet</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: '0.9rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, color: '#475569' }}>Dimensions (LxWxH):</td>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{activeSpecProduct.specs.dimensions}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, color: '#475569' }}>Volume Capacity:</td>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{activeSpecProduct.specs.capacity}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, color: '#475569' }}>Material Composition:</td>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{activeSpecProduct.specs.material}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, color: '#475569' }}>Carton Packaging:</td>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{activeSpecProduct.specs.packSize} units / carton ({activeSpecProduct.specs.cartonWeightKg} kg)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, color: '#475569' }}>Temperature Tolerance:</td>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{activeSpecProduct.specs.tempRange}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, color: '#475569' }}>Microwave & Oil Safe:</td>
                  <td style={{ padding: '8px 0', fontWeight: 600, color: '#059669' }}>✓ Yes (Oil & Hot Soup Safe)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 0', fontWeight: 700, color: '#475569' }}>Certifications:</td>
                  <td style={{ padding: '8px 0', fontWeight: 600 }}>{activeSpecProduct.specs.certifications.join(', ')}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                className="button button-primary"
                style={{ flexGrow: 1 }}
                onClick={() => {
                  handleAddToCart(activeSpecProduct, 1);
                  setActiveSpecProduct(null);
                }}
              >
                + Add 1 Carton to Quote
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setActiveSpecProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Sample Kit Modal (2-Step Wizard UI) */}
      {isSampleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSampleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <button type="button" className="modal-close" onClick={() => setIsSampleModalOpen(false)}>
              ×
            </button>

            {/* Step Progress Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 4, borderRadius: 2, background: '#ea580c' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c2410c' }}>1. Select Products</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 4, borderRadius: 2, background: sampleStep === 2 ? '#ea580c' : '#cbd5e1' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: sampleStep === 2 ? '#c2410c' : '#94a3b8' }}>2. Shipping Address</span>
              </div>
            </div>

            {sampleStep === 1 ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Select Sample Products</h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
                      Choose container models to test in your kitchen (<strong>1 physical sample unit per item</strong>).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const allCodes = PRODUCTS_DATA.map((p) => p.specs.modelCode);
                      setSampleForm((prev) => ({
                        ...prev,
                        selectedProducts: prev.selectedProducts.length === allCodes.length ? [] : allCodes
                      }));
                    }}
                    style={{
                      background: '#fffbe6',
                      border: '1px solid #ea580c',
                      color: '#c2410c',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {sampleForm.selectedProducts.length === PRODUCTS_DATA.length ? 'Clear All' : 'Select All 12 Items'}
                  </button>
                </div>

                {/* Visual Product Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: 10,
                  maxHeight: '340px',
                  overflowY: 'auto',
                  padding: '4px',
                  marginBottom: 16
                }}>
                  {PRODUCTS_DATA.map((p) => {
                    const isSelected = sampleForm.selectedProducts.includes(p.specs.modelCode);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleSampleProduct(p.specs.modelCode)}
                        style={{
                          border: isSelected ? '2px solid #ea580c' : '1px solid #e2e8f0',
                          background: isSelected ? '#fffbe6' : '#ffffff',
                          borderRadius: 10,
                          padding: '10px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          background: isSelected ? '#ea580c' : '#e2e8f0',
                          color: isSelected ? '#ffffff' : '#64748b',
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 800
                        }}>
                          {isSelected ? '✓' : '+'}
                        </div>

                        <img src={p.image} alt={p.name} style={{ width: '100%', height: 70, objectFit: 'contain', marginBottom: 6 }} />

                        <div>
                          <span style={{
                            display: 'inline-block',
                            background: isSelected ? '#c2410c' : '#f1f5f9',
                            color: isSelected ? '#ffffff' : '#475569',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 4,
                            marginBottom: 2
                          }}>
                            {p.specs.modelCode}
                          </span>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: isSelected ? '#c2410c' : '#94a3b8', marginTop: 2 }}>
                            {isSelected ? '✓ 1 Unit Selected' : '+ 1 Unit Sample'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step 1 Footer Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: sampleForm.selectedProducts.length > 0 ? '#ea580c' : '#94a3b8' }}>
                    {sampleForm.selectedProducts.length} Sample Units Selected
                  </span>

                  <button
                    type="button"
                    disabled={sampleForm.selectedProducts.length === 0}
                    className="button button-primary"
                    onClick={() => setSampleStep(2)}
                    style={{ padding: '12px 20px', fontSize: '0.9rem' }}
                  >
                    Next: Shipping Address →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSampleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbe6', padding: '10px 14px', borderRadius: 8, border: '1px solid #fef08a' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Selected Sample Pack:</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c2410c' }}>
                      {sampleForm.selectedProducts.length} Items ({sampleForm.selectedProducts.join(', ')})
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSampleStep(1)}
                    style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    ← Edit Products
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={sampleForm.name}
                    onChange={(e) => setSampleForm({ ...sampleForm, name: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                  <input
                    type="text"
                    placeholder="Restaurant / Business Name *"
                    required
                    value={sampleForm.businessName}
                    onChange={(e) => setSampleForm({ ...sampleForm, businessName: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    type="email"
                    placeholder="Business Email *"
                    required
                    value={sampleForm.email}
                    onChange={(e) => setSampleForm({ ...sampleForm, email: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                  <input
                    type="tel"
                    placeholder="Mobile / Phone Number *"
                    required
                    value={sampleForm.phone}
                    onChange={(e) => setSampleForm({ ...sampleForm, phone: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Street Delivery Address *"
                    required
                    value={sampleForm.address}
                    onChange={(e) => setSampleForm({ ...sampleForm, address: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    type="text"
                    placeholder="City / Town *"
                    required
                    value={sampleForm.city}
                    onChange={(e) => setSampleForm({ ...sampleForm, city: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                  <input
                    type="text"
                    placeholder="Postcode *"
                    required
                    value={sampleForm.postcode}
                    onChange={(e) => setSampleForm({ ...sampleForm, postcode: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setSampleStep(1)}
                    className="button button-secondary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    ← Back to Products
                  </button>
                  <button
                    type="submit"
                    disabled={sampleSubmitted}
                    className="button button-eco"
                    style={{ flex: 2, padding: '12px', fontSize: '0.95rem' }}
                  >
                    {sampleSubmitted ? 'Sending Request...' : `Dispatch Express Sample Kit (${sampleForm.selectedProducts.length} Items)`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div >
      )
      }

      {/* Quick Quote Lead Capture Modal */}
      {
        isQuoteLeadModalOpen && (
          <div className="modal-overlay" onClick={() => setIsQuoteLeadModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>📄 Download Instant Price Proposal</h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setIsQuoteLeadModalOpen(false)}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
                Enter your company details below. We'll generate a formal wholesale price proposal PDF showing exact volume tier savings and container specs.
              </p>
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsQuoteLeadModalOpen(false);
                handleDownloadQuickQuotePDF(quoteLeadForm.companyName, quoteLeadForm.contactInfo);
                showToast(`Price proposal generated & lead captured for ${quoteLeadForm.companyName}!`);
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                      Business / Restaurant Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tasty Takeaways Ltd"
                      required
                      value={quoteLeadForm.companyName}
                      onChange={(e) => setQuoteLeadForm({ ...quoteLeadForm, companyName: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                      Contact Phone or Email *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 07123 456789 or manager@tasty.co.uk"
                      required
                      value={quoteLeadForm.contactInfo}
                      onChange={(e) => setQuoteLeadForm({ ...quoteLeadForm, contactInfo: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="button button-primary"
                    style={{ marginTop: 8, padding: '12px', fontSize: '0.95rem' }}
                  >
                    Download Price Proposal (PDF) →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Contact & Custom Printing Inquiry Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        defaultInquiryType={contactDefaultType}
      />
    </div>
  );
}

export default App;
