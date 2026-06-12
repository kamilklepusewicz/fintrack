# FinTrack - Dokumentacja Techniczna

Dokumentacja techniczna systemu **FinTrack**. 

Niniejsza dokumentacja została wygenerowana przy użyciu narzędzia DocFX i dzieli się na dwie główne sekcje:

1. **Docs (Przewodnik):** Sekcja ta zawiera ogólne informacje o architekturze systemu oraz instrukcje uruchomieniowe.
2. **API (Dokumentacja Kodu):** Szczegółowy, wygenerowany z komentarzy XML (C#) opis wszystkich przestrzeni nazw, klas, interfejsów oraz modeli bazy danych wykorzystywanych w projekcie.

## Architektura Systemu

Aplikacja została zbudowana w architekturze klient-serwer:
* **Frontend:** Zbudowany w oparciu o bibliotekę React (Vite) z wykorzystaniem React-Bootstrap do responsywnego interfejsu użytkownika.
* **Backend:** REST API napisane w .NET 10 (C#) wykorzystujące Entity Framework Core jako ORM oraz bazę danych SQLite.
* **Zewnętrzne API:** System integruje się z publicznym API Narodowego Banku Polskiego (NBP) w celu pobierania aktualnych kursów walut.

Aby zapoznać się z modelami danych (np. `Transaction`, `Account`), należy przejść do zakładki **API** w górnym menu nawigacyjnym.