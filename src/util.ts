import * as https from "https";
import * as fs from "fs";
import * as path from "path";

export function fetch(url: string) {
    return new Promise<string>((resolve, reject) => {
        https.get(url, (res) => {
            let data: string = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                resolve(data);
            });
        }).on("error", (error) => {
            reject(error);
        });
    });
}

export function clearFolder(folderPath: string) {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        fs.unlinkSync(path.join(folderPath, file));
    });
}