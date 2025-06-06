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
VITE_COMPANY_NAME="Grand Army of The Republic"
VITE_API_URL="http://localhost:3000"
```

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
│   │   └── LoginForm.jsx  # Formularz logowania
│   ├── employee/          # Zarządzanie pracownikami
│   │   ├── AddEmployeeForm.jsx    # Formularz dodawania pracownika
│   │   └── EmployeesList.jsx      # Lista pracowników z CRUD
│   ├── layout/            # Komponenty layoutu
│   │   ├── Menu.jsx       # Główne menu nawigacyjne
│   │   └── Footer.jsx     # Stopka aplikacji
│   └── users/             # Zarządzanie użytkownikami
│       ├── UpdatePassword.jsx     # Zmiana hasła
│       └── UpdatePhoneNumber.jsx  # Aktualizacja telefonu
├── pages/                 # Główne strony aplikacji
│   ├── Home.jsx           # Strona główna z logowaniem
│   ├── Dashboard.jsx      # Panel administracyjny
│   ├── Employees.jsx      # Zarządzanie pracownikami
│   ├── AccountSettings.jsx # Ustawienia konta użytkownika
│   ├── Statistics.jsx     # Statystyki (w rozwoju)
│   └── Logs.jsx           # Logi systemowe (w rozwoju)
├── contexts/              # React Context API
│   └── AuthContext.jsx    # Kontekst autoryzacji
├── hooks/                 # Custom React hooks
│   └── useAuth.js         # Hook do zarządzania autoryzacją
├── utils/                 # Narzędzia pomocnicze
│   └── axiosConfig.js     # Konfiguracja HTTP client
├── assets/                # Zasoby statyczne
│   ├── styles/            # Pliki CSS
│   └── Emblem_of_the_Galactic_Republic.svg # Logo aplikacji
├── App.jsx                # Główny komponent aplikacji
├── Layout.jsx             # Wrapper layoutu z warunkowaniem
├── Pages.jsx              # Definicje tras i routing
└── main.jsx               # Punkt wejścia aplikacji
```

## 🔐 Funkcjonalności

### Autoryzacja
- Formularz logowania z walidacją
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
- Zarządzanie danymi osobowymi

### Dashboard
- Panel administracyjny z przeglądem systemu
- Responsywne menu z dropdown użytkownika
- Ikony FontAwesome w całej aplikacji
- Motyw Galaktycznej Republiki (logo, stylizacja)

## 🔌 Konfiguracja API

Aplikacja komunikuje się z backend API przez Axios:
- Proxy deweloperskie: `/api` → `http://localhost:3000`
- Automatyczne ciasteczka: `withCredentials: true`
- Interceptory odpowiedzi: obsługa 401 Unauthorized

## 🎨 Stylowanie

- CSS modules dla komponentów
- FontAwesome dla ikon
- Ciemny motyw z paletą kolorów sci-fi
- Logo Galaktycznej Republiki jako główny element wizualny
