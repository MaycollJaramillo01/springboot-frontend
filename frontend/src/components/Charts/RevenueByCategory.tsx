import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { http } from '@/lib/http';
import styles from './ChartCard.module.css';

type RevenueByCategory = {
  category: string;
  total: number;
};

const COLORS = ['#6366f1', '#f97316', '#22d3ee', '#22c55e', '#facc15', '#ec4899'];

type RevenueByCategoryChartProps = {
  from?: string;
  to?: string;
  title?: string;
};

export function RevenueByCategoryChart({ from, to, title = 'Ingresos por categoría' }: RevenueByCategoryChartProps = {}) {
  const rangeTo = to ? dayjs(to) : dayjs();
  const rangeFrom = from ? dayjs(from) : rangeTo.subtract(30, 'day');
  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'revenue-by-category', rangeFrom.format('YYYY-MM-DD'), rangeTo.format('YYYY-MM-DD')],
    queryFn: async () => {
      const response = await http.get<RevenueByCategory[]>('/api/reports/revenue-by-category', {
        params: { from: rangeFrom.format('YYYY-MM-DD'), to: rangeTo.format('YYYY-MM-DD') }
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
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="category" outerRadius={90} label>
              {data?.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`C$${value.toFixed(2)}`, 'Ingresos']} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
