# 🛕 Virtual Temple – A Spiritual Open World

<p align="center">
  <strong>Walk. Explore. Pray. Connect. Experience.</strong>
</p>

<p align="center">
  An immersive, browser-based virtual world inspired by Indian temples and everyday life.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Web-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Game%20Engine-Phaser%203-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge" />
</p>

---

## 🌸 About the Project

**Virtual Temple** is an immersive 2D open-world browser game that combines spirituality, exploration, social interaction and everyday experiences in a beautifully designed virtual Indian environment.

Imagine entering a beautifully decorated Krishna temple, offering prayers, chanting a 108-bead mala, meditating, and spending time with other devotees.

After visiting the temple, you can walk outside, explore a traditional Indian town, visit local shops, purchase products using virtual currency, wait for a bus and travel back to your virtual home.

The goal is to create a peaceful digital world where people can experience devotion, explore their surroundings and eventually interact with others in real time.

This is more than a traditional temple website. It is an attempt to create a living virtual world.

## ✨ Core Experience

The complete gameplay journey:

**Enter Temple → Explore → Pray → Exit → Explore Town → Visit Shops → Shop → Bus Stand → Board Bus → Travel → Reach Home**

---

## 🛕 1. Virtual Krishna Temple

Enter a beautifully designed temple inspired by traditional ISKCON Krishna temples.

### Temple Environment

- Radha-Krishna deity altar with traditional decorations.
- Dedicated Garbhagriha (sanctum).
- Decorative golden railings and restricted deity area.
- Permanent Pujari (temple priest) NPC.
- Marble flooring and traditional temple architecture.
- Flower decorations, garlands, bells and diyas.
- Peaceful lighting and ambient atmosphere.

### Spiritual Activities

- **Chant Mala:** Complete a 108-bead chanting session.
- **Pray:** Offer personal prayers.
- **Meditate:** Experience peaceful meditation sessions.
- **Light Diya:** Offer a virtual lamp.
- **Darshan:** Stand before Radha-Krishna and offer Namaste.
- **Kirtan:** Participate in group chanting activities.

### Temple Exploration

- Freely walk around the temple.
- Explore different temple areas.
- Sit in designated prayer and meditation zones.
- Interact with temple visitors.
- Experience a dedicated temple exit leading to the outside world.

## 🏘️ 2. Indian Town Exploration

The temple is part of a larger explorable Indian town.

After leaving the temple, visitors can explore a traditional neighbourhood.

### Environment

- Indian streets and roads.
- Footpaths and buildings.
- Streetlights and trees.
- Local shops and markets.
- Pedestrian NPCs.
- Benches and public spaces.
- Bus stops and transportation facilities.

The world is designed to provide a continuous exploration experience using player movement and camera scrolling.

## 🏪 3. Interactive Shopping System

Explore local shops and interact with shopkeepers.

### Planned Shops

| Shop | Example Products |
|---|---|
| Grocery Store | Rice, flour, milk, sugar, biscuits |
| Flower Shop | Roses, garlands, lotus, bouquets |
| Sweet Shop | Ladoo, jalebi, barfi, pedha |
| Tea Stall | Tea and refreshments |
| Fruit Shop | Seasonal fruits |
| General Store | Daily-use products |

### Shopping Features

- Approach a shop to interact.
- View available products.
- Check product prices.
- Select product quantities.
- Add items to cart.
- Calculate total purchase amount.
- Purchase using virtual currency.
- Save purchased items in personal inventory.

All transactions are virtual and do not involve real money.

## 🚌 4. Public Transportation System

Explore the town and reach a designated bus stand.

### Bus Stand Features

- Traditional Indian bus stop.
- Waiting shelter and benches.
- Bus arrival countdown.
- Mock passengers.
- Bus driver NPC.
- Bus route information.

### Bus Journey

1. Reach the bus stand.
2. Wait for the bus.
3. Watch the bus arrive.
4. Select the boarding option.
5. Enter the bus.
6. Experience the virtual journey.
7. Reach the residential destination.
8. Get off the bus.

The initial version uses a simulated bus schedule and journey.

## 🏠 5. Home Destination

The final destination of the journey is the player's virtual home.

After reaching home:

- The bus stops at the designated location.
- The player gets off.
- A residential neighbourhood is displayed.
- The player receives a journey completion message.

**Welcome Home!**

A journey summary displays the player's activities, shopping history and completed journey.

---

## 🎮 Gameplay Controls

| Action | Control |
|---|---|
| Move Up | W / ↑ |
| Move Down | S / ↓ |
| Move Left | A / ← |
| Move Right | D / → |
| Interact | E |
| Explore | Mouse / Keyboard |
| Mobile Movement | On-screen joystick |

Controls may vary slightly depending on the implemented game interface.

---

## 🛠️ Technology Stack

The project uses modern web technologies to create an interactive browser-based game.

| Technology | Purpose |
|---|---|
| React.js | User interface |
| Vite | Development environment and build tool |
| JavaScript | Application and game logic |
| Phaser 3 | 2D game engine |
| Tailwind CSS | UI styling |
| Framer Motion | Interface animations |
| Lucide React | Icons |
| LocalStorage | Local visitor data and progress |
| Supabase Realtime | Planned real-time multiplayer |

