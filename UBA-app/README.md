# AI Behavior Analysis App (UBA)

This React Native app analyzes user step counts and carbon reduction activities to provide realistic, strict AI feedback using Google Gemini API. The app is designed for Expo Go and uses TypeScript.

## Features
- **Activity Logging**: Enter daily steps and carbon reduction actions
- **AI Feedback**: Get realistic, strict feedback (not just positive encouragement)
- **Simple UI**: Minimal, mobile-friendly interface

## Getting Started

### 1. Clone the Project
```bash
git clone <repository-url>
cd UBA-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Gemini API Key
- Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Replace `YOUR_GEMINI_API_KEY` in `App.tsx` with your actual API key

### 4. Run the App
```bash
npx expo start
```
- Scan the QR code with Expo Go on your mobile device

## Usage
1. Set your Gemini API key in the code
2. Log your daily steps and carbon reduction activities
3. Tap "Get AI Feedback" to receive realistic, strict feedback

## File Structure
```
UBA-app/
├── App.tsx            # Main app component (UI, logic)
├── gptService.ts      # Gemini API service (realistic feedback only)
├── prompts.ts         # Realistic/strict feedback prompt template
├── styles.ts          # All style definitions
├── types.ts           # Type definitions (UserActivity, Feedback)
├── package.json       # Project config and dependencies
├── package-lock.json  # Dependency lock file
├── tsconfig.json      # TypeScript config
├── app.json           # Expo config
├── index.ts           # App entry point
├── .gitignore         # Git ignore file
├── assets/            # App icons, images
└── node_modules/      # Dependencies
```

## Tech Stack
- **React Native** (Expo)
- **TypeScript**
- **Google Gemini API**

## License
MIT 