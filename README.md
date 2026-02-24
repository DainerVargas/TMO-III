# TMO III - E-commerce Suministros

Sistema de gestión y venta de suministros para **Beit Perú**, diseñado con una arquitectura moderna, escalable y una interfaz de usuario premium.

## 🛠️ Tecnologías y Herramientas

El proyecto está dividido en una arquitectura de **Cliente-Servidor** (Monorepo), utilizando las siguientes herramientas:

### 🎨 Frontend (Client-side)

- **Core Framework:** [React 18](https://reactjs.org/) con [Vite](https://vitejs.dev/) para un desarrollo ultrarrápido.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para un tipado estático y código robusto.
- **Estilos & UI:**
  - **Tailwind CSS 4:** Para un diseño moderno y responsive.
  - **Radix UI:** Componentes de interfaz accesibles y sin estilos base.
  - **Material UI (MUI):** Librería de componentes adicionales y sistema de iconos.
  - **Lucide React:** Set de iconos vectoriales elegantes.
- **Animaciones:** [Motion](https://www.framer.com/motion/) para transiciones y micro-interacciones fluidas.
- **Gestión de Estado & Rutas:**
  - **React Context API:** Para el manejo de estados globales (Admin, Usuario, Carrito).
  - **React Router 7:** Navegación dinámica y protegida.
  - **React Hook Form:** Validación y manejo de formularios complejos.
- **Visualización de Datos:** [Recharts](https://recharts.org/) para analíticas y estadísticas en el panel admin.
- **Feedback:** [Sonner](https://sonner.emilkowal.ski/) para notificaciones (toasts) elegantes.

### ⚙️ Backend (Server-side)

- **Entorno de Ejecución:** [Node.js](https://nodejs.org/)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (ejecutado con `tsx`).
- **Base de Datos & ORM:**
  - **MySQL:** Motor de base de datos relacional.
  - **Prisma ORM:** Para el modelado de datos y consultas tipadas.
- **Seguridad & Autenticación:**
  - **JSON Web Token (JWT):** Para la gestión de sesiones seguras.
  - **BcryptJS:** Encriptación de contraseñas de alta seguridad.
- **Almacenamiento:** [Multer](https://github.com/expressjs/multer) para la gestión de subida de imágenes y archivos.

### 🚀 Herramientas de Desarrollo

- **Concurrentmente:** Para ejecutar cliente y servidor simultáneamente con un solo comando.
- **Nodemon:** Reinicio automático del servidor en desarrollo.
- **Prisma Studio:** Interfaz visual para administrar la base de datos.
- **Visual Studio Code:** Editor principal recomendado.

---

© 2026 Beit Perú - Desarrollado por Antigravity AI.
