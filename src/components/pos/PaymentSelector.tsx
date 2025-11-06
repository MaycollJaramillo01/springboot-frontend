import type { PaymentMethod } from '../../types/api';

export type PaymentSelectorProps = {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
};

const PAYMENT_METHODS: { label: string; value: PaymentMethod }[] = [
  { label: 'Efectivo', value: 'CASH' },
  { label: 'Tarjeta', value: 'CARD' },
  { label: 'Transferencia', value: 'TRANSFER' },
  { label: 'Billetera', value: 'MOBILE' },
  { label: 'Mixto', value: 'MIXED' }
];

const PaymentSelector = ({ value, onChange }: PaymentSelectorProps) => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <h3 style={{ margin: 0, fontSize: '1rem' }}>Método de pago</h3>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '12px'
      }}
    >
      {PAYMENT_METHODS.map((method) => (
        <button
          key={method.value}
          type="button"
          onClick={() => onChange(method.value)}
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            background: value === method.value ? '#00b4d8' : 'rgba(148, 163, 184, 0.15)',
            color: value === method.value ? '#0f172a' : '#e2e8f0',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {method.label}
        </button>
      ))}
    </div>
  </section>
);

export default PaymentSelector;
