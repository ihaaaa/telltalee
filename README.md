# Tell-tale
# 🧠 Tell Tale – A Pixel Oracle for Mental Health

**byteMe's Submission for Pixel Palette Hackathon**

Tell-Tale is a pixel-art–inspired web experience that blends emotional expression with AI-powered feedback. Users enter a mystical cave, meet a mysterious oracle, and are invited to reflect on how they feel. Behind the scenes, powerful LLMs (like Gemini) analyze the user's text and return insights, comfort, or helpful resources — all through a gentle, interactive interface.

---

## 🌟 Features

- 🎮 Pixel-art like interface
- 💬 Journaling textbox with “oracle” character interaction
- 🤖 Real-time AI analysis via Gemini API
- 💡 Insightful emotional categorization (stress, sadness, burnout, etc.)
- 🧘‍♀️ Response with relevant advice, helplines, or emotional support
- ☁️ Firebase backend + Cloud Functions for serverless integration
- 🕊 Lightweight and minimalist for fast feedback

---

## 🛠 Tech Stack

- **Frontend**: Next.js, Tailwind CSS, TypeScript
- **Backend**: Firebase (Functions, Firestore), Netlify (Hosting)
- **AI Integration**: Gemini API via Cloud Function
- **Version Control**: Git & GitHub
- **Design**: Pixel-art style SVG assets & custom UI

---
🚧 Current Status
We’ve implemented the basic journaling → AI feedback loop and a minimal functional interface. The UI is being reworked into a more immersive pixel-art experience. 

🔮 Live Demo
https://telltale1.netlify.app
(There are some errors currently, the api isnt working properly and the background is gone)

📜 License
MIT License.


## 📦 How to Run Locally

```bash
git clone https://github.com/ihaaa/telltalee.git
cd tell-tale
npm install
npm run dev



