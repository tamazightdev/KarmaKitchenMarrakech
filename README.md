# Karma Kitchen Marrakech - AI Content Generator

A sophisticated AI-powered content generation tool designed specifically for the **Karma Kitchen Marrakech** project (launching 2026). This application emulates the specific writing style of Seth Godin mixed with the philosophy of the Gift Economy to generate daily blog posts ("Daily Riffs") and extensive content calendars.

## ✨ Key Features

### 1. Daily Riff Generator
*   **Seth Godin Persona:** Generates 3 distinct, punchy, and counter-intuitive blog posts based on a single topic.
*   **Context Aware:** Deeply integrated with the Karma Kitchen "4 Cs Framework" (Community, Connection, Culture, Contribution).
*   **Iterative Refinement:** Includes a **Chat Interface** below results, allowing users to "riff" with the AI to tweak tone, add metaphors, or adjust specific sections (e.g., "Make the second post more playful").

### 2. Content Calendar Mode
*   **Long-form Planning:** Generate full content schedules for **7, 14, 21, or 30 days**.
*   **Thematic Consistency:** Maintains a narrative arc across multiple days based on a central theme.
*   **Export Options:**
    *   **Copy All:** Formats the entire calendar for easy pasting into Google Docs or Notion.
    *   **Download PDF:** Generates a clean, print-ready PDF of the schedule.

### 3. Storage & Integration
*   **Local Database:** Uses **IndexedDB** to save your favorite riffs locally within the browser. access them anytime via the "Saved Riffs" menu.
*   **Google Drive Integration:** Connects directly to your Google account to save posts as Google Docs (requires a Google Cloud Client ID).

### 4. Smart Formatting
*   **Copy-Paste Optimized:** ensuring text is copied with correct double-line spacing for standard word processors.
*   **Grounding:** Automatically cites sources if the AI uses Google Search to research a topic.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **AI:** Google Gemini API (`gemini-3-pro-preview` & `gemini-2.5-flash`) via `@google/genai` SDK
*   **Storage:** `idb` (IndexedDB wrapper) for local storage
*   **Integration:** Google Identity Services & Drive API

## 🚀 Getting Started

### Prerequisites

1.  **Gemini API Key:** Get one at [aistudio.google.com](https://aistudiocdn.com/aistudio.google.com).
2.  *(Optional)* **Google Client ID:** Required only for the "Save to Drive" feature. Create one in the Google Cloud Console with the `https://www.googleapis.com/auth/drive.file` scope.

### Usage

1.  **Enter Credentials:** Click the **Settings (Gear Icon)** in the top right. Enter your Gemini API Key.
2.  **Select Mode:**
    *   **Daily Riff:** Perfect for quick inspiration. Enter a topic like "The Trust of the Empty Check".
    *   **Content Calendar:** Perfect for planning. Select a duration (7-30 days) and a theme like "The 7 Principles of Giving".
3.  **Generate:** Click "Riff" or "Plan".
4.  **Refine:** Use the text box below the results to tweak the output.
5.  **Save:** Click the "Save" icon to store locally, or the "Drive" icon to send to Google Drive.

## 🎨 Design

The UI features a "Marrakech Glassmorphism" aesthetic:
*   **Color Palette:** Deep ochres, teals, and warm oranges inspired by Moroccan architecture.
*   **Typography:** *Merriweather* for headlines (evoking a literary feel) and *Inter* for readability.
*   **Animation:** Subtle, organic background blobs to create a feeling of movement and life.

---

*Built for the Gift Economy.*
