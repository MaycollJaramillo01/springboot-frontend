import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { http } from '@/lib/http';
import type { Customer, Invoice, PaymentMethod } from '@/types/domain';
import { useCartStore, calculateCartTotals } from '@/store/cart';
import styles from './PaymentModal.module.css';
import { Toast } from '@/ui/Toast';

const paymentSchema = z.object({
  customerId: z.number().optional(),
  paymentMethodId: z.number({ required_error: 'Seleccione un método de pago' }),
  notes: z.string().optional()
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

type PaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (invoice: Invoice) => void;
};

export function PaymentModal({ open, onClose, onSuccess }: PaymentModalProps) {
  const queryClient = useQueryClient();
  const { items, customerId, paymentMethodId, taxRate, discount } = useCartStore((state) => ({
    items: state.items,
    customerId: state.customerId,
    paymentMethodId: state.paymentMethodId,
    taxRate: state.taxRate,
    discount: state.discount
  }));
  const setCustomer = useCartStore((state) => state.setCustomer);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const clear = useCartStore((state) => state.clear);
  const totals = calculateCartTotals({ items, customerId, paymentMethodId, taxRate, discount });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerId,
      paymentMethodId
    }
  });

  useEffect(() => {
    setValue('customerId', customerId);
    setValue('paymentMethodId', paymentMethodId);
  }, [customerId, paymentMethodId, setValue]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      window.addEventListener('keydown', handler);
    }
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const customersQuery = useQuery({
    queryKey: ['customers', 'all'],
    queryFn: async () => {
      const response = await http.get<{
        content: Customer[];
      }>('/api/customers', { params: { size: 100 } });
      return response.data.content;
    },
    enabled: open
  });

  const paymentMethodsQuery = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await http.get<PaymentMethod[]>('/api/payment-methods');
      return response.data;
    },
    enabled: open
  });

  const mutation = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      const payload = {
        branchId: items[0]?.product.branchId ?? 1,
        customerId: values.customerId,
        paymentMethodId: values.paymentMethodId,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.salePrice,
          discount: item.discount ?? 0
        })),
        discount: totals.discount,
        notes: values.notes
      };
      const response = await http.post<Invoice>('/api/invoices', payload);
      return response.data;
    },
    onSuccess: (invoice) => {
      clear();
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onSuccess(invoice);
    }
  });

  const onSubmit = (values: PaymentFormValues) => {
    setCustomer(values.customerId);
    setPaymentMethod(values.paymentMethodId);
    mutation.mutate(values);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <h3>Confirmar pago</h3>
          <button type="button" onClick={onClose} className={styles.close}>
            ×
          </button>
        </header>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label>Cliente</label>
            <select
              {...register('customerId', {
                setValueAs: (value) => (value === '' ? undefined : Number(value))
              })}
            >
              <option value="">Consumidor final</option>
              {customersQuery.data?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Método de pago</label>
            <select
              {...register('paymentMethodId', {
                setValueAs: (value) => (value === '' ? undefined : Number(value))
              })}
            >
              <option value="">Seleccione...</option>
              {paymentMethodsQuery.data?.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
            {errors.paymentMethodId && <span className={styles.error}>{errors.paymentMethodId.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Notas</label>
            <textarea rows={3} {...register('notes')} placeholder="Observaciones opcionales" />
          </div>
          <section className={styles.summary}>
            <div>
              <span>Total a cobrar</span>
              <strong>C${totals.total.toFixed(2)}</strong>
            </div>
          </section>
          <footer className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.secondary}>
              Cancelar
            </button>
            <button type="submit" className={styles.primary} disabled={mutation.isPending}>
              Confirmar y emitir factura
            </button>
          </footer>
        </form>
      </div>
      {mutation.isError && (
        <Toast
          message="Error al emitir la factura. Intente nuevamente."
          variant="error"
          onClose={() => mutation.reset()}
        />
      )}
      {mutation.isSuccess && (
        <Toast
          message="Factura emitida correctamente"
          variant="success"
          onClose={() => mutation.reset()}
        />
      )}
    </div>
  );
}
