# Inżynierka Frontend

Aplikacja frontend do systemu zarządzania pracownikami - projekt inżynierski.

## 🚀 Technologie

- **React 19.1.0** - biblioteka UI
- **Vite 6.3.5** - bundler i dev server
- **React Router DOM 7.6.1** - routing aplikacji
- **React Hook Form 7.57.0** - zarządzanie formularzami
- **Axios 1.9.0** - HTTP client do komunikacji z API
- **FontAwesome 6.7.2** - ikony i symbole
- **ESLint 9.25.0** - linting kodu

## 📋 Wymagania

- Node.js (v16 lub nowszy)
- npm lub yarn
- Uruchomiony backend API

## 🛠️ Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/TheR0ck3t/inzynierka-front.git
cd inzynierka-front
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skopiuj plik `.env.example` do `.env` i skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env
```

Następnie edytuj plik `.env` zgodnie z twoją konfiguracją:
```bash
# Przykładowa konfiguracja
VITE_COMPANY_NAME="Wielka Armia Republiki"
VITE_EMPLOYEE="Klon"
VITE_API_URL="http://localhost:3000"
```

### Zmienne środowiskowe
- `VITE_COMPANY_NAME` - nazwa firmy/organizacji wyświetlana w aplikacji
- `VITE_EMPLOYEE` - nazwa dla pracowników (np. "Klon", "Pracownik")
- `VITE_API_URL` - adres URL backend API

## 🚀 Uruchomienie

### Tryb deweloperski
```bash
npm run dev
```

### Tryb produkcyjny
```bash
npm run build
```

Aplikacja będzie dostępna na `http://localhost:5173`

## 📁 Struktura projektu

```
src/
├── components/             # Komponenty wielokrotnego użytku
│   ├── auth/              # Komponenty autoryzacji
│   │   ├── LoginForm.jsx  # Formularz logowania
│   │   └── TwoFaModal.jsx # Modal 2FA do wprowadzania kodów TOTP
│   ├── employee/          # Zarządzanie pracownikami
│   │   ├── AddEmployeeForm.jsx    # Formularz dodawania pracownika
│   │   └── EmployeesList.jsx      # Lista pracowników z CRUD
│   ├── layout/            # Komponenty layoutu
│   │   ├── Menu.jsx       # Główne menu nawigacyjne
│   │   └── Footer.jsx     # Stopka aplikacji
│   └── users/             # Zarządzanie użytkownikami
│       ├── UpdatePassword.jsx     # Zmiana hasła
│       ├── UpdatePhoneNumber.jsx  # Aktualizacja telefonu
│       └── Manage2FA.jsx          # Zarządzanie 2FA (QR kody, włączanie/wyłączanie)
├── pages/                 # Główne strony aplikacji
│   ├── Home.jsx           # Strona główna z logowaniem
│   ├── Dashboard.jsx      # Panel administracyjny
│   ├── Employees.jsx      # Zarządzanie pracownikami
│   ├── AccountSettings.jsx # Ustawienia konta użytkownika
│   ├── Statistics.jsx     # Statystyki (w rozwoju)
│   ├── Logs.jsx           # Logi systemowe (w rozwoju)
│   └── Error404.jsx       # Strona błędu 404
├── contexts/              # React Context API
│   └── AuthContext.jsx    # Kontekst autoryzacji (z obsługą 2FA)
├── hooks/                 # Custom React hooks
│   └── useAuth.js         # Hook do zarządzania autoryzacją
├── utils/                 # Narzędzia pomocnicze
│   └── axiosConfig.js     # Konfiguracja HTTP client
├── assets/                # Zasoby statyczne
│   ├── styles/            # Pliki CSS
│   │   ├── TwoFAModal.css # Style dla modala 2FA
│   │   └── ...inne pliki CSS
│   └── Emblem_of_the_Galactic_Republic.svg # Logo aplikacji
├── App.jsx                # Główny komponent aplikacji
├── Layout.jsx             # Wrapper layoutu z warunkowaniem
├── Pages.jsx              # Definicje tras i routing
└── main.jsx               # Punkt wejścia aplikacji
```

## 🔐 Funkcjonalności

### Autoryzacja
- Formularz logowania z walidacją
- **2FA (TOTP)**: obsługa dwuskładnikowej autoryzacji z kodami czasowymi
- **Modal 2FA**: responsywny modal do wprowadzania kodów 2FA podczas logowania
- JWT w ciasteczkach z automatycznym odświeżaniem
- Ochrona tras - przekierowanie niezalogowanych użytkowników
- Automatyczne wylogowanie przy wygaśnięciu sesji (401)

### Zarządzanie pracownikami
- Lista pracowników z danymi podstawowymi i ID karty
- Dodawanie nowych pracowników (imię, nazwisko, data urodzenia, data zatrudnienia)
- Usuwanie pracowników z potwierdzeniem
- Edycja danych (w rozwoju)
- Walidacja formularzy z komunikatami błędów

### Ustawienia konta
- Zmiana hasła z weryfikacją starego hasła
- Aktualizacja numeru telefonu
- **Zarządzanie 2FA**: włączanie/wyłączanie dwuskładnikowej autoryzacji
- **QR kody**: automatyczne generowanie kodów QR dla aplikacji autentykacyjnych
- Zarządzanie danymi osobowymi

### Dashboard
- Panel administracyjny z przeglądem systemu
- Responsywne menu z dropdown użytkownika
- Ikony FontAwesome w całej aplikacji
- Motyw Galaktycznej Republiki (logo, stylizacja)

## 🔐 Dwuskładnikowa autoryzacja (2FA)

Frontend obsługuje TOTP (Time-based One-Time Password) w pełnej integracji z backendem:

### Proces logowania z 2FA
1. Użytkownik wprowadza email i hasło w `LoginForm`
2. Jeśli 2FA jest włączone, wyświetla się `TwoFaModal`
3. Użytkownik wprowadza 6-cyfrowy kod z aplikacji autentykacyjnej
4. Po weryfikacji następuje automatyczne przekierowanie do dashboardu

### Zarządzanie 2FA
- Komponent `Manage2FA` w ustawieniach konta
- Generowanie kodów QR do skanowania w aplikacjach (Google Authenticator, Authy)
- Włączanie/wyłączanie 2FA z weryfikacją kodów testowych
- Responsywny design z animacjami CSS

### Bezpieczeństwo
- Modal 2FA nie można zamknąć bez podania kodu lub anulowania logowania
- Automatyczna walidacja formatu kodu (6 cyfr)
- Obsługa błędów z odpowiednimi komunikatami użytkownika
- Brak logowania wrażliwych danych 2FA w konsoli

## 🔌 Konfiguracja API

Aplikacja komunikuje się z backend API przez Axios:
- Proxy deweloperskie: `/api` → `http://localhost:3000`
- Automatyczne ciasteczka: `withCredentials: true`
- Interceptory odpowiedzi: obsługa 401 Unauthorized i błędów 2FA

## 🎨 Stylowanie

- CSS modules dla komponentów
- FontAwesome dla ikon
- Ciemny motyw z paletą kolorów sci-fi
- Logo Galaktycznej Republiki jako główny element wizualny
