# Aclaración Previa

El borrador general de este readme fue escrito por IA, luego editado a mano por su autor (o sea... yo) para asegurarse que contenia lo necesario. La única excepción es esta sección, escrita a mano por quien firma el programa. Sólo una cosa que aclarar por si la ven, el Initial Commit está firmado por `Alejandra`, la razón es simple, comencé a trabajar desde la máquina de mi esposa e hice ese commit antes de acordarme de actualizar los datos de usuario de Git

Sin más que agregar, los dejo con la parte ya más técnica:

# Pokédex Challenge

Aplicación web para explorar Pokémon, filtrar el listado, consultar detalles, organizar favoritos y comparar estadísticas.

## Requisitos previos

- Node.js y npm.
- Navegador moderno con soporte para IndexedDB.

## Instalación y ejecución

Desde la raíz del proyecto, instalar las dependencias:

```sh
npm install
```

Iniciar el servidor de desarrollo:

```sh
npm run dev
```

Vite mostrará la URL local en la terminal. Para generar y servir una compilación de producción:

```sh
npm run build
npm run preview
```

Comandos adicionales:

```sh
npm test
npm run lint
```

## Decisiones técnicas

### Cache y persistencia

Se utiliza Redux Persist para guardar a `localStorage` el estado pequeño de la interfaz: báscamente favoritos y posición de scroll (para volver al mismo punto de la lista tanto cuando se navega como al refrescar la app). 

Las llamadas a PokéAPI se gestionan con RTK Query. Para que el listado pueda reutilizar páginas ya visitadas y los índices de filtros después de reiniciar la aplicación, se persiste un allowlist de queries en IndexedDB, no en `localStorage`.

Se eligió IndexedDB con `idb-keyval` porque persistir en `localStorage` el contenido acumulado del endpoint paginado implicaba serializar y escribir una cantidad creciente de datos de forma sincrónica en el hilo principal. Ese trabajo afectaba seriamente la capacidad de respuesta y la experiencia de usuario. IndexedDB ofrece operaciones asíncronas y `idb-keyval` proporciona una interfaz pequeña basada en promesas.

El cache de RTK Query se hidrata por separado, de manera asíncrona, y no se mantiene detrás del `PersistGate` general. Si IndexedDB no está disponible, existe un fallback a `localStorage`; ese fallback no tiene las mismas ventajas de rendimiento para payloads grandes.

El cache persistido incluye:

- Respuestas completas de `getPokemonsPaginated` con páginas de 20 Pokémon que ya se visitaron.
- Los índices compactos de tipos y generaciones.
- Solo se escriben queries completadas; el catálogo grande utilizado por Comparar y las consultas individuales de detalle quedan fuera.

Las escrituras se agrupan con un debounce de 750 ms. Las páginas se conservan hasta 30 días y una página de más de 24 horas se revalida al solicitarla online, mostrando el resultado cacheado mientras se actualiza. Al iniciar, las páginas contiguas se restauran en orden y se eliminan nombres duplicados. El listado conserva las filas disponibles si falla una actualización y retoma la paginación al recuperar la conexión.

### Conectividad y uso offline

Con la aplicación ya cargada, las páginas e índices restaurados pueden seguir alimentando el listado y sus filtros sin conexión. No se implementó un service worker: por ello, el navegador no puede cargar el HTML, JavaScript y CSS de la aplicación al abrir o refrescar el sitio cuando no hay red. Los sprites y las imágenes de detalle también se descargan de servidores externos y no tienen garantía offline.

### Skeletons y estados de espera

Se decidió no incorporar una librería genérica de skeletons. En su lugar, las esperas y cargas progresivas usan animaciones Lottie con elementos propios de Pokémon, como Poké Balls y Bulbasaur. La decisión prioriza el valor temático y la coherencia visual de la UI sobre los placeholders skeleton convencionales.

## Mejoras futuras

- Incorporar un service worker y cache del app shell si se requiere abrir o refrescar la aplicación completamente offline.
- Añadir cache offline para sprites e información de detalle si se necesita una experiencia sin conexión más completa.
- Medir y comparar latencia de inicio, tiempo de rehidratación y respuesta al scroll en dispositivos lentos; IndexedDB hace asíncrono el I/O, pero la serialización, el filtrado y la actualización de Redux aún consumen CPU.
- Memoizar los componentes de fila y los callbacks de navegación con `React.memo` y `useCallback` para limitar re-renders innecesarios en listas virtualizadas.
- Reducir el costo de restauración de scroll y de las lecturas de DOM para mantener la interfaz fluida durante cambios de filtro y navegación.
- Medir el costo real del render del listado con React Profiler y perfiles de CPU en dispositivos lentos, no solo la latencia de red.
- Precomputar índices por ID para tipos y generaciones y evitar parseos repetidos de URLs durante el filtrado.
- Evaluar `useDeferredValue` o `startTransition` para cambios de filtro más pesados y mejorar la sensación de respuesta de la UI.
- Separar mejor la lógica de “datos base” y “vista visible” para evitar derivaciones redundantes cuando cambia estado ajeno a la lista.
- Añadir pruebas de integración para validar filtros, restauración de scroll y comportamiento de la lista virtualizada en diferentes estados.
- Establecer un límite máximo o una política de poda por cantidad de páginas, además de la expiración actual por antigüedad.
- Añadir tags de RTK Query (`providesTags` / `invalidatesTags`) para invalidación y actualización selectiva si se incorporan operaciones que modifiquen datos.
- Aplicar estilos diferenciados a los toasts de favoritos: al agregar o quitar un Pokémon y al advertir que el equipo ya alcanzó el límite de seis.
- Ampliar las pruebas automatizadas con pruebas de integración para IndexedDB, rehidratación del store y recuperación completa de paginación offline, y en lineas generales, darle cobertura de testing a toda la aplicación.
