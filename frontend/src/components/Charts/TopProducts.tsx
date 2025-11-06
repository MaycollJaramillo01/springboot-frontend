import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { http } from '@/lib/http';
import styles from './ChartCard.module.css';

type TopProduct = {
  name: string;
  total: number;
  quantity: number;
};

type TopProductsChartProps = {
  from?: string;
  to?: string;
  limit?: number;
  title?: string;
};

export function TopProductsChart({ from, to, limit = 8, title = 'Top productos' }: TopProductsChartProps = {}) {
  const rangeTo = to ? dayjs(to) : dayjs();
  const rangeFrom = from ? dayjs(from) : rangeTo.subtract(30, 'day');
  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'top-products', rangeFrom.format('YYYY-MM-DD'), rangeTo.format('YYYY-MM-DD'), limit],
    queryFn: async () => {
      const response = await http.get<TopProduct[]>('/api/reports/top-products', {
        params: { from: rangeFrom.format('YYYY-MM-DD'), to: rangeTo.format('YYYY-MM-DD'), limit }
      });
      return response.data;
    }
  });

  return (
    <div className={styles.card}>
      <header>
        <h3>{title}</h3>
      </header>
      {isLoading ? (
        <div className={styles.skeleton}>Cargando...</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => `C$${value}`} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value: number) => [`C$${value.toFixed(2)}`, 'Ventas']} />
            <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
