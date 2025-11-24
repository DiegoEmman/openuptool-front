# Estructura Frontend

Esta carpeta `src` concentra todo el código de aplicación.

## Capas

- app/: Layouts globales, providers y boundaries.
- pages/: Páginas (rutas) de alto nivel.
- components/: Componentes reutilizables (UI, comunes, específicos).
- hooks/: Custom hooks.
- services/: Acceso a APIs, http client, adaptadores.
- store/: Estado global (Redux, Zustand, etc.).
- types/: Tipos y contratos TS.
- utils/: Helpers puros, formateadores, validaciones.
- config/: Configuración (env, constantes, feature flags).
- styles/: CSS global, variables, tokens.
- assets/: Imágenes, íconos, fuentes empaquetadas.
- lib/: Integraciones con librerías (react-query, i18n, etc.).

## Convenciones

- Cada página tiene su carpeta y un `index.ts`/`<Name>Page.tsx`.
- Re-exportar en `index.ts` para imports limpios.
- Evitar imports relativos profundos usando `paths` en `tsconfig` (opcional).

## Próximos pasos

- Integrar enrutador apuntando a `pages/`.
- Añadir gestión de estado si se necesita.
- Configurar React Query y manejo de errores centralizado.
