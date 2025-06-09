# 👨‍💻 Microservicio de Autenticación – StreamFlow

Este microservicio forma parte del proyecto **StreamFlow**, De la asignatura **Arquitectura de Sistemas**. Administra la información relacionada a la autenticación permitiendo el inicio de sesión, actualización de contraseña y cierre de sesión.

---

## 📋 Requisitos

- Node.js v18.x o superior  
- Docker  
- RabbitMQ   
- PostgreSQL   
- Postman 

---

## 🚀 Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/Taller2-AS/auth-service.git
cd authService
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea el archivo `.env`

Ejemplo:

```env
POSTGRES_URI=postgres://auth_user:auth_pass@localhost:5436/auth_db
JWT_SECRET=arquitecturaDeSistemasJWT12345Secret

SERVER_URL=localhost
SERVER_PORT=3002

RABBITMQ_URL=amqp://admin:admin@localhost:5672

```

> ⚠️ Asegúrate de que PostgreSQL y RabbitMQ estén corriendo en tu entorno local.

---

### 4. Levanta PostgreSQL y RabbitMQ con Docker

```bash
docker-compose up -d
```

---

### 5. Ejecuta el seeder (opcional)

```bash
npm run seed
```

Esto insertará 100 registros falsos de usuarios para pruebas.

---

### 6. Inicia el microservicio

```bash
npm start
```
---

## 👨‍💻 Desarrollado por

**Desarrollador A - Martin Becerra**  
Universidad Católica del Norte – Arquitectura de Sistemas