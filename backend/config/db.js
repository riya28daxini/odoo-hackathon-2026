import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

export class JsonDB {
  static read() {
    try {
      if (!fs.existsSync(DB_PATH)) {
        console.error('Database file not found:', DB_PATH);
        return {
          users: [],
          cities: [],
          activities: [],
          trips: [],
          communityTrips: [],
          adminStats: {}
        };
      }

      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);

    } catch (error) {
      console.error('Error reading JSON DB:', error);

      return {
        users: [],
        cities: [],
        activities: [],
        trips: [],
        communityTrips: [],
        adminStats: {}
      };
    }
  }

  static write(data) {
    try {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

      fs.writeFileSync(
        DB_PATH,
        JSON.stringify(data, null, 2),
        'utf8'
      );

      return true;

    } catch (error) {
      console.error('Error writing to JSON DB:', error);
      return false;
    }
  }

  static reset() {
    console.warn(
      'Database reset is disabled because db.json is the source of truth.'
    );

    return this.read();
  }
}