---

## 🏗️ Project Architecture

The application separates the game environment from the surrounding React interface.

```text
virtual-temple/
│
├── public/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.jsx
│   │   ├── GameInterface.jsx
│   │   ├── PlayerHUD.jsx
│   │   ├── InteractionMenu.jsx
│   │   ├── MalaChanting.jsx
│   │   ├── PrayerModal.jsx
│   │   └── Settings.jsx
│   │
│   ├── game/
│   │   ├── scenes/
│   │   │   ├── TempleScene.js
│   │   │   ├── TownScene.js
│   │   │   ├── ShoppingStreetScene.js
│   │   │   ├── BusStandScene.js
│   │   │   ├── BusJourneyScene.js
│   │   │   └── HomeScene.js
│   │   │
│   │   ├── entities/
│   │   │   ├── Player.js
│   │   │   ├── MockVisitor.js
│   │   │   ├── PujariNPC.js
│   │   │   ├── ShopkeeperNPC.js
│   │   │   ├── PedestrianNPC.js
│   │   │   └── Bus.js
│   │   │
│   │   ├── systems/
│   │   │   ├── MovementSystem.js
│   │   │   ├── CollisionSystem.js
│   │   │   ├── CameraSystem.js
│   │   │   ├── SittingSystem.js
│   │   │   ├── InteractionSystem.js
│   │   │   ├── ShopSystem.js
│   │   │   ├── InventorySystem.js
│   │   │   └── JourneyManager.js
│   │   │
│   │   └── data/
│   │       ├── shops.js
│   │       ├── products.js
│   │       ├── busRoutes.js
│   │       └── templeConfig.js
│   │
│   ├── hooks/
│   ├── utils/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── index.html
├── package.json
└── README.md
```

*The directory structure represents the intended modular architecture and may evolve during development.*

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (18 or later recommended).
- npm.
- Git.
- A modern web browser.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/virtual-temple.git
```

### 2. Navigate to the project

```bash
cd virtual-temple
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open in your browser

```text
http://localhost:5173
```

---

## 💾 Data Management

The initial version is designed to work without a traditional database or backend.

### LocalStorage

Browser LocalStorage is used to maintain:

- Visitor name.
- Total temple visits.
- Completed malas.
- Total beads chanted.
- Meditation history.
- Diyas offered.
- Virtual wallet balance.
- Purchased products.
- Inventory.
- Game preferences.
- Journey progress.

This makes it possible to test the complete experience without requiring user authentication or database infrastructure.

### Future Multiplayer Architecture

Supabase Realtime is planned for the multiplayer version.

Potential capabilities include:

- Real-time player presence.
- Shared player movement.
- Sitting beside other players.
- Shared temple activities.
- Nearby player interactions.
- Live chat.
- Group chanting.

The multiplayer implementation will be introduced separately from the initial local game experience.

---

## 🗺️ Development Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Welcome screen and visitor name | 🟡 In development |
| 2 | Krishna temple environment | 🟡 In development |
| 3 | Player movement and collision | 🟡 In development |
| 4 | Radha-Krishna altar and Pujari NPC | 🟡 In development |
| 5 | Mala, prayer and meditation | 🟡 In development |
| 6 | Temple exit and town environment | 🔵 Planned |
| 7 | Interactive local shops | 🔵 Planned |
| 8 | Virtual wallet and inventory | 🔵 Planned |
| 9 | Bus stand and bus simulation | 🔵 Planned |
| 10 | Home destination and journey completion | 🔵 Planned |
| 11 | Supabase multiplayer | 🔵 Planned |
| 12 | Group interactions and live chat | 🔵 Planned |

Legend:

- 🟢 Completed
- 🟡 In development
- 🔵 Planned

---

## 🔮 Future Vision

The long-term goal is to develop Virtual Temple into a shared online world.

Future possibilities include:

- Multiple Krishna temples and spiritual destinations.
- Real-time multiplayer exploration.
- Visitors from different parts of the world.
- Sitting and praying together.
- Group mala chanting.
- Live aarti and kirtan sessions.
- Proximity-based conversations.
- Shared town exploration.
- More shops and interactive activities.
- Multiple transportation routes.
- Customizable homes and avatars.
- Special festival environments such as Janmashtami and Holi.

The vision is to create a living digital environment where spirituality and everyday virtual experiences coexist.

---

## 🤝 Contributing

Contributions, ideas and suggestions are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your implementation.
5. Submit a Pull Request.

Please maintain the existing project architecture and avoid introducing unnecessary dependencies.

---

## 📌 Project Status

Virtual Temple is currently an experimental project under active development.

The initial focus is on creating a functional single-player experience with a temple, town exploration, interactive shops and a bus journey.

Real-time multiplayer and persistent online services are planned for future releases.

---

## ❤️ Project Philosophy

> Technology can connect people beyond physical boundaries. What if it could also give people a peaceful place to pause, pray, explore and connect?

**Virtual Temple – A place where devotion meets the digital world.**

---

<p align="center">
  🛕 Made with ❤️ and devotion.
</p>
