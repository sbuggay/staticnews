import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import { IComment, IItem, IStory } from "./Items";

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

export interface IHydrationStats {
    networkCount: number;
    maxDepth: number;
}

export async function hydrateComments(parent: IItem, depth: number, stats: IHydrationStats, root: IComment | undefined = undefined): Promise<number> {
    const { kids } = parent;

    if (!parent || !kids) {
        parent.more = 1;
        return parent.more;
    }

    let children = kids;
    children = children.slice(0, depth === 0 ? 30 : 20);

    // Grab the comments
    const comments = await Promise.all(children.map(id => getItem(id) as Promise<IComment>));

    stats.networkCount += comments.length;
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    for (let i = 0; i < comments.length - 1; i++) {
        const comment = comments[i];
        if (i > 0) {
            comment.prev = comments[i - 1];
        }
        else if (depth > 0) {
            comment.prev = parent as IComment;
        }
        if (i < (comments.length - 1)) {
            comment.next = comments[i + 1];
        }
        else if (depth > 0) {
            comment.next = (parent as IComment).next;
        }
    }

    // Hydrate their children
    const more = await Promise.all(comments.map(async (comment) => {
        comment.depth = depth;
        comment.root = root;
        return await hydrateComments(comment, depth + 1, stats, root);
    }));

    parent.comments = comments;
    parent.more = more.reduce((acc, v) => acc + v, 0) + 1;

    return parent.more;
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
