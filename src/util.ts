import * as https from 'https';

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