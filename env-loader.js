// Environment variable loader for local development
// This file loads .env variables when running locally
class EnvironmentLoader {
    constructor() {
        this.config = {};
        this.isLocal = this.detectLocalEnvironment();
    }

    detectLocalEnvironment() {
        // Check if we're running locally (localhost or file://)
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' || 
               window.location.protocol === 'file:';
    }

    async loadEnvironmentVariables() {
        if (this.isLocal) {
            // For local development, try to load from .env file
            try {
                const response = await fetch('./.env');
                if (response.ok) {
                    const envContent = await response.text();
                    this.parseEnvFile(envContent);
                    console.log('✅ Loaded environment variables from .env file');
                } else {
                    console.error('❌ No .env file found for local development.');
                    console.log('📝 Please copy .env.example to .env and add your credentials');
                    this.setMissingEnvWarning();
                }
            } catch (error) {
                console.error('❌ Could not load .env file:', error.message);
                console.log('📝 Please copy .env.example to .env and add your credentials');
                this.setMissingEnvWarning();
            }
        } else {
            // For GitHub Pages deployment, values are already replaced in app.js
            // No additional loading needed
            console.log('Running in production mode - using injected environment variables');
        }
    }

    parseEnvFile(content) {
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    this.config[key.trim()] = valueParts.join('=').trim();
                }
            }
        }
        console.log('Loaded environment variables from .env file');
    }

    setMissingEnvWarning() {
        // Set invalid values that will trigger helpful error messages
        this.config = {
            'SHEETS_API_KEY': 'MISSING_API_KEY',
            'CLIENT_ID': 'MISSING_CLIENT_ID',
            'SPREADSHEET_ID': 'MISSING_SPREADSHEET_ID'
        };
        this.missingEnv = true;
    }

    get(key) {
        return this.config[key] || `YOUR_${key}`;
    }

    getApiKey() {
        return this.get('SHEETS_API_KEY');
    }

    getClientId() {
        return this.get('CLIENT_ID');
    }

    getSpreadsheetId() {
        return this.get('SPREADSHEET_ID');
    }

    hasValidCredentials() {
        return !this.missingEnv && 
               this.getApiKey() !== 'MISSING_API_KEY' &&
               this.getClientId() !== 'MISSING_CLIENT_ID' &&
               this.getSpreadsheetId() !== 'MISSING_SPREADSHEET_ID' &&
               this.getApiKey() !== 'YOUR_API_KEY_HERE' &&
               this.getClientId() !== 'YOUR_CLIENT_ID_HERE' &&
               this.getSpreadsheetId() !== 'YOUR_SPREADSHEET_ID';
    }
}

// Create global instance
window.envLoader = new EnvironmentLoader();