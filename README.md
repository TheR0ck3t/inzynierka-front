# Inżynierka Frontend

Aplikacja frontend do systemu zarządzania pracownikami - projekt inżynierski.

## 🚀 Technologie

- **React 19.1.0** - biblioteka UI
- **Vite 6.3.5** - bundler i dev server
- **React Router DOM 7.6.1** - routing
- **React Hook Form 7.57.0** - zarządzanie formularzami
- **Axios 1.9.0** - HTTP client
- **FontAwesome** - ikony

## 📋 Wymagania

- Node.js (v16 lub nowszy)
- npm lub yarn
- Backend API uruchomiony na porcie 3000

## 🛠️ Instalacja

1. Sklonuj repozytorium:
```bash
git clone <repository-url>
cd inzynierka-front
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skopiuj plik `.env.example` do `.env` i skonfiguruj zmienne środowiskowe:
```bash
VITE_COMPANY_NAME="Grand Army of the Republic"
```

## 🚀 Uruchomienie

### Tryb deweloperski
```bash
npm run dev
```
Aplikacja będzie dostępna na `http://localhost:5173`

### Budowanie produkcyjne
```bash
npm run build
```

### Podgląd buildu produkcyjnego
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Struktura projektu

```
src/
├── components/          # Komponenty wielokrotnego użytku
│   ├── auth/           # Komponenty autoryzacji
│   ├── employee/       # Komponenty zarządzania pracownikami
│   └── layout/         # Komponenty layoutu
├── pages/              # Strony aplikacji
├── contexts/           # React Context
├── hooks/              # Custom hooki
├── utils/              # Narzędzia pomocnicze
└── assets/             # Zasoby statyczne
    └── styles/         # Pliki CSS
```

## 🔐 Funkcjonalności

### Autoryzacja
- Logowanie użytkowników
- Ochrona tras wymagających uwierzytelnienia
- Zarządzanie sesjami

### Zarządzanie pracownikami
- Lista wszystkich pracowników
- Dodawanie nowych pracowników
- Edycja danych pracowników
- Usuwanie pracowników

### Ustawienia konta
- Zmiana hasła
- Aktualizacja danych osobowych
- Zarządzanie danymi kontaktowymi

### Dashboard
- Przegląd statystyk
- Szybki dostęp do głównych funkcji

## 🔌 Konfiguracja API

Aplikacja komunikuje się z backend API przez Axios. Konfiguracja znajduje się w:
- `src/utils/axiosConfig.js` - podstawowa konfiguracja
- Domyślny adres API: `http://localhost:3000/api`

## 🎨 Stylowanie

- CSS modules dla komponentów
- Responsywny design
- FontAwesome dla ikon
- Emblematy Galaktycznej Republiki jako motyw graficzny

## 📝 Zmienne środowiskowe

```bash
VITE_COMPANY_NAME="Nazwa firmy"  # Nazwa wyświetlana w aplikacji
```
