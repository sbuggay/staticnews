import * as ReactDOMServer from 'react-dom/server';
import { fetch } from './util';
import { writeFileSync, mkdirSync } from 'fs';
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

async function hydrateComments(parent: IItem): Promise<void> {
    const { kids } = parent;

    // Grab the comments
    const comments = await Promise.all(kids.map(id => getItem(id) as Promise<IComment>));
    // Hydrate their children
    await Promise.all(comments.map(comment => hydrateComments(comment)));
    parent.comments = comments;
}

async function generate() {
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


    // Build a story page for each story
    stories.forEach(async (story) => {
        await hydrateComments(story);

        const root = <Page><Story story={story} /></Page>;

        const storyOutput = ReactDOMServer.renderToStaticMarkup(root);
        writeFileSync(join(outputDirectory, `${story.id}.html`), storyOutput)
    });
}

generate();

