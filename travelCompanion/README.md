# 🌍 TravelCompanion API

AI-powered trip planning backend built with **Spring Boot**, **JWT**, **JPA**, and **Spring AI**.  
Users can create trips, receive AI-generated suggestions, and manage places to visit and packing items.

---

## 🚀 Base URL

```
http://localhost:8080
```

All secured endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 🔐 Authentication

### POST `/api/auth/register`
**Create User**

```json
{
  "username": "user",
  "password": "password"
}
```

---

### POST `/api/auth/login`
**Login User**

```json
{
  "username": "user",
  "password": "password"
}
```

Response:
```json
{
  "token": "jwt-token"
}
```

---

### PUT `/api/auth/username`
**Change Username**

```json
{
  "newUsername": "newuser"
}
```

---

### PUT `/api/auth/password`
**Change Password**

```json
{
  "oldPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## 🧳 Trips

### POST `/api/trips`
**Create Trip**

```json
{
  "name": "Kerala Trip",
  "destination": "Kerala",
  "fromDate": "2025-12-01",
  "toDate": "2025-12-05"
}
```

---

### GET `/api/trips`
**List Trips**

---

### GET `/api/trips/{tripId}`
**Trip Details**

---

### PUT `/api/trips/{tripId}`
**Update Trip**

```json
{
  "name": "Updated Name",
  "destination": "Updated Destination",
  "fromDate": "2025-12-10",
  "toDate": "2025-12-15"
}
```

---

### DELETE `/api/trips/{tripId}`
**Delete Trip**

---

## 🤖 AI

### GET `/api/ai`
**AI Chat / Hello**

Returns a welcome message from the AI service.

---

## 📍 Places to Visit

### GET `/api/trips/{tripId}/places`
**List Places**

---

### POST `/api/trips/{tripId}/places`
**Add Place**

```json
{
  "name": "Munnar"
}
```

---

### POST `/api/trips/{tripId}/places/bulk`
**Bulk Add Places**

```json
[
  { "name": "Munnar" },
  { "name": "Wayanad" },
  { "name": "Kochi" }
]
```

---

### PUT `/api/trips/{tripId}/places/{placeId}`
**Update Place**

```json
{
  "name": "Munnar",
  "visited": true
}
```

---

### DELETE `/api/trips/{tripId}/places/{placeId}`
**Delete Place**

---

## 🎒 Packing Items

### GET `/api/trips/{tripId}/items`
**List Items**

---

### POST `/api/trips/{tripId}/items`
**Add Item**

```json
{
  "name": "Power bank",
  "packed": false
}
```

---

### POST `/api/trips/{tripId}/items/bulk`
**Bulk Add Items**

```json
[
  { "name": "Rain jacket", "packed": false },
  { "name": "Shoes", "packed": false }
]
```

---

### PUT `/api/trips/{tripId}/items/{itemId}`
**Update Item**

```json
{
  "name": "Shoes",
  "packed": true
}
```

---

### DELETE `/api/trips/{tripId}/items/{itemId}`
**Delete Item**

---

## 📝 Notes

- All resources are user-owned
- JWT-based authentication
- Bulk endpoints support AI output

---

## 🛠 Tech Stack

- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- Spring AI
- MySQL / H2
- REST API
