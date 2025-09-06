class F1PredictionGame {
    constructor() {
        this.predictions = {};
        this.actualResults = {};
        this.totalScore = 0;
        this.currentStage = 'predictions';
        
        this.init();
    }

    init() {
        this.setupPhaseToggle();
        this.populateDropdowns();
        this.setupEventListeners();
        this.updateSaveButtonState();
    }

    setupPhaseToggle() {
        const predictionBtn = document.getElementById('prediction-btn');
        const resultsBtn = document.getElementById('results-btn');
        const predictionPhase = document.getElementById('prediction-phase');
        const resultsPhase = document.getElementById('results-phase');

        predictionBtn.addEventListener('click', () => {
            predictionBtn.classList.add('active');
            resultsBtn.classList.remove('active');
            predictionPhase.classList.add('active');
            resultsPhase.classList.remove('active');
        });

        resultsBtn.addEventListener('click', () => {
            resultsBtn.classList.add('active');
            predictionBtn.classList.remove('active');
            resultsPhase.classList.add('active');
            predictionPhase.classList.remove('active');
            this.loadPredictionsToResultsPhase();
        });
    }

    populateDropdowns() {
        const dropdowns = document.querySelectorAll('.driver-dropdown, .result-dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.innerHTML = '<option value="">Select driver...</option>';
            drivers.forEach(driver => {
                const option = document.createElement('option');
                option.value = driver.id;
                option.textContent = `${driver.firstName} ${driver.lastName}`;
                option.style.backgroundColor = driver.teamColor;
                option.style.color = 'white';
                dropdown.appendChild(option);
            });
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.driver-dropdown').forEach(dropdown => {
            dropdown.addEventListener('change', (e) => this.handlePredictionChange(e));
        });

        document.getElementById('save-predictions-btn').addEventListener('click', () => {
            this.savePredictions();
        });

        document.querySelectorAll('.result-dropdown').forEach(dropdown => {
            dropdown.addEventListener('change', (e) => this.handleResultChange(e));
        });

        document.querySelectorAll('.stage-submit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleStageSubmit(e));
        });

        document.getElementById('export-results-btn').addEventListener('click', () => {
            this.exportToGoogleSheets();
        });
    }

    handlePredictionChange(e) {
        const position = parseInt(e.target.dataset.position);
        const selectedDriverId = e.target.value;
        const previousDriverId = this.predictions[position];

        if (previousDriverId) {
            this.enableDriverInAllDropdowns(previousDriverId);
        }

        if (selectedDriverId) {
            this.predictions[position] = selectedDriverId;
            this.disableDriverInOtherDropdowns(selectedDriverId, position);
            this.updateDriverPortrait(position, selectedDriverId);
        } else {
            delete this.predictions[position];
            this.clearDriverPortrait(position);
        }

        this.updateSaveButtonState();
    }

    disableDriverInOtherDropdowns(driverId, excludePosition) {
        document.querySelectorAll('.driver-dropdown').forEach(dropdown => {
            const position = parseInt(dropdown.dataset.position);
            if (position !== excludePosition) {
                const option = dropdown.querySelector(`option[value="${driverId}"]`);
                if (option) {
                    option.disabled = true;
                }
            }
        });
    }

    enableDriverInAllDropdowns(driverId) {
        document.querySelectorAll('.driver-dropdown').forEach(dropdown => {
            const option = dropdown.querySelector(`option[value="${driverId}"]`);
            if (option) {
                option.disabled = false;
            }
        });
    }

    updateDriverPortrait(position, driverId) {
        const driver = drivers.find(d => d.id === driverId);
        const portraitContainer = document.querySelector(`[data-position="${position}"] .driver-portrait`);
        
        if (driver && portraitContainer) {
            portraitContainer.innerHTML = `<img src="${driver.portraitUrl}" alt="${driver.firstName} ${driver.lastName}">`;
            portraitContainer.style.borderColor = driver.teamColor;
        }
    }

    clearDriverPortrait(position) {
        const portraitContainer = document.querySelector(`[data-position="${position}"] .driver-portrait`);
        if (portraitContainer) {
            portraitContainer.innerHTML = '';
            portraitContainer.style.borderColor = '#dee2e6';
        }
    }

    updateSaveButtonState() {
        const saveBtn = document.getElementById('save-predictions-btn');
        const allPositionsFilled = Object.keys(this.predictions).length === 20;
        saveBtn.disabled = !allPositionsFilled;
    }

    savePredictions() {
        if (Object.keys(this.predictions).length !== 20) {
            alert('Please select a driver for all 20 positions before saving.');
            return;
        }

        localStorage.setItem('f1-predictions', JSON.stringify(this.predictions));
        alert('Predictions saved successfully!');
        
        this.exportPredictionsToGoogleSheets();
    }

    loadPredictionsToResultsPhase() {
        const savedPredictions = localStorage.getItem('f1-predictions');
        if (!savedPredictions) {
            alert('No predictions found. Please make predictions first.');
            return;
        }

        this.predictions = JSON.parse(savedPredictions);
        this.displaySavedPredictions();
    }

    displaySavedPredictions() {
        const container = document.getElementById('saved-predictions');
        container.innerHTML = '';

        for (let position = 1; position <= 20; position++) {
            const driverId = this.predictions[position];
            const driver = drivers.find(d => d.id === driverId);
            
            if (driver) {
                const predictionItem = document.createElement('div');
                predictionItem.className = 'prediction-item';
                predictionItem.innerHTML = `
                    <div class="position-label">P${position}</div>
                    <div class="driver-name">${driver.firstName} ${driver.lastName}</div>
                    <div class="driver-portrait-small">
                        <img src="${driver.portraitUrl}" alt="${driver.firstName} ${driver.lastName}">
                    </div>
                `;
                container.appendChild(predictionItem);
            }
        }
    }

    handleResultChange(e) {
        const position = parseInt(e.target.dataset.position);
        const selectedDriverId = e.target.value;

        if (selectedDriverId) {
            this.actualResults[position] = selectedDriverId;
        } else {
            delete this.actualResults[position];
        }

        this.updateStageButtonStates();
    }

    updateStageButtonStates() {
        const stages = [
            { range: [16, 20], button: 'stage-16-20' },
            { range: [11, 15], button: 'stage-11-15' },
            { range: [1, 10], button: 'stage-1-10' }
        ];

        stages.forEach(stage => {
            const btn = document.querySelector(`[data-stage="${stage.button.split('-')[1]}-${stage.button.split('-')[2]}"]`);
            const positions = [];
            for (let i = stage.range[0]; i <= stage.range[1]; i++) {
                positions.push(i);
            }
            
            const allFilled = positions.every(pos => this.actualResults[pos]);
            if (btn) {
                btn.disabled = !allFilled;
            }
        });
    }

    handleStageSubmit(e) {
        const stage = e.target.dataset.stage;
        let positions = [];

        if (stage === '16-20') {
            positions = [16, 17, 18, 19, 20];
            this.calculateScoreForPositions(positions);
            this.enableNextStage([11, 12, 13, 14, 15]);
        } else if (stage === '11-15') {
            positions = [11, 12, 13, 14, 15];
            this.calculateScoreForPositions(positions);
            this.enableNextStage([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        } else if (stage === '1-10') {
            positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            this.calculateScoreForPositions(positions);
            this.enableExportButton();
        }

        e.target.disabled = true;
        this.updateScoreDisplay();
    }

    enableNextStage(positions) {
        positions.forEach(position => {
            const dropdown = document.querySelector(`[data-position="${position}"].result-dropdown`);
            if (dropdown) {
                dropdown.disabled = false;
            }
        });

        const nextStageButton = this.getNextStageButton(positions);
        if (nextStageButton) {
            nextStageButton.disabled = false;
        }
    }

    getNextStageButton(positions) {
        if (positions[0] === 11) {
            return document.querySelector('[data-stage="11-15"]');
        } else if (positions[0] === 1) {
            return document.querySelector('[data-stage="1-10"]');
        }
        return null;
    }

    enableExportButton() {
        document.getElementById('export-results-btn').disabled = false;
    }

    calculateScoreForPositions(positions) {
        positions.forEach(position => {
            const predictedDriverId = this.predictions[position];
            const actualDriverId = this.actualResults[position];
            
            if (predictedDriverId && actualDriverId) {
                const score = this.calculatePositionScore(position, predictedDriverId, actualDriverId);
                this.totalScore += score;
            }
        });
    }

    calculatePositionScore(predictedPosition, predictedDriverId, actualDriverId) {
        if (predictedDriverId === actualDriverId) {
            return 3;
        }

        const actualPositionOfPredictedDriver = this.findDriverActualPosition(predictedDriverId);
        if (actualPositionOfPredictedDriver) {
            const predictedQuartile = this.getQuartile(predictedPosition);
            const actualQuartile = this.getQuartile(actualPositionOfPredictedDriver);
            
            if (predictedQuartile === actualQuartile) {
                return 1;
            }
        }

        return 0;
    }

    findDriverActualPosition(driverId) {
        for (let position = 1; position <= 20; position++) {
            if (this.actualResults[position] === driverId) {
                return position;
            }
        }
        return null;
    }

    getQuartile(position) {
        if (position >= 1 && position <= 5) return 1;
        if (position >= 6 && position <= 10) return 2;
        if (position >= 11 && position <= 15) return 3;
        if (position >= 16 && position <= 20) return 4;
        return 0;
    }

    updateScoreDisplay() {
        document.getElementById('total-score').textContent = this.totalScore;
    }

    async exportPredictionsToGoogleSheets() {
        try {
            await this.initializeGoogleSheetsAPI();
            
            const dateStr = new Date().toISOString().split('T')[0];
            const sheetName = `Predictions - ${dateStr}`;
            
            const predictionData = [];
            for (let position = 1; position <= 20; position++) {
                const driverId = this.predictions[position];
                const driver = drivers.find(d => d.id === driverId);
                if (driver) {
                    predictionData.push([`${driver.firstName} ${driver.lastName}`]);
                }
            }

            await this.createSheetAndWriteData(sheetName, predictionData);
            console.log('Predictions exported to Google Sheets successfully');
        } catch (error) {
            console.error('Error exporting predictions:', error);
            alert('Failed to export predictions to Google Sheets. Please try again.');
        }
    }

    async exportToGoogleSheets() {
        try {
            await this.initializeGoogleSheetsAPI();
            
            const dateStr = new Date().toISOString().split('T')[0];
            const sheetName = `Results - ${dateStr}`;
            
            const resultsData = [['Position', 'Your Prediction', 'Actual Result', 'Points Awarded']];
            let totalPoints = 0;

            for (let position = 1; position <= 20; position++) {
                const predictedDriverId = this.predictions[position];
                const actualDriverId = this.actualResults[position];
                
                const predictedDriver = drivers.find(d => d.id === predictedDriverId);
                const actualDriver = drivers.find(d => d.id === actualDriverId);
                
                const points = this.calculatePositionScore(position, predictedDriverId, actualDriverId);
                totalPoints += points;

                resultsData.push([
                    position,
                    predictedDriver ? `${predictedDriver.firstName} ${predictedDriver.lastName}` : '',
                    actualDriver ? `${actualDriver.firstName} ${actualDriver.lastName}` : '',
                    points
                ]);
            }

            resultsData.push(['', '', 'TOTAL SCORE:', totalPoints]);

            await this.createSheetAndWriteData(sheetName, resultsData);
            alert('Results exported to Google Sheets successfully!');
        } catch (error) {
            console.error('Error exporting results:', error);
            alert('Failed to export results to Google Sheets. Please try again.');
        }
    }

    async initializeGoogleSheetsAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi && window.gapi.auth2) {
                resolve();
                return;
            }

            window.gapi.load('auth2:client', async () => {
                try {
                    await window.gapi.client.init({
                        apiKey: 'YOUR_API_KEY_HERE',
                        clientId: 'YOUR_CLIENT_ID_HERE',
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                        scope: 'https://www.googleapis.com/auth/spreadsheets'
                    });
                    
                    const authInstance = window.gapi.auth2.getAuthInstance();
                    if (!authInstance.isSignedIn.get()) {
                        await authInstance.signIn();
                    }
                    
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async createSheetAndWriteData(sheetName, data) {
        const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
        
        try {
            await window.gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                resource: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: sheetName
                            }
                        }
                    }]
                }
            });

            await window.gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${sheetName}!A1:D${data.length}`,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: data
                }
            });
        } catch (error) {
            if (error.status === 400 && error.result.error.message.includes('already exists')) {
                await window.gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${sheetName}!A1:D${data.length}`,
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: data
                    }
                });
            } else {
                throw error;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new F1PredictionGame();
});