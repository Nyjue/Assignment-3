require('dotenv').config();
const { readHealthData } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

async function dataProcessor() {
    try {
        const userName = process.env.USER_NAME || 'User';
        const weeklyGoal = parseInt(process.env.WEEKLY_GOAL) || 150;

        console.log(`Hello ${userName}!`);
        console.log('Processing your health and workout data...\n');

        const healthCount = await readHealthData('./data/health-metrics.json');
        
        if (healthCount === -1) {
            console.log('Skipping health data summary due to errors.');
        } else {
            console.log(`✓ Health Data Summary: Found ${healthCount} health entries.`);
        }

        const workoutResult = await workoutCalculator('./data/workouts.csv');
        
        console.log(`\n✓ Workout Data Summary:`);
        console.log(`  - Total workouts completed: ${workoutResult.totalWorkouts}`);
        console.log(`  - Total minutes exercised: ${workoutResult.totalMinutes}`);
        
        console.log(`\n✓ Weekly Goal Analysis:`);
        console.log(`  - Your weekly goal: ${weeklyGoal} minutes`);
        
        if (workoutResult.totalMinutes >= weeklyGoal) {
            console.log(`  🎉 Congratulations! You've met your weekly goal!`);
            console.log(`  You exceeded your goal by ${workoutResult.totalMinutes - weeklyGoal} minutes.`);
        } else {
            console.log(`  📊 You need ${weeklyGoal - workoutResult.totalMinutes} more minutes to reach your goal.`);
            console.log(`  You've completed ${Math.round((workoutResult.totalMinutes / weeklyGoal) * 100)}% of your goal.`);
        }
        
        console.log('\n✅ Data processing completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Error processing data:', error.message);
        console.log('Please check your data files and try again.');
    }
}

dataProcessor();