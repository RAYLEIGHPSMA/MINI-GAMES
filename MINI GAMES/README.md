MINI GAMES — Project

This repository is a small collection of mini-games (templates).

Structure
- index.html — landing page
- style.css — root styles
- css/style.css — modern theme (glassmorphism)
- js/main.js — stage rendering, persistence, score API
- games/game1.html — sample Canvas game (Dodge)
- games/game2..game5.html — templates for more games

How to run
- Open `index.html` in a browser (no build required).
- The project uses `localStorage` to persist unlocked stages and best scores.

Extending
- Add `games/gameX.html` for additional games and follow the pattern used in `game1.html`.
- Use `window.setScore(stage, seconds)` to save a best time and unlock the next stage.
- Use `window.getScore(stage)` to read a saved score.
- Use `window.resetProgress()` to clear saved progress.

Notes
- The UI is responsive and uses glassmorphism styles in `css/style.css`.
- If you want all 15 games implemented, I can continue building them out (you choose which types).
