import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const dirPath = path.join('.wrangler', 'state', 'v3', 'd1', 'miniflare-D1DatabaseObject');

if (!fs.existsSync(dirPath)) {
    console.error(`${dirPath} directory does not exist.`);
    process.exit(1);
}

fs.readdir(dirPath, (err, files) => {
    if (err) throw err;

    const sqliteFile = files.find(file => file.endsWith('.sqlite'));
    if (sqliteFile) {
        const localDbPath = path.join(dirPath, sqliteFile);
        exec(`set LOCAL_DB_PATH=${localDbPath} && drizzle-kit studio`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    } else {
        console.log('No SQLite file found.');
    }
});