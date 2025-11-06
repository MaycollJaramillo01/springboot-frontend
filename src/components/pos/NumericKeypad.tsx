export type NumericKeypadProps = {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onConfirm: () => void;
};

const layout = [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], ['0', '.', '⌫']];

const NumericKeypad = ({ onDigit, onClear, onConfirm }: NumericKeypadProps) => {
  const handlePress = (value: string) => {
    if (value === '⌫') {
      onClear();
    } else {
      onDigit(value);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {layout.map((row) => (
        <div key={row.join('-')} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePress(key)}
              style={{
                padding: '18px',
                fontSize: '1.4rem',
                borderRadius: '16px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background: '#fff',
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.1)',
                cursor: 'pointer'
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={onConfirm}
        style={{
          padding: '20px',
          fontSize: '1.2rem',
          borderRadius: '16px',
          border: 'none',
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Aplicar cantidad
      </button>
    </div>
  );
};

export default NumericKeypad;
