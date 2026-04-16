import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

// Load .env from backend root
config({ path: join(__dirname, '..', '.env') });

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || process.env.DB_DATABASE,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function resetDb() {
    try {
        console.log('Connecting to database...');
        await dataSource.initialize();
        console.log('Connected!');

        console.log('Cleaning tables...');
        // Using TRUNCATE CASCADE to clean data but keep structure, 
        // allowing TypeORM to re-sync/modify columns as needed without "null value" errors on existing rows.
        await dataSource.query('TRUNCATE TABLE hotel_rooms CASCADE;');
        await dataSource.query('TRUNCATE TABLE hotel_bookings CASCADE;');
        await dataSource.query('TRUNCATE TABLE hotel_guests CASCADE;');

        console.log('Tables cleaned successfully. You can now start the backend.');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting DB:', error);
        process.exit(1);
    }
}

resetDb();
