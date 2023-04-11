import * as ReactDOMServer from 'react-dom/server';
import { getItem, getTopStories } from './util';
import * as fs from 'fs';
import { IComment, IItem } from './Items';
import * as path from 'path';
import StoryPreview from './components/StoryPreview';
import Story from './components/Story';
import Page from './components/Page';
import About from './components/About';

const LIMIT = 30;
const outputDirectory = './build';
const resourceDirectory = './src/resources';

export interface IHyrdationStats {
    networkCount: number;
    maxDepth: number;
}

async function hydrateComments(parent: IItem, depth: number, stats: IHyrdationStats, root: IComment | undefined = undefined): Promise<number> {
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

    // Hydrate their children
    const more = await Promise.all(comments.map(async (comment) => {
        comment.depth = depth;

        if (!root) {
            root = comment;
        }

        comment.root = root;
        return await hydrateComments(comment, depth + 1, stats, root);
    }));
    parent.comments = comments;
    parent.more = more.reduce((acc, v) => acc + v, 0) + 1;

    return parent.more;
}

async function generate() {
    const start = performance.now();

    const stories = await getTopStories(LIMIT);

    const index =
        <Page>
            <ul>
                {stories.map(story => <StoryPreview story={story} key={story.title} />)}
            </ul>
        </Page>;

    fs.mkdirSync(outputDirectory, { recursive: true });

    const output = ReactDOMServer.renderToStaticMarkup(index);
    fs.writeFileSync(path.join(outputDirectory, 'index.html'), output);

    console.log(`id\t\tvolume\t\tmax depth`);

    let totalNetworkRequests = 0;
    let maxDepth = 0;

    // Build a story page for each story
    await Promise.all(stories.map(async (story) => {

        const stats: IHyrdationStats = {
            networkCount: 0,
            maxDepth: 0
        }

        const count = await hydrateComments(story, 0, stats);
        story.descendants = count; // Filter out unused descendants and use our traversed one

        const root = <Page><Story story={story} /></Page>;

        console.log(`${story.id}\t\t${stats.networkCount}\t\t${stats.maxDepth}`);

        totalNetworkRequests += stats.networkCount;
        maxDepth = Math.max(maxDepth, stats.maxDepth);

        const storyOutput = ReactDOMServer.renderToStaticMarkup(root);
        fs.writeFileSync(path.join(outputDirectory, `${story.id}.html`), storyOutput);
    }));

    // Copy static resources
    fs.copyFileSync(path.join(resourceDirectory, 'styles.css'), path.join(outputDirectory, 'styles.css'));

    const duration = performance.now() - start;
    console.log('Total duration: ' + duration + 'ms');

    // Generate about page
    const aboutPageOutput = ReactDOMServer.renderToStaticMarkup(<About stats={{
        timestamp: new Date(),
        totalNetworkRequests,
        maxDepth,
        duration: Math.round(duration)
    }} />);
    fs.writeFileSync(path.join(outputDirectory, `about.html`), aboutPageOutput);
}

generate();
