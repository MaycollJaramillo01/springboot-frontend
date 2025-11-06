# POS Touch Frontend

Aplicación de punto de venta táctil construida con React + Vite, optimizada para pantallas 1366x768, sincronizada con la API `http://165.22.170.75:8080` y con soporte para modo offline mediante IndexedDB.

## Características

- Estructura de proyecto basada en Vite (`react-ts`).
- Consumo de la API REST con Axios configurado por variable de entorno (`VITE_API_BASE_URL`).
- Tipos de TypeScript derivados del contrato OpenAPI (`src/types/api.ts`).
- Manejo de catálogo, clientes, carrito y facturas mediante Zustand.
- Persistencia offline con IndexedDB y cola de sincronización de ventas.
- UI táctil con componentes reutilizables y flujo completo de venta.
- Impresión de ticket térmico de 80 mm y vista previa integrada.

## Requisitos

- Node.js >= 18
- npm >= 9 (o pnpm / yarn)

## Instalación

```bash
npm install
```

Si necesitas regenerar los tipos a partir del contrato OpenAPI, ejecuta:

```bash
npm run generate:api
```

Luego puedes importar manualmente los esquemas relevantes o fusionarlos con `src/types/api.ts` según sea necesario.

## Scripts disponibles

```bash
npm run dev       # Modo desarrollo
npm run build     # Compilación de producción (incluye typecheck)
npm run preview   # Previsualización de la build
npm run lint      # Linter con ESLint
npm run typecheck # Validación estricta de tipos
```

## Variables de entorno

- `VITE_API_BASE_URL`: URL base de la API (por defecto definida en `.env`).

## Flujo de trabajo sugerido

1. Inicia la app con `npm run dev` y accede a `http://localhost:5173`.
2. Desde la página POS, busca productos, selecciona un cliente y agrega al carrito.
3. Elige método de pago, agrega notas y emite la factura.
4. Si hay conexión, la venta se enviará a la API y se imprimirá el ticket; en caso contrario se almacena para sincronización posterior.
5. Revisa las páginas de productos, categorías, clientes y facturas para validar la sincronización.

## Pruebas end-to-end manuales

1. Arranca la API remota (`http://165.22.170.75:8080`).
2. Ejecuta `npm run dev` y realiza una venta completa seleccionando cliente, productos y método de pago.
3. Verifica que la factura aparezca en la sección de facturas y que el ticket se imprima en formato 80 mm.
4. Desconecta la red, realiza una venta y vuelve a conectarte para observar la sincronización automática.

## Estructura de carpetas principal

```
src/
├── App.tsx
├── components/
│   ├── catalog/
│   ├── common/
│   ├── layout/
│   └── pos/
├── lib/
│   ├── api/
│   ├── db/
│   ├── hooks/
│   └── printing/
├── pages/
├── store/
├── styles/
└── types/
```

## Licencia

MIT
