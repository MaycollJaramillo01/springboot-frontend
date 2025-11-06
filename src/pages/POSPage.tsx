import { useEffect, useMemo, useState } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import { useCustomerStore } from '../store/customerStore';
import { useCartStore } from '../store/cartStore';
import { useSyncStore } from '../store/syncStore';
import { useInvoiceStore } from '../store/invoiceStore';
import SearchInput from '../components/common/SearchInput';
import CategoryPills from '../components/catalog/CategoryPills';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';
import CustomerSelector from '../components/pos/CustomerSelector';
import StatusBanner from '../components/common/StatusBanner';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { submitSale } from '../lib/api';
import { printTicket } from '../lib/printing/ticket';
import TicketPreview from '../components/pos/TicketPreview';
import type { SaleResponse } from '../types/api';

const POSPage = () => {
  const catalog = useCatalogStore();
  const customers = useCustomerStore();
  const cart = useCartStore();
  const sync = useSyncStore();
  const invoices = useInvoiceStore();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [lastSale, setLastSale] = useState<SaleResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void catalog.initialize();
    void customers.initialize();
    void cart.initFromDB();
    void sync.initialize();
    void invoices.initialize();
  }, []);

  const filteredProducts = useMemo(() => {
    return catalog.products.filter((product) => {
      const matchesSearch = `${product.name} ${product.sku}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = categoryId ? product.categoryId === categoryId : true;
      return matchesSearch && matchesCategory;
    });
  }, [catalog.products, search, categoryId]);

  const handleFinalizeSale = async () => {
    if (!cart.items.length) {
      setErrorMessage('Agrega al menos un producto al carrito.');
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    const payload = {
      customerId: cart.customer?.id,
      paymentMethod: cart.paymentMethod,
      lines: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount
      })),
      notes: cart.notes
    };

    const response = await submitSale(payload);
    setProcessing(false);

    if (response.error || !response.data) {
      if (!navigator.onLine) {
        setErrorMessage('Sin conexión. La venta se guardó en cola.');
        await sync.enqueueSale(payload);
        cart.clear();
      } else {
        setErrorMessage(response.error?.message ?? 'No fue posible generar la factura.');
      }
      return;
    }

    await invoices.addInvoice(response.data.invoice);
    setLastSale(response.data);
    cart.clear();
    printTicket(response.data);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px', position: 'relative' }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {errorMessage && (
          <StatusBanner tone="danger" title="Error" description={errorMessage} />
        )}
        {lastSale && (
          <StatusBanner
            tone="success"
            title={`Factura ${lastSale.invoice.invoiceNumber} emitida`}
            description={`Total: ${lastSale.invoice.grandTotal.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP'
            })}`}
            action={
              <button
                type="button"
                onClick={() => printTicket(lastSale)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#22c55e',
                  color: '#0f172a',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reimprimir
              </button>
            }
          />
        )}
        {sync.pendingSales.length > 0 && (
          <StatusBanner
            tone="warning"
            title="Ventas pendientes"
            description={`Hay ${sync.pendingSales.length} venta(s) sin sincronizar.`}
            action={
              <button
                type="button"
                onClick={() => void sync.processQueue()}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#00b4d8',
                  color: '#0f172a',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sincronizar
              </button>
            }
          />
        )}
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar productos" />
        <CategoryPills
          categories={catalog.categories}
          activeId={categoryId}
          onSelect={setCategoryId}
        />
        <CustomerSelector
          customers={customers.customers}
          selectedCustomer={cart.customer ?? undefined}
          onSelect={(customer) => cart.setCustomer(customer)}
          onSearch={(term) => void customers.search({ query: term })}
        />
        <div style={{ position: 'relative', flex: 1 }}>
          <LoadingOverlay active={catalog.loading} message="Cargando catálogo..." />
          <ProductGrid products={filteredProducts} onAdd={cart.addItem} />
        </div>
      </section>
      <section style={{ position: 'sticky', top: 32, height: 'fit-content' }}>
        <CartPanel />
        <button
          type="button"
          onClick={handleFinalizeSale}
          disabled={processing}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '20px',
            fontSize: '1.2rem',
            borderRadius: '18px',
            border: 'none',
            background: processing ? 'rgba(148, 163, 184, 0.4)' : 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
            color: '#0f172a',
            fontWeight: 700,
            cursor: processing ? 'wait' : 'pointer'
          }}
        >
          {processing ? 'Procesando…' : 'Emitir factura'}
        </button>
        <TicketPreview sale={lastSale} />
      </section>
    </div>
  );
};

export default POSPage;
