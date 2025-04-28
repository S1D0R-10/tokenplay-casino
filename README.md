# TokenPlay Casino 🎰

**TokenPlay Casino** to responsywna, jednostronicowa aplikacja pokazująca, jak można zbudować mini-kasyno oparte w 100 % na technologiach front-endowych. Projekt powstał w ramach zajęć z Grafiki Komputerowej i ma charakter demonstracyjny – nie obsługuje prawdziwych pieniędzy ani kryptowalut.  
Nadrzędnym celem było połączenie atrakcyjnej oprawy graficznej z czystą architekturą React + Vite.

---

## Funkcjonalności 🚀
* **Pięć gier** działających całkowicie w przeglądarce: Blackjack, Mines, Tower, Wheel oraz Coinflip  [oai_citation:0‡GitHub](https://github.com/S1D0R-10/tokenplay-casino/blob/main/src/main.jsx)  
* Wbudowany **wirtualny portfel** – saldo użytkownika przechowywane w `useState`, bez backendu  
* Płynne **animacje i HMR** (Hot Module Reload) dzięki Vite  
* Layout mobilny i desktopowy z Tailwind CSS  
* Prosty **context** dla globalnego stanu (`MockUserCtx`)  
* Konfiguracja ESLint + Prettier – automatyczne formatowanie przy commitach

---

## Stos technologiczny 🛠
| Warstwa | Narzędzie / wersja |
|---------|--------------------|
| Framework UI | **React 19** |
| Bundler + dev-server | **Vite 6** |
| Stylowanie | **Tailwind CSS 4** |
| Routing | **React-Router 7** |
| Ikony | **lucide-react** |
| Talia kart | **@letele/playing-cards** |
| Linting | ESLint 9 |  
Źródło wersji: `package.json`  [oai_citation:1‡GitHub](https://github.com/S1D0R-10/tokenplay-casino/blob/main/package.json)

---

## Szybki start 🏃‍♂️

> **Wymagania**: Node 18 + / npm 9 +

```bash
git clone https://github.com/S1D0R-10/tokenplay-casino.git
cd tokenplay-casino
npm install           # pobiera zależności
npm run dev           # uruchamia środowisko developerskie (localhost:5173 domyślnie)