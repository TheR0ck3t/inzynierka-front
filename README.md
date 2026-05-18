# Inżynierka Frontend

Aplikacja frontend do systemu zarządzania pracownikami - **projekt stworzony w ramach pracy inżynierskiej**.

## 📚 O Projekcie

Frontend będący częścią zaawansowanego systemu do zarządzania dostępem pracowników z integracją RFID, komunikacji MQTT i obsługą dwuskładnikowej autoryzacji (2FA).

## 🎯 Główne Funkcjonalności

- 🔐 Autoryzacja z 2FA (TOTP)
- 👥 Zarządzanie pracownikami (CRUD)
- 🃏 Enrolowanie i zarządzanie kartami RFID
- 📊 Logi dostępu w real-time
### Podstawowe
- **React 19.1.0** - biblioteka do budowania interfejsu
- Walidacja w czasie rzeczywistym

### Interfejs i Wizualizacja
- **FontAwesome 6.7.2** - ikony (liniowe, zwykłe, marki)
- **ESLint 9.25.0** - sprawdzenie jakości kodu

- Uruchomiony backend API (inzynierka-api) na porcie 3000

git clone https://github.com/TheR0ck3t/inzynierka-front.git
cd inzynierka-front
```

2. Instalacja zależności:
```bash
npm install
```

3. Konfiguracja zmiennych środowiskowych:
```bash
cp .env.example .env
# Konfiguracja
VITE_COMPANY_NAME="Galactic Republic"
VITE_WS_URL=http://localhost:3000
```

## 🚀 Uruchomienie
```

npm run build
```

## 📁 Struktura Projektu
│   │   └── TwoFaModal.jsx # Modal 2FA do wprowadzania kodów TOTP
│   ├── employee/          # Zarządzanie pracownikami
│   └── users/             # Zarządzanie użytkownikami
│       ├── UpdatePassword.jsx     # Zmiana hasła
│   ├── Dashboard.jsx      # Panel administracyjny
│   ├── Employees.jsx      # Zarządzanie pracownikami
├── contexts/              # React Context API
│   └── AuthContext.jsx    # Kontekst autoryzacji (z obsługą 2FA)
├── assets/                # Zasoby statyczne
│   ├── styles/            # Pliki CSS
├── Layout.jsx             # Wrapper layoutu z warunkowaniem
├── Pages.jsx              # Definicje tras i routing
└── main.jsx               # Punkt wejścia aplikacji
- JWT w ciasteczkach z automatycznym odświeżaniem
- Ochrona tras - automatyczne przekierowanie użytkowników niezalogowanych
- Automatyczne wylogowanie przy odpowiedzi 401 (sesja wygasła)

### Zarządzanie Pracownikami
- Lista pracowników z danymi (imię, nazwisko, data urodzenia, data zatrudnienia)
- Dodawanie nowych pracowników z walidacją
- Edycja danych pracownika
- Usuwanie pracowników z potwierdzeniem
- Eksport danych (w rozwoju)

### Zarządzanie RFID
- Enrolowanie nowych kart pracowników
- Zarządzanie kartami dostępu
- Historią skanów
- Status aktywności kart

### Monitoring i Statystyki
- Logi dostępu w real-time (WebSocket)
- Wykresy czasu pracy (Recharts)
- Status obecności pracowników
- Historia zmian (audit logs)

### Śledzenie Czasu Pracy
- Automatyczne logowanie wejść/wyjść
- Obliczanie godzin pracy
- Raporty dobowe/miesięczne
- Eksport danych do CSV/PDF

### Ustawienia Konta
- Zmiana hasła z weryfikacją
- Zmiana numeru telefonu
- **Zarządzanie 2FA** - włączanie/wyłączanie z QR kodami
- Dane profilowe użytkownika

## Stylowanie i Projekt

- **Moduły CSS** dla komponentów
- **Ikony FontAwesome** (liniowe, zwykłe, marki)
- **Recharts** dla interaktywnych wykresów
- Ciemny motyw naukowy
- Logo Galaktycznej Republiki
- Responsywny projekt (mobile-first)
- Animacje CSS

## Zmienne Środowiskowe

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `VITE_COMPANY_NAME` | Nazwa organizacji | `Galactic Republic` |
| `VITE_EMPLOYEE` | Nazwa pracownika (singular) | `Clone Trooper` |
| `VITE_API_URL` | URL backend API | `http://localhost:3000` |
| `VITE_WS_URL` | URL WebSocket | `http://localhost:3000` |

## 🔧 Dostępne Skrypty

```bash
# Serwer deweloperski z automatycznym przeładowaniem
npm run dev

# Zbudowanie dla produkcji
npm run build

# Podgląd zbudowanej aplikacji
npm run preview

# Sprawdzenie jakości kodu
npm run lint
```

## 📦 Zależności Główne

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.1",
  "react-hook-form": "^7.57.0",
  "axios": "^1.9.0",
  "socket.io-client": "^4.8.1",
  "recharts": "^3.1.2",
  "@fortawesome/react-fontawesome": "^0.2.2",
  "@dnd-kit/core": "^6.3.1",
  "vite": "^6.3.5"
}
```

## 🐛 Rozwiązywanie Problemów

**Brak połączenia z API:**
- Sprawdź czy backend API jest uruchomiony na porcie 3000
- Zweryfikuj `VITE_API_URL` w `.env`
- Sprawdź CORS headers w backend

**WebSocket nie pracuje:**
- Sprawdź czy `VITE_WS_URL` wskazuje na backend
- Zweryfikuj czy Socket.IO jest uruchomiony na serwerze
- Sprawdź port 3000 w firewall

**Kody 2FA nie działają:**
- Sprawdzić czy zegar systemowy jest zsynchronizowany
- Spróbować innej aplikacji autentykacyjnej
- Sprawdzić logi backend dla błędów TOTP

## 📚 Dokumentacja

Dodatkowe informacje w dokumentacji projektu:
- [PROJEKT_API.md](../PROJEKT_API.md) - REST API endpoints
- [REALTIME_COMMUNICATION.md](../REALTIME_COMMUNICATION.md) - WebSocket i MQTT
- [diagrams/](../diagrams/) - Diagramy systemu

## 🤝 Integracja z Backend

Frontend komunikuje się z:
- **inzynierka-api** - Backend REST API + Socket.IO
- **PostgreSQL** - Dane użytkowników i pracowników (poprzez API)
- **MQTT** - Pośrednio (poprzez kontroler)
