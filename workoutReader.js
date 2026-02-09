const csv = require('csv-parser');
const fs = require('fs');

async function workoutCalculator(filePath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            console.error(`Error: CSV file not found at ${filePath}`);
            reject(new Error(`CSV file not found at ${filePath}`));
            return;
        }

        let totalWorkouts = 0;
        let totalMinutes = 0;
        let hasData = false;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                hasData = true;
                totalWorkouts++;
                
                if (row.minutes && !isNaN(parseInt(row.minutes))) {
                    totalMinutes += parseInt(row.minutes);
                }
            })
            .on('end', () => {
                if (!hasData) {
                    console.error('Error: CSV file is empty or contains no valid data');
                    reject(new Error('CSV file is empty or contains no valid data'));
                    return;
                }
                
                console.log(`Total workouts: ${totalWorkouts}`);
                console.log(`Total minutes: ${totalMinutes}`);
                resolve({ totalWorkouts, totalMinutes });
            })
            .on('error', (error) => {
                console.error(`Error reading CSV file: ${error.message}`);
                reject(error);
            });
    });
}

function workoutCalculatorCallback(filePath, callback) {
    if (!fs.existsSync(filePath)) {
        const error = `Error: CSV file not found at ${filePath}`;
        console.error(error);
        callback(error, null);
        return;
    }

    let totalWorkouts = 0;
    let totalMinutes = 0;
    let hasData = false;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            hasData = true;
            totalWorkouts++;
            
            if (row.minutes && !isNaN(parseInt(row.minutes))) {
                totalMinutes += parseInt(row.minutes);
            }
        })
        .on('end', () => {
            if (!hasData) {
                const error = 'Error: CSV file is empty or contains no valid data';
                console.error(error);
                callback(error, null);
                return;
            }
            
            console.log(`Total workouts: ${totalWorkouts}`);
            console.log(`Total minutes: ${totalMinutes}`);
            callback(null, { totalWorkouts, totalMinutes });
        })
        .on('error', (error) => {
            const errorMsg = `Error reading CSV file: ${error.message}`;
            console.error(errorMsg);
            callback(errorMsg, null);
        });
}

async function main() {
    try {
        await workoutCalculator('./data/workouts.csv');
    } catch (error) {
        console.error('Failed to process workouts:', error.message);
    }
}

module.exports = {
    workoutCalculator,
    workoutCalculatorCallback
};