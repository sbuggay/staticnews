import { IComment, IItem, IStory } from "./Items";
import { fetch } from "./util";

const baseUrl = 'https://hacker-news.firebaseio.com/v0';
const defaultStoryLimit = 30;
const defaultRootCommentLimit = 30;
const defaultCommentLimit = 20;

export async function getTopStories(
    limit: number = defaultStoryLimit
): Promise<IStory[]> {
    const response = await fetch(`${baseUrl}/topstories.json`);
    const json = JSON.parse(response) as number[];
    const stories = await Promise.all(json.slice(0, limit).map((id) => getItem<IStory>(id)));
    return stories.filter(story => story !== undefined) as IStory[];
}

export async function getItem<T extends IItem>(id: number): Promise<T | undefined> {
    try {
        const response = await fetch(`${baseUrl}/item/${id}.json`);
        const json = JSON.parse(response) as T;
        return json;
    }
    catch (e) {
        console.error(e);
        return Promise.resolve(undefined);
    }
}

export interface IHydrationStats {
    networkCount: number;
    maxDepth: number;
}

export async function hydrateComments(
    parent: IItem,
    depth: number,
    stats: IHydrationStats,
    root: IComment | undefined = undefined
): Promise<number> {
    const { kids } = parent;

    if (!parent || !kids) {
        parent.more = 1;
        return parent.more;
    }

    let children = kids;
    children = children.slice(
        0,
        depth === 0 ? defaultRootCommentLimit : defaultCommentLimit
    );

    // Grab the comments
    const comments = await Promise.all(
        children.map((id) => getItem<IComment>(id))
    ) as IComment[];

    stats.networkCount += comments.length;
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        if (!comment) {
            console.error('Missing comment on parent ' + parent.id);
            continue;
        };

        // Only link previous if we aren't the first comment for a layer
        if (i > 0) {
            comment.prev = comments[i - 1];
        }

        if (i < comments.length - 1) {
            comment.next = comments[i + 1];
        } else if (depth > 0) {
            comment.next = (parent as IComment).next;
        }
    }

    // Hydrate their children
    const more = await Promise.all(
        comments.filter(comment => !!comment).map(async (comment) => {
            comment.depth = depth;

            if (root) {
                comment.root = root;
            }

            return await hydrateComments(
                comment,
                depth + 1,
                stats,
                root ? root : comment
            );
        })
    );

    parent.comments = comments;
    parent.more = more.reduce((acc, v) => acc + v, 0) + 1;

    return parent.more;
}
