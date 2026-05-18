# Inżynierka Frontend

Aplikacja frontend do systemu zarządzania pracownikami - **projekt stworzony w ramach pracy inżynierskiej**.

## 📚 O Projekcie

Frontend będący częścią zaawansowanego systemu do zarządzania dostępem pracowników z integracją RFID, komunikacji MQTT i obsługą dwuskładnikowej autoryzacji (2FA).

## 🎯 Główne Funkcjonalności

- 🔐 Autoryzacja z 2FA (TOTP)
- 👥 Zarządzanie pracownikami (CRUD)
- 🃏 Enrolowanie i zarządzanie kartami RFID
- 📊 Logi dostępu w real-time

## 💻 Tech Stack

### Podstawowe
- **React 19.1.0** - biblioteka do budowania interfejsu
- **Vite 6.3.5** - bundler i serwer deweloperski
- **React Router 7.6.1** - routing aplikacji
- **React Hook Form 7.57.0** - zarządzanie formularzami
- **Axios 1.9.0** - HTTP client
- **Socket.IO Client 4.8.1** - komunikacja real-time

### Interfejs i Wizualizacja
- **FontAwesome 6.7.2** - ikony (liniowe, zwykłe, marki)
- **Recharts 3.1.2** - interaktywne wykresy
- **@dnd-kit 6.3.1** - drag and drop
- **ESLint 9.25.0** - sprawdzenie jakości kodu

## 📥 Instalacja

### Wymagania
- Node.js (wersja 16+)
- npm lub yarn
- Uruchomiony backend API (inzynierka-api) na porcie 3000

### Kroki instalacji

1. Klonowanie repozytorium:
```bash
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
```

Edytuj `.env` i ustaw:
```
VITE_COMPANY_NAME="Nazwa twojej firmy"
VITE_API_URL=http://localhost:3000
```

4. Konfiguracja Vite (opcjonalnie):
```bash
cp vite.config.js.template vite.config.js
```

Plik `vite.config.js.template` zawiera zalecane ustawienia dla:
- ✅ Aliasów ścieżek (`@/`, `@components`, etc.)
- ✅ Proxy dla API i WebSocket
- ✅ Optymalizacji build'u

Edytuj `vite.config.js` jeśli potrzebujesz dostosować konfigurację do swoich potrzeb.

## 🚀 Uruchomienie

### Serwer deweloperski
```bash
npm run dev
```

### Budowanie dla produkcji
```bash
npm run build
```

### Podgląd produkcyjny
```bash
npm run preview
```

### Sprawdzenie kodu
```bash
npm run lint
```



## 📁 Struktura Projektu

```
src/
├── components/            # Komponenty React
│   ├── auth/              # Komponenty autoryzacji
│   │   └── TwoFaModal.jsx  # Modal 2FA do wprowadzania kodów TOTP
│   ├── employee/          # Zarządzanie pracownikami
│   │   ├── EmployeeForm.jsx
│   │   └── EmployeeList.jsx
│   ├── users/             # Zarządzanie użytkownikami
│   │   └── UpdatePassword.jsx     # Zmiana hasła
│   ├── Dashboard.jsx      # Panel administracyjny
│   └── Employees.jsx      # Zarządzanie pracownikami
├── contexts/              # React Context API
│   └── AuthContext.jsx    # Kontekst autoryzacji (z obsługą 2FA)
├── assets/                # Zasoby statyczne
│   ├── styles/            # Pliki CSS
│   └── images/
├── utils/                 # Funkcje pomocnicze
│   ├── axiosConfig.js     # Konfiguracja Axios
│   └── validators.js      # Walidatory
├── Layout.jsx             # Wrapper layoutu z warunkowaniem
├── Pages.jsx              # Definicje tras i routing
├── App.jsx                # Główny komponent aplikacji
└── main.jsx               # Punkt wejścia aplikacji
```

## 🔐 Bezpieczeństwo

- JWT w ciasteczkach z automatycznym odświeżaniem
- Ochrona tras - automatyczne przekierowanie użytkowników niezalogowanych
- Automatyczne wylogowanie przy odpowiedzi 401 (sesja wygasła)
- Obsługa 2FA (Time-based One-Time Password - TOTP)

## 📋 Szczegółowe Funkcjonalności

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

## 🎨 Stylowanie i Projekt

- **Moduły CSS** dla komponentów
- **Ikony FontAwesome** (liniowe, zwykłe, marki)
- **Recharts** dla interaktywnych wykresów
- Ciemny motyw naukowy
- Logo Galaktycznej Republiki
- Responsywny projekt (mobile-first)
- Animacje CSS

## 🔧 Zmienne Środowiskowe

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `VITE_COMPANY_NAME` | Nazwa organizacji | `Galactic Republic` |
| `VITE_EMPLOYEE` | Nazwa pracownika (singular) | `Clone Trooper` |
| `VITE_API_URL` | URL backend API | `http://localhost:3000` |

## 📦 Pełna Lista Zależności

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

## ⚙️ Konfiguracja Vite

Plik `vite.config.js.template` zawiera zalecaną konfigurację dla środowiska deweloperskiego:

```javascript
// Główne elementy konfiguracji:
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',    // REST API
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    },
    '/socket.io': {
      target: 'http://localhost:3001',    // WebSocket
      changeOrigin: true,
      ws: true
    }
  }
}
```

**⚠️ Ważne - Wdrażanie w Produkcji:**

Po zbundlowaniu aplikacji (`npm run build`), **konfiguracja proxy z vite.config.js nie jest używana**. W produkcji należy skonfigurować serwer frontendowy (np. **Nginx**, Apache, etc.) do proxy'owania żądań:

**Przykład konfiguracji Nginx:**
```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/dist;

  # Proxy dla API
  location /api/ {
    proxy_pass http://backend-api:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # Proxy dla WebSocket
  location /socket.io {
    proxy_pass http://backend-api:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

  # React Router - fallback na index.html
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 🐛 Rozwiązywanie Problemów

**Brak połączenia z API:**
- Sprawdź czy backend API jest uruchomiony na porcie 3000
- Zweryfikuj `VITE_API_URL` w `.env`
- Sprawdź CORS headers w backend

**WebSocket nie pracuje:**
- Zweryfikuj czy Socket.IO jest uruchomiony na serwerze
- Sprawdź port 3000 w firewall
- Zweryfikuj CORS ustawienia dla WebSocket

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

