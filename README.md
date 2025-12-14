# 🌍 TravelCompanion — AI-Powered Trip Planner

TravelCompanion is a full-stack web application that helps users plan trips intelligently by combining traditional trip management with AI-generated travel suggestions.

Users can create trips, manage packing lists and itineraries, and leverage generative AI to receive personalized recommendations for places to visit and items to pack based on destination, travel dates, and trip duration.

---

## ✨ Features

### 🔐 Authentication
- Secure user authentication using JWT
- Login and registration
- Protected routes and user-specific data access

### 🧳 Trip Management
- Create trips with destination, start date, and end date
- Automatic trip duration calculation
- Ownership-based access control

### 📍 Places to Visit
- Add places manually or from AI suggestions
- Track visited/unvisited places
- Bulk add support

### ✅ Packing List
- Add packing items manually or from AI suggestions
- Track packed/unpacked status
- Bulk add support

### 🤖 AI Trip Assistant
- Generates suggested places and items
- Considers destination, dates, duration, and existing data
- One-click **Add All** functionality
- Strict JSON-only AI responses for reliable parsing

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion  
**Backend:** Spring Boot, Spring Security, JPA  
**Database:** MySQL  
**Authentication:** JWT  
**AI:** Generative AI (Spring-based integration)

---

## 🏗️ Project Structure

```
TravelCompanion/
├── client/     # React frontend
└── server/     # Spring Boot backend
```

Frontend and backend are independently deployable.

---

## 🚀 Deployment

- **Frontend:** Netlify / Vercel
- **Backend:** Ready for Railway, Render, EC2, or similar platforms

Environment variables are managed via `.env` files (not committed).

---

## 🎯 Why This Project?

This project demonstrates:
- Full-stack application architecture
- Secure REST API development
- Clean React state management
- Real-world AI integration
- Production-ready project organization

---

## 📌 Future Enhancements
- Day-wise AI itinerary planning
- Weather-aware packing suggestions
- Collaborative trips
- Map and location integration

---

## 👤 Author

**Hafil**  
Bachelor of Computer Science & Engineering  
Focused on full-stack development and applied AI systems

---

### 🔹 GitHub About
> AI-powered trip planning application built with React and Spring Boot, featuring smart itinerary and packing suggestions.
