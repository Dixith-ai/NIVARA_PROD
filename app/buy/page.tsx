'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './buy.module.css';

export default function BuyPage() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [applePayMsg, setApplePayMsg] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderEmail, setOrderEmail] = useState('');
  const checkoutRef = useRef<HTMLElement>(null);

  const unitPrice = 299;
  const total = unitPrice * quantity;

  const decrease = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const increase = () => { if (quantity < 10) setQuantity(quantity + 1); };

  const handleAddToCart = () => {
    setShowCheckout(true);
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleApplePay = () => {
    setApplePayMsg(true);
    setTimeout(() => setApplePayMsg(false), 3000);
  };

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector<HTMLInputElement>('#email');
    setOrderEmail(emailInput?.value ?? '');
    setOrderPlaced(true);
  };

  /* Thumbnail background colours — stand in for real photos */
  const thumbColors = ['#1a1510', '#1e1b16', '#211d17', '#1c190f'];

  return (
    <div className={styles.buyPage}>
      <section className="product-page">
        <div className="container">
          <div className="product-layout">
            <div className="product-gallery">
              <div className="gallery-main-container">
                {/* Styled placeholder replacing broken img src="#" */}
                <div style={{
                  width: '100%', aspectRatio: '4/3',
                  background: 'linear-gradient(135deg, #0e0c08 0%, #1a1510 60%, #221d14 100%)',
                  border: '1.5px solid var(--color-border-warm)',
                  borderRadius: '12px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '8px',
                }}>
                  <span style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', color: 'var(--color-accent)', letterSpacing: '0.08em' }}>NIVARA</span>
                  <span style={{ fontFamily: 'var(--font-family-accent)', fontSize: '0.9rem', color: 'rgba(250,248,244,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scanner</span>
                </div>
              </div>
              <div className="gallery-thumbnails">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`gallery-thumbnail${activeThumb === i ? ' active' : ''}`}
                    onClick={() => setActiveThumb(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="thumb-placeholder" style={{
                      background: thumbColors[i],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '100%', borderRadius: '6px',
                      fontFamily: 'var(--font-family-display)',
                      fontSize: '0.7rem', color: 'var(--color-accent)', letterSpacing: '0.06em',
                    }}>N</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="purchase-panel">
              <h1 className="mb-4">NIVARA Device</h1>
              <p className="text-large text-secondary mb-8">
                Clinical-grade skin imaging technology with intelligent AI analysis and comprehensive tracking.
              </p>

              <div className="price-section mb-8">
                <div className="price">$299</div>
                <p className="text-secondary text-small">One-time purchase · Lifetime software updates</p>
              </div>

              <div className="quantity-section mb-8">
                <label className="label">Quantity</label>
                <div className="quantity-selector">
                  <button className="quantity-btn" aria-label="Decrease quantity" onClick={decrease}>−</button>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={10}
                    className="quantity-input"
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(10, Math.max(1, val)));
                    }}
                  />
                  <button className="quantity-btn" aria-label="Increase quantity" onClick={increase}>+</button>
                </div>
              </div>

              <button className="btn btn-accent btn-large w-full mb-4" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn btn-outline btn-large w-full mb-2" onClick={handleApplePay}>Buy with Apple Pay</button>
              {applePayMsg && (
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                  UPI &amp; Apple Pay coming soon
                </p>
              )}
              {!applePayMsg && <div style={{ marginBottom: 'var(--space-6)' }} />}

              <div className="trust-badges">
                <div className="trust-item">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 10L8 15L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <span>2-year warranty</span>
                </div>
                <div className="trust-item">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 10L8 15L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <span>30-day returns</span>
                </div>
                <div className="trust-item">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 10L8 15L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <span>Free shipping</span>
                </div>
              </div>

              <div className="product-details mt-12">
                <h4 className="mb-4">What&apos;s included</h4>
                <ul className="included-list">
                  <li>NIVARA imaging device</li>
                  <li>USB-C charging cable</li>
                  <li>Protective carrying case</li>
                  <li>Quick start guide</li>
                  <li>Lifetime software updates</li>
                  <li>1-year premium support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <h2 className="text-center mb-16 reveal">Device highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-highlight reveal">
              <h4 className="mb-3">Clinical Grade</h4>
              <p className="text-secondary">20MP sensor with 10x magnification for exceptional detail</p>
            </div>
            <div className="feature-highlight reveal">
              <h4 className="mb-3">Portable</h4>
              <p className="text-secondary">Compact design fits in your pocket, weighs just 180g</p>
            </div>
            <div className="feature-highlight reveal">
              <h4 className="mb-3">Long Battery</h4>
              <p className="text-secondary">500+ scans on a single charge with fast USB-C charging</p>
            </div>
            <div className="feature-highlight reveal">
              <h4 className="mb-3">Wireless</h4>
              <p className="text-secondary">Bluetooth &amp; Wi-Fi connectivity for instant sync</p>
            </div>
          </div>
        </div>
      </section>

      {showCheckout && (
        <section className="section checkout-section" ref={checkoutRef}>
          <div className="container">
            <div className="checkout-container">
              {orderPlaced ? (
                /* ── Order success state ── */
                <div className="card" style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto', padding: 'var(--space-12) var(--space-8)' }}>
                  <svg style={{ display: 'block', margin: '0 auto var(--space-5)', color: 'var(--color-accent)' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)' }}>Order Request Received</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                    Our team will contact you at <strong style={{ color: 'var(--color-text-primary)' }}>{orderEmail}</strong> to complete your purchase and arrange delivery.
                  </p>
                  <Link href="/" className="btn btn-primary btn-large">Back to Home</Link>
                </div>
              ) : (
                <>
                  <h2 className="mb-12">Checkout</h2>
                  <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                    <div className="form-section">
                      <h4 className="mb-6">Shipping information</h4>
                      <div className="form-row">
                        <div className="form-group"><label className="label" htmlFor="firstName">First name</label><input type="text" id="firstName" className="input" required /></div>
                        <div className="form-group"><label className="label" htmlFor="lastName">Last name</label><input type="text" id="lastName" className="input" required /></div>
                      </div>
                      <div className="form-group"><label className="label" htmlFor="email">Email</label><input type="email" id="email" className="input" required /></div>
                      <div className="form-group"><label className="label" htmlFor="address">Address</label><input type="text" id="address" className="input" required /></div>
                      <div className="form-row">
                        <div className="form-group"><label className="label" htmlFor="city">City</label><input type="text" id="city" className="input" required /></div>
                        <div className="form-group"><label className="label" htmlFor="postalCode">Postal code</label><input type="text" id="postalCode" className="input" required /></div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4 className="mb-6">Payment information</h4>
                      <div className="form-group"><label className="label" htmlFor="cardNumber">Card number</label><input type="text" id="cardNumber" className="input" placeholder="1234 5678 9012 3456" required /></div>
                      <div className="form-row">
                        <div className="form-group"><label className="label" htmlFor="expiry">Expiry</label><input type="text" id="expiry" className="input" placeholder="MM/YY" required /></div>
                        <div className="form-group"><label className="label" htmlFor="cvc">CVC</label><input type="text" id="cvc" className="input" placeholder="123" required /></div>
                      </div>
                    </div>

                    <div className="order-summary">
                      <h4 className="mb-6">Order summary</h4>
                      <div className="summary-row"><span>NIVARA Device × {quantity}</span><span>${total}</span></div>
                      <div className="summary-row"><span>Shipping</span><span>Free</span></div>
                      <div className="summary-row total"><span>Total</span><span>${total}</span></div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-large w-full">Complete Purchase</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
