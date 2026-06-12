# FinTrack — System Zarządzania Finansami Osobistymi

FinTrack to aplikacja webowa typu SPA (Single Page Application) przeznaczona do zarządzania budżetem osobistym oraz portfelami wielowalutowymi. System integruje się z zewnętrzną chmurą obliczeniową API Narodowego Banku Polskiego (NBP), co umożliwia asynchroniczne pobieranie aktualnych kursów walut oraz przeliczanie transakcji w czasie rzeczywistym.

## 🚀 Zrealizowane Wymagania Projektowe

Projekt został wykonany zgodnie z pełną specyfikacją wymagań technicznych i funkcjonalnych:
* **Architektura rozproszona .NET:** Zaimplementowano system dwuwarstwowy z odseparowanym backendem (REST API) oraz niezależnym klientem webowym.
* **Warstwa persystencji danych:** Wykorzystano technologię Entity Framework Core z relacyjną bazą danych SQLite.
* **Bezpieczeństwo i autentykacja:** Wdrożono moduł rejestracji i logowania użytkowników zabezpieczony tokenami JWT (JSON Web Tokens).
* **Integracja z zewnętrznymi serwisami:** Zaimplementowano komunikację z API NBP za pomocą mechanizmu `HttpClient` (obsługa asynchronicznego pobierania, serializacji oraz deserializacji strumieni danych JSON).
* **Konteneryzacja:** Całość aplikacji przygotowano do uruchomienia w środowisku izolowanym przy użyciu Docker Compose, z zapewnieniem trwałego wolumenu dla bazy danych.
* **Testy automatyczne:** Kluczowa logika biznesowa oraz integralność bazy danych zostały pokryte testami integracyjnymi z wykorzystaniem wirtualnej bazy danych (In-Memory Database) w środowisku NUnit.
* **Dokumentacja techniczna:** Wygenerowano dokumentację wewnętrzną kodu na podstawie struktury tagów XML przy użyciu narzędzia DocFX.

---

## 🛠️ Stos Technologiczny

* **Backend:** .NET 10 (Web API), Entity Framework Core, SQLite, NUnit
* **Frontend:** React, Vite, React-Bootstrap, Nginx
* **Infrastruktura:** Docker, Docker Compose, DocFX, Swagger/OpenAPI

---

## 📦 Instrukcja Uruchomienia (Docker Compose)

W celu uruchomienia kompletnego stosu aplikacyjnego wymagane jest zainstalowane i uruchomione środowisko Docker Desktop.

1. Należy otworzyć terminal w głównym katalogu projektu.
2. Uruchomienie kontenerów odbywa się za pomocą komendy:
   ```bash
   docker compose up -d --build
3. Frontend (Aplikacja kliencka): Dostępna pod adresem http://localhost:5173
4. Backend (Serwer API): Dostępny pod adresem http://localhost:5074
