import { IComment, IItem, IStory } from "./Items";
import { fetch } from "./util";

const defaultStoryLimit = 30;
const defaultRootCommentLimit = 30;
const defaultCommentLimit = 20;


export async function getTopStories(limit: number = defaultStoryLimit): Promise<IStory[]> {
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
    children = children.slice(0, depth === 0 ? defaultRootCommentLimit : defaultCommentLimit);

    // Grab the comments
    const comments = await Promise.all(children.map(id => getItem(id) as Promise<IComment>));

    stats.networkCount += comments.length;
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        // Only link previous if we aren't the first comment for a layer
        if (i > 0) {
            comment.prev = comments[i - 1];
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

        if (root) {
            comment.root = root;
        }

        return await hydrateComments(comment, depth + 1, stats, root ? root : comment);
    }));

    parent.comments = comments;
    parent.more = more.reduce((acc, v) => acc + v, 0) + 1;

    return parent.more;
}