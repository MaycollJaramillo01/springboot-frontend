import type { ReactNode } from 'react';

export type StatusBannerProps = {
  title: string;
  description?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  action?: ReactNode;
};

const palette: Record<NonNullable<StatusBannerProps['tone']>, string> = {
  info: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444'
};

const StatusBanner = ({ title, description, tone = 'info', action }: StatusBannerProps) => (
  <section
    style={{
      borderLeft: `6px solid ${palette[tone]}`,
      background: 'rgba(15, 23, 42, 0.03)',
      padding: '16px 20px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}
  >
    <div>
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
      {description && (
        <p style={{ marginTop: 4, marginBottom: 0, color: '#334155' }}>{description}</p>
      )}
    </div>
    {action}
  </section>
);

export default StatusBanner;
