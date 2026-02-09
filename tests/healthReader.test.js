const fs = require('fs');
const path = require('path');
const { readHealthData } = require('./healthReader');

describe('healthReader', () => {
    const testDataDir = path.join(__dirname, 'test-data');
    const validJsonPath = path.join(testDataDir, 'valid_health.json');
    const invalidJsonPath = path.join(testDataDir, 'invalid.json');
    const missingJsonPath = path.join(testDataDir, 'missing.json');
    const notArrayJsonPath = path.join(testDataDir, 'not_array.json');

    beforeAll(() => {
        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir, { recursive: true });
        }

        const validJsonContent = JSON.stringify([
            { id: 1, heartRate: 72 },
            { id: 2, heartRate: 68 },
            { id: 3, heartRate: 75 }
        ]);

        const invalidJsonContent = '{ invalid json';
        const notArrayJsonContent = JSON.stringify({ id: 1, heartRate: 72 });

        fs.writeFileSync(validJsonPath, validJsonContent);
        fs.writeFileSync(invalidJsonPath, invalidJsonContent);
        fs.writeFileSync(notArrayJsonPath, notArrayJsonContent);
    });

    afterAll(() => {
        if (fs.existsSync(validJsonPath)) {
            fs.unlinkSync(validJsonPath);
        }
        if (fs.existsSync(invalidJsonPath)) {
            fs.unlinkSync(invalidJsonPath);
        }
        if (fs.existsSync(notArrayJsonPath)) {
            fs.unlinkSync(notArrayJsonPath);
        }
        if (fs.existsSync(testDataDir)) {
            fs.rmdirSync(testDataDir);
        }
    });

    test('should read valid JSON file and return correct count', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        
        const result = await readHealthData(validJsonPath);
        
        expect(consoleSpy).toHaveBeenCalledWith('Total health entries: 3');
        expect(result).toBe(3);
        
        consoleSpy.mockRestore();
    });

    test('should handle missing JSON file', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        
        const result = await readHealthData(missingJsonPath);
        
        expect(consoleSpy).toHaveBeenCalledWith(`Error: JSON file not found at ${missingJsonPath}`);
        expect(result).toBe(-1);
        
        consoleSpy.mockRestore();
    });

    test('should handle invalid JSON format', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        
        const result = await readHealthData(invalidJsonPath);
        
        expect(consoleSpy).toHaveBeenCalledWith('Error: Invalid JSON format in the file');
        expect(result).toBe(-1);
        
        consoleSpy.mockRestore();
    });

    test('should handle JSON that is not an array', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        
        const result = await readHealthData(notArrayJsonPath);
        
        expect(consoleSpy).toHaveBeenCalledWith('Error: JSON data is not an array');
        expect(result).toBe(-1);
        
        consoleSpy.mockRestore();
    });

    test('should handle empty JSON array', async () => {
        const emptyJsonPath = path.join(testDataDir, 'empty.json');
        fs.writeFileSync(emptyJsonPath, JSON.stringify([]));

        const consoleSpy = jest.spyOn(console, 'log');
        
        const result = await readHealthData(emptyJsonPath);
        
        expect(consoleSpy).toHaveBeenCalledWith('Total health entries: 0');
        expect(result).toBe(0);
        
        consoleSpy.mockRestore();
        fs.unlinkSync(emptyJsonPath);
    });
});