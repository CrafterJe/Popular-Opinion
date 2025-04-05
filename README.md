# Autor
Desarrollado por Raúl Juárez Suárez
2025 – Todos los derechos reservados

# 🎮 Popular Opinion

**Popular Opinion** es un juego de escritorio multijugador local, inspirado en programas clásicos de concursos basados en encuestas como *Family Feud* o *100 Mexicanos Dijeron*. Dos equipos compiten por adivinar las respuestas más populares a preguntas creadas por el usuario, a lo largo de múltiples rondas.

Desarrollado con **Electron** y **JavaScript**, este juego funciona completamente sin conexión y está pensado para ofrecer una experiencia rápida, divertida y personalizable.

---

## 🧩 Características

- ✏️ Crea tus propias rondas con preguntas y respuestas personalizadas  
- 🧠 Sistema de puntuación basado en la popularidad de cada respuesta  
- 👥 Modo para dos equipos con tres oportunidades por turno  
- 💾 Guardado local en archivos `.json`  
- 🖥️ Funciona como aplicación de escritorio para Windows (y multiplataforma)

---

## 🚀 Cómo iniciar el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/popular-opinion.git
cd popular-opinion
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Ejecuta la aplicación
```bash
npm start
```

### 📁 Estructura del proyecto
```bash
popular-opinion/
├── main.js
├── preload.js
├── /public
│   └── index.html
├── /src
│   ├── renderer.js
│   ├── styles.css
│   └── logic/
│       └── gameManager.js
├── /data
│   └── sample_game.json
├── /assets
│   └── logo.png
└── README.md
```