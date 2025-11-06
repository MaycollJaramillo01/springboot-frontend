import type { ReactNode } from 'react';

export type LoadingOverlayProps = {
  active: boolean;
  message?: ReactNode;
};

const LoadingOverlay = ({ active, message }: LoadingOverlayProps) => {
  if (!active) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f8fafc',
        gap: '12px',
        zIndex: 30,
        borderRadius: '16px'
      }}
    >
      <div className="spinner" style={{ width: 48, height: 48 }} />
      <span>{message ?? 'Sincronizando...'}</span>
    </div>
  );
};

export default LoadingOverlay;
