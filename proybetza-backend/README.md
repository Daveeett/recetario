# proybetza-backend

Backend **REST API** de nivel senior para el recetario — construido con **Express.js**, **TypeScript** y **PostgreSQL**.

## 🚀 Características

- 🔐 **Autenticación JWT** con bcrypt (registro, login, perfil)
- 🍽️ **Recetas completas** en base de datos con pasos detallados
- 🖼️ **Imágenes en PostgreSQL** (BYTEA) servidas como endpoint HTTP
- ❤️ **Preferencias de usuario** (favoritos, alérgenos, categorías preferidas)
- 💬 **Foro de reseñas** con sistema de likes
- 🛡️ **Seguridad**: Helmet, CORS, Rate Limiting, Zod validation
- 📝 **Logs estructurados** con Winston
- 🗄️ **Migrations SQL** versionadas

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 14+

## ⚙️ Configuración

```bash
# 1. Copia el archivo de entorno
cp .env.example .env

# 2. Edita .env con tus credenciales de PostgreSQL
```

## 🗄️ Base de datos

```bash
# Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE proybetza;"

# Ejecutar migraciones (crea todas las tablas)
npm run db:migrate

# Poblar con las 35 recetas iniciales
npm run db:seed
```

## 🏃 Ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con hot reload)
npm run dev

# Compilar para producción
npm run build
npm start
```

## 🌐 API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Perfil del usuario |

### Recetas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/recipes` | Lista con paginación |
| GET | `/api/recipes/:id` | Detalle de receta |
| GET | `/api/recipes/:id/image` | Imagen binaria |
| GET | `/api/recipes/category/:slug` | Por categoría |
| GET | `/api/recipes/search?q=` | Búsqueda |
| GET | `/api/recipes/recommended` | Recomendadas (auth) |
| GET | `/api/recipes/ingredients` | Todos los ingredientes |
| POST | `/api/recipes` | Crear (admin) |
| PUT | `/api/recipes/:id` | Actualizar (admin) |
| POST | `/api/recipes/:id/image` | Subir imagen (admin) |
| DELETE | `/api/recipes/:id` | Eliminar (admin) |

### Preferencias (requieren auth)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/preferences` | Obtener preferencias |
| PUT | `/api/preferences` | Actualizar preferencias |
| POST | `/api/preferences/favorites/toggle` | Toggle favorito |
| POST | `/api/preferences/allergens/toggle` | Toggle alérgeno |

### Foro
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/forum` | Lista de posts |
| GET | `/api/forum/:id` | Detalle de post |
| POST | `/api/forum` | Crear post (auth) |
| PUT | `/api/forum/:id` | Editar post (auth) |
| DELETE | `/api/forum/:id` | Eliminar post (auth) |
| POST | `/api/forum/:id/like` | Like/unlike (auth) |

## 🔑 Autenticación

Incluye el token JWT en el header:
```
Authorization: Bearer <tu_token_jwt>
```

## 📁 Estructura del proyecto

```
src/
├── config/          # env, database pool, logger
├── middleware/       # auth, error, upload, validate
├── modules/
│   ├── auth/        # registro, login, JWT
│   ├── recipes/     # CRUD + imágenes + búsqueda
│   ├── preferences/ # favoritos y alérgenos del usuario
│   └── forum/       # posts y likes
├── db/
│   ├── migrations/  # schema SQL versionado
│   └── seeds/       # 35 recetas con pasos detallados
└── types/           # tipos TypeScript globales
```
