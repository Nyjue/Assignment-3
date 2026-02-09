const fs = require('fs');
const path = require('path');
const { workoutCalculator } = require('./workoutReader');

describe('workoutReader', () => {
    const testDataDir = path.join(__dirname, 'test-data');
    const validCsvPath = path.join(testDataDir, 'valid_workouts.csv');
    const emptyCsvPath = path.join(testDataDir, 'empty.csv');
    const missingCsvPath = path.join(testDataDir, 'missing.csv');

    beforeAll(() => {
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir, { recursive: true });
        }

        const validCsvContent = `workout_id,workout_type,minutes,calories_burned
1,running,30,300
2,cycling,45,400
3,swimming,60,500`;

        const emptyCsvContent = '';

        fs.writeFileSync(validCsvPath, validCsvContent);
        fs.writeFileSync(emptyCsvPath, emptyCsvContent);
    });

    afterAll(() => {
        if (fs.existsSync(validCsvPath)) {
            fs.unlinkSync(validCsvPath);
        }
        if (fs.existsSync(emptyCsvPath)) {
            fs.unlinkSync(emptyCsvPath);
        }
        if (fs.existsSync(testDataDir)) {
            fs.rmdirSync(testDataDir);
        }
    });

    test('should read valid CSV file and return correct data', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        
        const result = await workoutCalculator(validCsvPath);
        
        expect(consoleSpy).toHaveBeenCalledWith('Total workouts: 3');
        expect(consoleSpy).toHaveBeenCalledWith('Total minutes: 135');
        expect(result).toEqual({
            totalWorkouts: 3,
            totalMinutes: 135
        });
        
        consoleSpy.mockRestore();
    });

    test('should handle missing CSV file', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        
        await expect(workoutCalculator(missingCsvPath))
            .rejects
            .toThrow(`CSV file not found at ${missingCsvPath}`);
        
        expect(consoleSpy).toHaveBeenCalledWith(`Error: CSV file not found at ${missingCsvPath}`);
        
        consoleSpy.mockRestore();
    });

    test('should handle empty CSV file', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        
        await expect(workoutCalculator(emptyCsvPath))
            .rejects
            .toThrow('CSV file is empty or contains no valid data');
        
        expect(consoleSpy).toHaveBeenCalledWith('Error: CSV file is empty or contains no valid data');
        
        consoleSpy.mockRestore();
    });

    test('should handle CSV with missing minutes column', async () => {
        const csvPath = path.join(testDataDir, 'no_minutes.csv');
        const csvContent = `workout_id,workout_type,calories_burned
1,running,300
2,cycling,400`;

        fs.writeFileSync(csvPath, csvContent);

        const consoleSpy = jest.spyOn(console, 'log');
        
        const result = await workoutCalculator(csvPath);
        
        expect(result.totalWorkouts).toBe(2);
        expect(result.totalMinutes).toBe(0);
        
        consoleSpy.mockRestore();
        fs.unlinkSync(csvPath);
    });
});