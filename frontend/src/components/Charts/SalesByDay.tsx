import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { http } from '@/lib/http';
import styles from './ChartCard.module.css';

type SalesByDay = {
  date: string;
  total: number;
};

type SalesByDayChartProps = {
  from?: string;
  to?: string;
  title?: string;
};

export function SalesByDayChart({ from, to, title = 'Ventas últimos 30 días' }: SalesByDayChartProps = {}) {
  const rangeTo = to ? dayjs(to) : dayjs();
  const rangeFrom = from ? dayjs(from) : rangeTo.subtract(30, 'day');
  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'sales-by-day', rangeFrom.format('YYYY-MM-DD'), rangeTo.format('YYYY-MM-DD')],
    queryFn: async () => {
      const response = await http.get<SalesByDay[]>('/api/reports/sales-by-day', {
        params: { from: rangeFrom.format('YYYY-MM-DD'), to: rangeTo.format('YYYY-MM-DD') }
      });
      return response.data;
    }
  });

  const chartData = useMemo(() => {
    return data?.map((item) => ({
      date: dayjs(item.date).format('DD/MM'),
      total: item.total
    })) ?? [];
  }, [data]);

  return (
    <div className={styles.card}>
      <header>
        <h3>{title}</h3>
      </header>
      {isLoading ? (
        <div className={styles.skeleton}>Cargando...</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => `C$${value}`} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value: number) => [`C$${value.toFixed(2)}`, 'Total']} />
            <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#salesGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
