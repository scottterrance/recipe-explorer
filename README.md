# 🍳 Recipe Explorer

**Full-stack recipe discovery app** with user authentication, favorites, smart search, and AI-powered recipe suggestions.

![Demo](https://via.placeholder.com/800x400/10b981/ffffff?text=Recipe+Explorer+Demo)  
*(Replace with your live demo GIF after deployment)*

## ✨ Features

- 🔍 **Smart recipe search** powered by Spoonacular API
- ❤️ **User favorites** (MongoDB persistence)
- 🔐 **JWT Authentication** (register / login)
- 🤖 **AI Recipe Assistant** (OpenAI GPT)
- 📱 **Beautiful responsive UI** with Tailwind + Lucide icons
- 🚀 **Production-ready** deployment configs

## 📚 API Documentation

![API Documentation](./api-docs.png)  
*Beautiful interactive-style docs (dark theme with highlighted endpoints)*

The backend exposes a clean REST API with JWT authentication. All endpoints are under `/api/`.

### Authentication
| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| `POST` | `/api/auth/register`    | Create new account   |
| `POST` | `/api/auth/login`       | Login + receive JWT  |

### Recipes & AI
| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| `GET`  | `/api/recipes/search`     | Search recipes (Spoonacular) |
| `GET`  | `/api/ai/suggest`         | AI recipe ideas (OpenAI)     |

### Favorites
| Method | Endpoint           | Description             |
|--------|--------------------|-------------------------|
| `POST` | `/api/favorites`   | Add recipe to favorites |
| `GET`  | `/api/favorites`   | Get user's favorites    |
| `DELETE` | `/api/favorites/:id` | Remove from favorites |

> **All protected routes require** `Authorization: Bearer <jwt-token>` header.

## 🛠 Tech Stack

**Frontend**  
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) 
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

**Backend**  
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white) 
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) 
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

**Extras**: JWT, OpenAI, Spoonacular, Gunicorn, Render

## 🚀 Live Demo
**[→ Open Live App](https://recipe-explorer-development.netlify.app)** (update after deploy)

## 📸 Screenshots

*<img width="1879" height="795" alt="image" src="https://github.com/user-attachments/assets/2702285c-c041-4df1-aa87-c79845ffb013" />
<img width="1189" height="775" alt="image" src="https://github.com/user-attachments/assets/de8eb740-d0a7-41b4-9ff5-12d5d1a2bcea" />
<img width="685" height="833" alt="image" src="https://github.com/user-attachments/assets/fa6c34fe-da78-4793-9257-35225954ff94" />
*

## 🧪 Local Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
