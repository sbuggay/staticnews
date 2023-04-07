import * as ReactDOMServer from 'react-dom/server';
import { fetch } from './util';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { IComment, IItem, IStory } from './Items';
import { join } from 'path';
import StoryPreview from './components/StoryPreview';
import Story from './components/Story';
import Page from './components/Page';

const LIMIT = 30;
const outputDirectory = './build';

async function getTopStories(): Promise<number[]> {
    return fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(res => {
        return JSON.parse(res) as number[];
    });
}

async function getItem<T>(id: number): Promise<T> {
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

    if (!kids) {
        return;
    }

    // Grab the comments
    const comments = await Promise.all(kids.map(id => getItem(id) as Promise<IComment>));

    stats.networkCount += comments.length;
    stats.maxDepth = Math.max(stats.maxDepth, depth);

    // Hydrate their children
    await Promise.all(comments.map(comment => hydrateComments(comment, depth + 1, stats)));
    parent.comments = comments;
}

async function generate() {

    const start = performance.now();

    const storyIds = await getTopStories();
    const stories = await Promise.all(storyIds.slice(0, LIMIT).map(id => getItem(id))) as IStory[];

    const index =
        <Page>
            <>
                {stories.map(story => <StoryPreview story={story} key={story.title} />)}
            </>
        </Page>

    mkdirSync(outputDirectory, { recursive: true });

    const output = ReactDOMServer.renderToStaticMarkup(index);
    writeFileSync(join(outputDirectory, 'index.html'), output);

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
        writeFileSync(join(outputDirectory, `${story.id}.html`), storyOutput)
    }));


    // Copy static resources
    copyFileSync('./src/styles.css', join(outputDirectory, 'styles.css'));

    const duration = performance.now() - start;
    console.log('Total duration: ' + duration + 'ms');
}

generate();
