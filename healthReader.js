const fs = require('fs').promises;

async function readHealthData(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const healthData = JSON.parse(data);
        
        if (!Array.isArray(healthData)) {
            throw new Error('JSON data is not an array');
        }
        
        const entryCount = healthData.length;
        console.log(`Total health entries: ${entryCount}`);
        
        return entryCount;
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: JSON file not found at ${filePath}`);
        } else if (error instanceof SyntaxError) {
            console.error('Error: Invalid JSON format in the file');
        } else {
            console.error(`Error: ${error.message}`);
        }
        
        return -1;
    }
}

function readHealthDataCallback(filePath, callback) {
    const fs = require('fs');
    
    fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
            if (error.code === 'ENOENT') {
                callback(`JSON file not found at ${filePath}`, null);
            } else {
                callback(error.message, null);
            }
            return;
        }
        
        try {
            const healthData = JSON.parse(data);
            
            if (!Array.isArray(healthData)) {
                throw new Error('JSON data is not an array');
            }
            
            const entryCount = healthData.length;
            console.log(`Total health entries: ${entryCount}`);
            callback(null, entryCount);
            
        } catch (parseError) {
            if (parseError instanceof SyntaxError) {
                callback('Invalid JSON format in the file', null);
            } else {
                callback(parseError.message, null);
            }
        }
    });
}

async function main() {
    const count = await readHealthData('./data/health-metrics.json');
    
    if (count !== -1) {
        console.log('JSON reading completed successfully!');
    }
}

module.exports = {
    readHealthData,
    readHealthDataCallback
};