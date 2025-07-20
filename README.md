# <img src="public\icon.png" width="25" height="25"> Echo Grove

> **An Inclusive Sensory Exploration Adventure**

Discover mystical creatures hidden in an enchanted forest using your senses. Designed for all abilities with full accessibility support.

---

## 🌲 Overview
Echo Grove is a modern, accessible web game that invites players to explore a magical forest and discover five mystical creatures: Owl, Fox, Deer, Squirrel, and Phoenix. The game is designed to be fully inclusive, offering audio, visual, and multi-sensory feedback so everyone can play, regardless of ability.

- **Accessibility-first:** Audio, visual, and haptic feedback for all players
- **Multi-modal gameplay:** Choose your preferred sensory mode
- **Educational:** Learn fascinating facts about each creature
- **Beautiful UI:** Elegant, modern, and responsive design

---

## 🦉 Gameplay

### Modes
- **Audio-First:** Use spatial audio cues to locate creatures
- **Visual-First:** Watch for glowing patterns and visual feedback
- **Multi-Sensory:** Combine audio, visual, and haptic feedback for a rich experience

## 📈 Difficulty Progression

Each level introduces a new mystical creature and raises the challenge in subtle, immersive ways. Here's how the difficulty evolves:

| Level | Creature  | Core Challenge                                               | Distractions                     | Navigation Complexity       |
|-------|-----------|--------------------------------------------------------------|----------------------------------|-----------------------------|
| 1     | Owl       | Locate using clear, single-directional indicators            | Minimal                          | Linear, guided              |
| 2     | Fox       | Identify amidst one false cue                                | One distractor introduced        | Simple branching            |
| 3     | Deer      | Pinpoint among moving elements                               | Multiple dynamic distractors     | Open-ended path             |
| 4     | Squirrel  | Search with overlapping zones of interest                    | Decoy areas and mimicking cues   | Complex forest grid         |
| 5     | Phoenix   | Discover with no initial clues; pattern learning required    | Rapidly changing misleads        | Maze-like structure         |

---

## ♿ Accessibility Features
- **Audio cues:** Spatial sound, pitch, and volume indicate proximity
- **Visual cues:** Glowing areas, color changes, and patterns
- **Haptic feedback:** Vibration patterns for supported devices
- **TalkBack narration:** Full support for screen readers
- **Keyboard & mouse:** Playable with either input
- **Color contrast:** Carefully chosen palette for visibility

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production
```bash
npm run build
```

---

## 🗂️ Project Structure
```
project/
├── public/
│   └── sounds/ambient, creatures
├── src/
│   ├── components/
│   │   ├── accessibility/
│   │   ├── CreatureFactBox.tsx
│   │   ├── GameComplete.tsx
│   │   ├── GameEngine.tsx
│   │   ├── LevelIntro.tsx
│   │   ├── Menu.tsx
│   │   ├── ProximityEngine.tsx
│   ├── data/creatures.ts
│   ├── hooks/
│   ├── types/GameTypes.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── ...
```

---

## ✨ Key Technologies
- **React** (TypeScript)
- **Vite** (fast dev/build)
- **Tailwind CSS** (modern styling)
- **Web Audio API** (spatial sound)
- **Custom hooks** for audio, haptics, and accessibility

---

## 🧩 How It Works
- **GameEngine:** Core logic for levels, feedback, and progression
- **ProximityEngine:** Calculates distance and triggers feedback
- **CreatureFactBox:** Displays fun facts and narration
- **Accessibility Modes:** Switch between audio, visual, and multi-sensory play
- **LevelIntro & GameComplete:** Beautiful transitions and summaries

---

## 🌍 Educational Value
Each creature comes with unique facts, revealed as you discover them. Echo Grove is perfect for classrooms, therapy, or anyone interested in accessible game design.

---

## 🛠️ Customization
- **Add new creatures:** Edit `src/data/creatures.ts`
- **Change feedback:** Tweak `ProximityEngine.tsx` and hooks
- **Style:** Modify `index.css` and Tailwind config

---

## 🧑‍💻 Contributing
We welcome contributions! Please open issues or pull requests for:
- New accessibility features
- Additional creatures or facts
- Bug fixes and improvements

---

## 📄 License
GNU Lesser General Public License v2.1 . See [LICENSE](LICENSE) for details.

---

## 💬 Credits & Inspiration
- Designed and developed by trinity
- Trinity:
      - [Aromal RM](https://github.com/aromal-rm)
      - [Aron Mathew Tom](https://github.com/amtom2004)
      - [Devanand M S](https://github.com/dms2004)
- Inspired by inclusive design principles and the magic of nature

---

## 🪄 Try It Now
> **Ready to explore Echo Grove?**
>
> [Begin Your Adventure](https://carehack-trinity.vercel.app/)

---

## 🙌 Thank You
Echo Grove was created to celebrate diversity and inclusion in games. We hope you enjoy your journey!

---
