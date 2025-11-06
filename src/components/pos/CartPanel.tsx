import { useState, type ChangeEvent } from 'react';
import { useCartStore, useCartTotals } from '../../store/cartStore';
import type { PaymentMethod } from '../../types/api';
import PaymentSelector from './PaymentSelector';
import NumericKeypad from './NumericKeypad';

const CartPanel = () => {
  const { items, customer, paymentMethod, notes, removeItem, updateQuantity, setNotes, setPaymentMethod } =
    useCartStore();
  const totals = useCartTotals();
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleNotes = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: '#0f172a',
        color: '#f8fafc',
        padding: '24px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: 420,
        minHeight: 'calc(100vh - 120px)'
      }}
    >
      <header>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem' }}>Carrito</h2>
        <p style={{ margin: 0, color: '#cbd5f5' }}>
          {customer ? `Cliente: ${customer.fullName}` : 'Cliente no seleccionado'}
        </p>
      </header>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto'
        }}
      >
        {items.map((item) => (
          <div
            key={item.product.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(148, 163, 184, 0.12)',
              borderRadius: '16px',
              border: focusedItem === item.product.id ? '2px solid #38bdf8' : '2px solid transparent'
            }}
            onClick={() => {
              setFocusedItem(item.product.id);
              setInputValue(item.quantity.toString());
            }}
          >
            <div>
              <strong>{item.product.name}</strong>
              <p style={{ margin: '4px 0 0', color: '#cbd5f5' }}>{item.product.sku}</p>
              <label style={{ display: 'block', marginTop: 8 }}>
                Cantidad
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onFocus={() => {
                    setFocusedItem(item.product.id);
                    setInputValue(item.quantity.toString());
                  }}
                  onChange={(event) => {
                    const quantity = Number(event.target.value);
                    updateQuantity(item.product.id, quantity);
                    if (focusedItem === item.product.id) {
                      setInputValue(quantity.toString());
                    }
                  }}
                  style={{
                    marginTop: 4,
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(148, 163, 184, 0.4)'
                  }}
                />
            </label>
          </div>
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => {
                  removeItem(item.product.id);
                  if (focusedItem === item.product.id) {
                    setFocusedItem(null);
                    setInputValue('');
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Quitar
              </button>
              <p style={{ marginTop: 'auto', fontSize: '1.1rem', fontWeight: 600 }}>
                {(item.unitPrice * item.quantity).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: item.product.unitPrice.currency
                })}
              </p>
            </div>
          </div>
        ))}
        {!items.length && <p style={{ color: '#cbd5f5' }}>Agrega productos desde el catálogo.</p>}
      </div>
      <PaymentSelector value={paymentMethod as PaymentMethod} onChange={setPaymentMethod} />
      {focusedItem && (
        <div
          style={{
            background: 'rgba(148, 163, 184, 0.18)',
            padding: '12px',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '1.4rem',
            fontWeight: 600
          }}
        >
          Cantidad: {inputValue || '—'}
        </div>
      )}
      <NumericKeypad
        onDigit={(digit) => {
          setInputValue((prev) => {
            if (digit === '.' && prev.includes('.')) return prev;
            const next = `${prev}${digit}`;
            return next.replace(/^0+(\d)/, '$1');
          });
        }}
        onClear={() => {
          setInputValue((prev) => prev.slice(0, -1));
        }}
        onConfirm={() => {
          if (!focusedItem) return;
          const quantity = Number(inputValue);
          if (Number.isFinite(quantity) && quantity > 0) {
            updateQuantity(focusedItem, Math.floor(quantity));
            setInputValue(Math.floor(quantity).toString());
          }
        }}
      />
      <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        Notas
        <textarea
          value={notes}
          onChange={handleNotes}
          rows={3}
          style={{
            borderRadius: '12px',
            padding: '12px',
            resize: 'vertical',
            border: '1px solid rgba(148, 163, 184, 0.4)'
          }}
        />
      </label>
      <footer style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Subtotal</span>
          <strong>{totals.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Impuestos</span>
          <strong>{totals.tax.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '1.4rem',
          fontWeight: 700,
          marginTop: 12
        }}>
          <span>Total</span>
          <span>{totals.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
      </footer>
    </aside>
  );
};

export default CartPanel;
