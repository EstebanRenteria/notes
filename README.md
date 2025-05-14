# Gestor de Notas

Este es un proyecto de gestión de notas desarrollado con Vue 3. Utiliza Pinia para el manejo de estado, Vue Router para la navegación entre vistas y ofrece autenticación mediante JWT.

## Instrucciones para instalar y ejecutar

1. Clonar el repositorio:

   git clone https://github.com/EstebanRenteria/notas.git
   cd gestor-notas

2. Instalar las dependencias:

   npm install

3. Configurar las variables de entorno:

   Crear un archivo `.env` con el siguiente contenido:

   VITE_API_URL=https://api.ejemplo.com

4. Ejecutar la aplicación en modo desarrollo:

   npm run dev

La aplicación estará disponible en http://localhost:5173

## Estructura del proyecto

src/
├── assets/              - Recursos estáticos (imágenes, estilos)
├── components/          - Componentes reutilizables (Header, Sidebar, etc.)
├── composables/         - Funciones reutilizables con Composition API
├── router/              - Definición de rutas
├── stores/              - Gestión del estado con Pinia
├── views/               - Vistas principales (Login, Dashboard, etc.)
├── App.vue              - Componente raíz de la aplicación
├── main.js              - Punto de entrada principal