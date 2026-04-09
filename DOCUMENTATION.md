# Documentación de Arquitectura Multi-Tenant (MYPES)

## 1. Arquitectura en Supabase (Idenza / MYPES)

Con los recientes cambios, el frontend de "Sorpresas Ayacucho" (y el de cualquier futura Mype que uses con este código) están conectados a un único y robusto proyecto general de Supabase llamado `mypes`. 

Para evitar mezclar catálogos o exponer datos de otras mypes, hemos añadido la lógica y seguridad RLS:

- **Estructura Base:** El proyecto en Supabase tiene dos tablas organizativas:
  - `tenants`: Cada registro representa a una empresa conectada. Actualmente existe el ID: `2c97b00e-a73c-49aa-a1fa-9ee9903ee3b9` correspondiente a "**Sorpresas Ayacucho**".
  - `tenant_users`: Relaciona a un usuario autenticado (correo) de Supabase con los permisos de edición para la empresa correspondiente.

- **Filtrado Mágico Automático:** 
  A nivel local (en tu código), configuré la variable de entorno `VITE_TENANT_ID`. Todas las peticiones de subida, consulta, lectura pública  para el catálogo que lanza la tienda lo exigen: `.eq('tenant_id', import.meta.env.VITE_TENANT_ID)`. Esto permite tener cientos de empresas en la BD, porque la empresa A jamás le inyectará datos ni mirará las Sorpresas en venta de la empresa B.

---

## 2. Nuevo Sistema de Logueo (Administración)

### ¿Cómo era antes?
Anteriormente, cualquiera que supiera descubrir o robar el password duro `ayacucho2026` insertaba productos sin control, sin validación extra, lo cual en un ecosistema robusto de MYPES es sumamente peligroso.

### ¿Cómo funciona ahora para cada MYPE?
1. He modificado el formulario de Login (la página privada) para que pida un combo de **Email y Contraseña**.
2. Cada Mype que de ahora en adelante crees en tu repositorio, precisará que tú (desde la organización de Idenza) le crees un usuario, lo unas a su Tenet en `tenant_users` y le proporciones credenciales oficiales exclusivas.
3. El frontend de cada sistema ya enviará esas credenciales nativamente a Supabase usando `supabase.auth.signInWithPassword`, logrando que un "Token Privado Cifrado" se encargue de darle permisos reales al navegador para insertar y sobrescribir imágenes de la empresa pertinente.

---

## 3. Credenciales de Acceso para Sorpresas Ayacucho 🔑

Acorde a tu solicitud exclusiva he provisionado un buzón real enlazado al acceso administrativo de `Sorpresas Ayacucho`. Con esta credencial, su dueña interactuará legítimamente garantizando la inyección segura de nuevos productos.

- **URL del Portal Administrativo:** Mismo enlace en su web /admin.
- **Usuario (Email Administrador):** `admin.sorpresas@gmail.com`
- **Contraseña:** `ayacucho2026`

> [!IMPORTANT]
> Si en el futuro deseas administrar la MYPE 2, 3 o 4, bastará con clonar este repositorio, configurar que su archivo `.env.local` apunte el ID_TENANT nuevo, y darle un usuario administrativo de la misma forma (ej. `admin.papeleria@gmail.com`). 
