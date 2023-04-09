import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

export function fetch(url: string) {
    return new Promise<string>((resolve, reject) => {
        https.get(url, (res) => {
            let data: string = "";

            // A chunk of data has been recieved.
            res.on("data", chunk => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            res.on("end", () => {
                resolve(data);
            });
        });
    });
}

export function clearDirSync(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        try {
            fs.unlinkSync(path.join(dirPath, file));
        }
        catch (e) {
            console.error(e);
        }
    }
}