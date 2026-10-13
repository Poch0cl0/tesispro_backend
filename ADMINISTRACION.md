# API del panel administrativo

La guía de instalación y operación está en `../tesispro_frontend/ADMINISTRACION.md`.

## Datos y compatibilidad

`cronograma_pago` representa la distribución del saldo de un contrato; es único por contrato. `cuota_pago` contiene número, monto y fecha de vencimiento. `pago` conserva los cobros e incorpora `id_cuota`, `id_usuario_registro` y una clave UUID única de idempotencia. Los registros históricos pueden conservar `id_cuota=NULL`.

Los importes se reciben y devuelven como cadenas decimales. El cálculo utiliza centavos con `bigint`. Los identificadores PostgreSQL `bigint`, incluidos los de leads y propuestas, siguen siendo cadenas. Las fechas de vencimiento son `YYYY-MM-DD`; los instantes de abonos incluyen zona horaria.

La migración nueva no reemplaza la migración inicial ni modifica sus datos históricos. Completa por código los estados de leads ausentes, sin reemplazar estados existentes. Al revertir conserva estos catálogos porque los historiales y pagos pueden referenciarlos.

Los servicios administrativos utilizan consultas parametrizadas mediante `DataSource`/`EntityManager` de TypeORM. La creación/edición del cronograma y los abonos bloquean el contrato; el abono además bloquea su cuota. Esto serializa las operaciones financieras de un mismo contrato. La suma programada es exacta y los cobros no pueden superar el saldo.

El trigger de conversión de pago a cliente se conserva. El trigger de historial lee el autor y motivo establecidos mediante variables transaccionales de PostgreSQL, registrando una sola entrada por cambio real de estado.

## Endpoints

| Endpoint | Operación |
| --- | --- |
| `POST /auth/login` | Correo y contraseña; establece cookie de sesión |
| `POST /auth/logout` | Revoca sesión y elimina cookie |
| `GET /auth/me` | Administrador autenticado, sin credenciales |
| `GET /admin/catalogos` | Estados, responsables activos, canales, modalidades y métodos |
| `GET /admin/resumen` | Leads, distribución de estados, saldos por moneda y próximos cobros |
| `GET/POST /admin/leads` | Listar/crear leads |
| `GET/PATCH /admin/leads/:id` | Consultar/editar campos del formulario |
| `GET /admin/leads/:id/historial` | Historial de estados con autor y motivo |
| `GET /admin/contratos` | Buscar contratos y consultar saldo |
| `GET/POST/PATCH /admin/contratos/:id/cronograma` | Consultar/crear/editar cuotas |
| `POST /admin/contratos/:id/cronograma/preview` | Generar distribución mensual sin persistir |
| `GET /admin/cuotas` | Listado de cobranza filtrado |
| `GET/POST /admin/cuotas/:id/abonos` | Historial/registro de abonos confirmados |
| `PATCH /admin/pagos-previos/:id` | Resolver cobros históricos pendientes antes de programar |

Los listados devuelven `{ items, total, page, pageSize }`, con 20 registros por defecto y máximo 100. `q` busca contacto; leads admiten `estado`, `responsable` o `sin_asignar`, `canal`, `desde`, `hasta`; cuotas admiten `estado`, `contrato`, `moneda`, `vencida`, `desde`, `hasta`. `sort` y `direction` tienen listas de valores permitidos. Los filtros se ejecutan en PostgreSQL.

Crear o editar cronograma recibe `{ cuotas: [{ nroCuota, monto, fechaVencimiento }] }`. Preview recibe `{ cantidad, primerVencimiento }`. Registrar abono recibe `{ monto, metodo, fechaPago, claveIdempotencia, referenciaOperacion?, comprobanteUrl? }`. Reutilizar una clave con datos diferentes devuelve 409.

El `PATCH` de lead recibe los mismos campos requeridos que el formulario de creación; no es una modificación arbitraria de la entidad. Campos requeridos: `nombres`, `correo`, `telefono`, `idEstado`. Campos opcionales: contacto secundario, preferencias, responsable, perfil objetivo, interés y `motivo` (obligatorio al cambiar estado).

## Autenticación y operación

Hash scrypt con sal aleatoria; sesiones PostgreSQL con token almacenado como SHA-256. No se guardan tokens en `localStorage`. Se verifica usuario activo y rol administrador en cada solicitud. Login tiene un límite por IP de diez intentos por quince minutos en este monolito; las mutaciones verifican `Origin` contra `APP_ORIGIN`.

`pnpm run admin:create` configura el primer acceso desde una terminal con contraseña oculta. No hay registro público ni credencial predeterminada. Para revocar accesos, desactiva el usuario o elimina sus sesiones en PostgreSQL mediante el procedimiento operativo correspondiente.

`pnpm run db:inspect` muestra estructura, conteos y triggers sin revelar credenciales ni contactos. `pnpm run test:admin` compila y prueba HTTP real en un esquema nuevo que se elimina al terminar; nunca usa las tablas de la base de trabajo para los datos de prueba.
