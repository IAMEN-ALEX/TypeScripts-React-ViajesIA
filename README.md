# 🌍 Viajando con la IA

Aplicación web moderna para planificar y organizar viajes con asistencia de inteligencia artificial.

## ✨ Características

- 🗺️ **Gestión de Viajes**: Crea y organiza tus viajes por destino y fechas
- 📝 **Notas Inteligentes**: Agrega notas y planes para cada viaje
- 🤖 **Asistente IA**: Pregunta sobre tus viajes y obtén respuestas inteligentes
- 🎨 **UI Moderna**: Interfaz premium con efectos visuales y animaciones
- 📱 **Responsive**: Funciona perfectamente en móviles, tablets y desktop
- 🔒 **Seguro**: Autenticación de usuarios y protección de datos

## 🚀 Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: React Bootstrap, CSS personalizado
- **IA**: Groq API con Llama 3.1
- **Base de Datos**: SQLite (local) / Vercel Postgres (producción)
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en [Groq](https://console.groq.com) para API key

## 🛠️ Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/IAMEN-ALEX/TypeScripts-React-ViajesIA.git
cd TypeScripts-React-ViajesIA
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus API keys:
```env
GROQ_API_KEY=tu_clave_groq
GOOGLE_API_KEY=tu_clave_google
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔑 Credenciales de Prueba

- **Email**: `test@example.com`
- **Password**: `password123`

O:

- **Email**: `menaresalexis34@gmail.com`
- **Password**: `123456`

## 📦 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 🌐 Deployment a Vercel

Ver guía completa en [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

1. Push a GitHub
2. Conectar repositorio en Vercel
3. Crear base de datos Postgres
4. Configurar variables de entorno
5. Deploy automático

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/              # Páginas y rutas de Next.js
│   │   ├── api/          # API routes
│   │   ├── dashboard/    # Dashboard principal
│   │   └── login/        # Página de login
│   ├── components/       # Componentes reutilizables
│   ├── lib/              # Utilidades y configuración
│   └── types/            # Definiciones TypeScript
├── public/               # Archivos estáticos
└── init-postgres.sql     # Script de inicialización DB
```

## 🔒 Seguridad

- Headers de seguridad configurados
- Validación de inputs
- Variables de entorno para credenciales
- Protección CSRF

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto.

## 👨‍💻 Desarrollador

**IAMEN-ALEX**

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
