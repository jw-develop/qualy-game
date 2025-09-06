# Formula 1 Prediction Challenge

A web-based game where users predict the finishing order of 20 Formula 1 drivers for a race, save their predictions to Google Sheets, and later input actual results to calculate their score.

## Features

- **Phase 1: Make Predictions**
  - Interactive UI with 20 position slots organized into quartiles (1-5, 6-10, 11-15, 16-20)
  - Driver selection with team-colored dropdowns
  - Driver portraits displayed when selected
  - Smart dropdown management (selected drivers are removed from other dropdowns)
  - Save predictions to Google Sheets

- **Phase 2: Enter Results & Scoring**
  - Staged result entry (16-20, then 11-15, then 1-10)
  - Live score calculation with visual feedback
  - Scoring system:
    - **Exact Match**: 3 points (correct driver in correct position)
    - **Quartile Match**: 1 point (predicted driver finishes in same quartile)
    - **No Match**: 0 points
  - Export final results and scores to Google Sheets

- **Google Sheets Integration**
  - OAuth 2.0 authentication
  - Automatic sheet creation with date stamps
  - Export predictions and results with detailed scoring

## Installation & Setup

### Prerequisites
- A modern web browser
- Google Cloud Platform account (for Sheets API)
- GitHub account (for GitHub Pages deployment)

### Option 1: GitHub Pages Deployment (Recommended)

1. **Fork this repository on GitHub**
2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"
3. **The site will be automatically deployed to `https://yourusername.github.io/qualy-game`**

### Option 2: Local Development

1. **Clone/Download the project**
   ```bash
   cd qualy-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start a local server at `http://localhost:3000` and open the game in your browser.

### Google Sheets API Setup (Required for full functionality)

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable the Google Sheets API**
   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add your domains to authorized origins:
     - For local development: `http://localhost:3000`
     - For GitHub Pages: `https://yourusername.github.io`

4. **Get your API Key**
   - In "Credentials", click "Create Credentials" > "API Key"
   - Restrict the key to Google Sheets API

5. **Create a Google Spreadsheet**
   - Create a new Google Spreadsheet in your Google Drive
   - Copy the spreadsheet ID from the URL

6. **Update the configuration in `app.js`**
   ```javascript
   // Replace these values in the initializeGoogleSheetsAPI method:
   apiKey: 'YOUR_API_KEY_HERE',
   clientId: 'YOUR_CLIENT_ID_HERE',
   
   // And in the createSheetAndWriteData method:
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```

## How to Play

### Phase 1: Make Predictions
1. Select a driver for each of the 20 positions (P1 through P20)
2. Drivers are organized by team colors and portraits are shown when selected
3. Each driver can only be selected once
4. Click "Save Predictions" when all 20 positions are filled
5. Your predictions will be saved to Google Sheets

### Phase 2: Enter Results
1. Switch to the "Enter Results" phase
2. Your saved predictions will be displayed on the left
3. Enter actual race results in stages:
   - Start with positions 16-20, then submit
   - Continue with positions 11-15, then submit  
   - Finally enter positions 1-10 and submit final results
4. Watch your live score update after each stage
5. Export your final results and score to Google Sheets

## Scoring System

- **3 points**: Exact match (predicted P1: Verstappen, actual P1: Verstappen)
- **1 point**: Quartile match (predicted P3: Norris, actual P5: Norris - both in quartile 1-5)
- **0 points**: No match or different quartiles

**Quartiles:**
- Quartile 1: Positions 1-5
- Quartile 2: Positions 6-10  
- Quartile 3: Positions 11-15
- Quartile 4: Positions 16-20

## File Structure

```
qualy-game/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── drivers.js          # F1 driver data with team info and portraits
├── app.js             # Main application logic and Google Sheets integration
├── package.json        # Node.js dependencies and scripts
└── README.md          # This file
```

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **No frameworks**: Pure vanilla implementation as specified
- **APIs**: Google Sheets API for data export
- **Server**: Simple HTTP server for development

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server and open in browser  
- `npm run build` - No build process needed (vanilla JS)

### Customization

- **Drivers**: Update the `drivers` array in `drivers.js` to modify driver lineup
- **Styling**: Modify `styles.css` for visual customization
- **Scoring**: Adjust scoring logic in the `calculatePositionScore` method in `app.js`

## Browser Compatibility

- Chrome (recommended)
- Firefox  
- Safari
- Edge

Requires modern browser with ES6+ support.

## Troubleshooting

**Google Sheets not working?**
- Verify your API key and client ID are correctly set
- Check that your domain is authorized in Google Cloud Console
- Ensure the spreadsheet ID is correct and the sheet is accessible

**Local server issues?**
- Make sure Node.js is installed
- Try a different port: `npx http-server . -p 8080`
- Check for firewall/antivirus blocking

## License

MIT License - feel free to modify and distribute.