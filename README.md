# FinTrack — System Zarządzania Finansami Osobistymi

FinTrack to nowoczesna aplikacja webowa typu SPA (Single Page Application) służąca do kompleksowego zarządzania budżetem osobistym oraz portfelami wielowalutowymi. System automatycznie pobiera i przetwarza dane telemetryczne z chmury obliczeniowej **API Narodowego Banku Polskiego (NBP)**, oferując asynchroniczne przeliczanie transakcji walutowych na PLN w czasie rzeczywistym.

## 🚀 Spełnione Wymagania Projektowe

Projekt został zrealizowany w oparciu o pełną specyfikację wymagań przedmiotowych:
* **Architektura Webowa .NET:** Dwuwarstwowy system z odseparowanym backendem (REST API) oraz nowoczesnym klientem SPA.
* **Persystencja danych & ORM:** Wykorzystanie **Entity Framework Core** z bazą danych SQLite.
* **Bezpieczeństwo & Autoryzacja:** Pełny moduł rejestracji i logowania użytkowników zabezpieczony asymetrycznymi tokenami **JWT (JSON Web Tokens)**.
* **Komunikacja z serwisami sieciowymi:** Integracja z zewnętrznym API NBP via `HttpClient` (serializacja i deserializacja strumieni JSON).
* **Konteneryzacja (Docker):** Pełne przygotowanie aplikacji do wdrożenia w chmurze przy użyciu **Docker Compose** z separacją środowisk i trwałym wolumenem dla bazy danych.
* **Testy Automatyczne (NUnit):** Pokrycie kluczowej logiki biznesowej i integralności bazy danych zaawansowanymi testami integracyjnymi z wykorzystaniem wirtualnej bazy danych **In-Memory Database**.
* **Dokumentacja Techniczna (XML + DocFX):** Generowanie dokumentacji wewnętrznej kodu z tagów XML przy użyciu oficjalnego silnika Microsoftu — **DocFX**.

---

## 🛠️ Stos Technologiczny

* **Backend:** .NET 10 (Web API), Entity Framework Core, SQLite, NUnit
* **Frontend:** React, Vite, React-Bootstrap, Nginx
* **Infrastruktura:** Docker, Docker Compose, DocFX, Swagger/OpenAPI

---

## 📦 Instrukcja Uruchomienia (Docker Compose)

Aplikacja została w pełni skonteneryzowana. Jedyne wymaganie to uruchomione środowisko *Docker Desktop*.

1. Otwórz terminal w głównym katalogu projektu.
2. Uruchom cały stos aplikacyjny jedną komendą:
   ```bash
   docker compose up -d --build
