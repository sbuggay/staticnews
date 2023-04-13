import * as ReactDOMServer from 'react-dom/server';
import { IHydrationStats, getTopStories, hydrateComments } from './util';
import * as fs from 'fs';
import * as path from 'path';
import StoryPreview from './components/StoryPreview';
import Story from './components/Story';
import About from './components/About';
import { StaticPage } from './StaticPage';

const LIMIT = 30;
const outputDirectory = './build';
const resourceDirectory = './src/resources';

async function generate() {
    const start = performance.now();

    fs.rmSync(outputDirectory, { recursive: true, force: true });
    fs.mkdirSync(outputDirectory, { recursive: true });

    const stories = await getTopStories(LIMIT);

    const index = new StaticPage(<ul>
        {stories.map(story => <StoryPreview story={story} key={story.title} />)}
    </ul>, path.join(outputDirectory, 'index.html'));

    index.write();

    console.log(`id\t\tvolume\t\tmax depth`);

    let totalNetworkRequests = 0;
    let maxDepth = 0;

    // Build a story page for each story
    await Promise.all(stories.map(async (story) => {

        const stats: IHydrationStats = {
            networkCount: 0,
            maxDepth: 0
        }

        const count = await hydrateComments(story, 0, stats);
        story.descendants = count; // Filter out unused descendants and use our traversed one

        console.log(`${story.id}\t\t${stats.networkCount}\t\t${stats.maxDepth}`);
        totalNetworkRequests += stats.networkCount;
        maxDepth = Math.max(maxDepth, stats.maxDepth);

        const storyPage = new StaticPage(<Story story={story} />, path.join(outputDirectory, `${story.id}.html`));
        storyPage.write();
    }));

    // Copy static resources
    fs.copyFileSync(path.join(resourceDirectory, 'styles.css'), path.join(outputDirectory, 'styles.css'));

    const duration = performance.now() - start;
    console.log('Total duration: ' + duration + 'ms');

    const aboutPage = new StaticPage(<About stats={{
        timestamp: new Date(),
        totalNetworkRequests,
        maxDepth,
        duration: Math.round(duration)
    }} />, path.join(outputDirectory, `about.html`));
    aboutPage.write();
}

generate();
