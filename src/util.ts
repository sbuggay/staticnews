import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import { IItem, IStory } from "./Items";

export function fetch(url: string) {
    return new Promise<string>((resolve, reject) => {
        https.get(url, (res) => {
            let data: string = "";

            // A chunk of data has been recieved.
            res.on("data", (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            res.on("end", () => {
                resolve(data);
            });
        });
    });
}

export async function getTopStories(limit: number): Promise<IStory[]> {
    const ids = await fetch(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
    ).then((res) => {
        return JSON.parse(res) as number[];
    });

    return Promise.all(ids.slice(0, limit).map((id) => getItem<IStory>(id)));
}

export async function getItem<T extends IItem>(id: number): Promise<T> {
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
        (res) => {
            return JSON.parse(res) as T;
        }
    );
}

export function clearDirSync(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        try {
            fs.unlinkSync(path.join(dirPath, file));
        } catch (e) {
            console.error(e);
        }
    }
}
