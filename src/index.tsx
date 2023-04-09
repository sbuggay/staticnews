import * as ReactDOMServer from 'react-dom/server';
import { clearDirSync, fetch } from './util';
import * as fs from 'fs';
import { IComment, IItem, IStory } from './Items';
import * as path from 'path';
import StoryPreview from './components/StoryPreview';
import Story from './components/Story';
import Page from './components/Page';
import About from './components/About';

const LIMIT = 30;
const outputDirectory = './build';
const resourceDirectory = './src/resources';

async function getTopStories(limit = LIMIT): Promise<IStory[]> {
    const ids = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(res => {
        return JSON.parse(res) as number[];
    });

    return Promise.all(ids.slice(0, limit).map(id => getItem<IStory>(id)));
}

async function getItem<T extends IItem>(id: number): Promise<T> {
    return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => {
        return JSON.parse(res) as T;
    });
}

interface IHyrationStats {
    networkCount: number;
    maxDepth: number;
}

async function hydrateComments(parent: IItem, depth: number, stats: IHyrationStats): Promise<void> {
    const { kids } = parent;

    if (!parent || !kids) {
        return;
    }

    let children = kids;
    children = children.slice(0, depth === 0 ? 20 : 10);

    // Grab the comments
    const comments = await Promise.all(children.map(id => getItem(id) as Promise<IComment>));

    stats.networkCount += comments.length;
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    // Hydrate their children
    await Promise.all(comments.map(async (comment) => {
        comment.depth = depth;
        await hydrateComments(comment, depth + 1, stats);
    }));
    parent.comments = comments;
}

async function generate() {
    const cache: Record<string, string> = JSON.parse(fs.readFileSync('./cache.json').toString());

    const start = performance.now();

    const stories = await getTopStories();

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

    // Build a story page for each story
    await Promise.all(stories.map(async (story) => {

        const stats: IHyrationStats = {
            networkCount: 0,
            maxDepth: 0
        }

        await hydrateComments(story, 0, stats);

        const root = <Page><Story story={story} /></Page>;

        console.log(`${story.id}\t\t${stats.networkCount}\t\t${stats.maxDepth}`);

        const storyOutput = ReactDOMServer.renderToStaticMarkup(root);
        fs.writeFileSync(path.join(outputDirectory, `${story.id}.html`), storyOutput);
    }));

    // Generate about page
    const aboutPageOutput = ReactDOMServer.renderToStaticMarkup(<About />);
    fs.writeFileSync(path.join(outputDirectory, `about.html`), aboutPageOutput);

    // Copy static resources
    fs.copyFileSync(path.join(resourceDirectory, 'styles.css'), path.join(outputDirectory, 'styles.css'));

    const duration = performance.now() - start;
    console.log('Total duration: ' + duration + 'ms');

}

generate();
