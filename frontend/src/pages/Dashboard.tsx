import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import styles from './Dashboard.module.css';
import { SalesByDayChart } from '@/components/Charts/SalesByDay';
import { TopProductsChart } from '@/components/Charts/TopProducts';
import { RevenueByCategoryChart } from '@/components/Charts/RevenueByCategory';

type Metrics = {
  salesToday: number;
  ticketsToday: number;
  averageTicket: number;
  newCustomers: number;
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: async () => {
      const response = await http.get<Metrics>('/api/reports/dashboard');
      return response.data;
    }
  });

  return (
    <div className={styles.wrapper}>
      <section className={styles.metrics}>
        {['Ventas hoy', 'Tickets hoy', 'Ticket promedio', 'Clientes nuevos'].map((label, index) => (
          <article key={label} className={styles.metricCard}>
            <span>{label}</span>
            <strong>
              {isLoading
                ? '...'
                : index === 0
                  ? `C$${data?.salesToday.toFixed(2)}`
                  : index === 1
                    ? data?.ticketsToday
                    : index === 2
                      ? `C$${data?.averageTicket.toFixed(2)}`
                      : data?.newCustomers}
            </strong>
          </article>
        ))}
      </section>
      <section className={styles.chartsGrid}>
        <SalesByDayChart />
        <TopProductsChart />
        <RevenueByCategoryChart />
      </section>
    </div>
  );
}
