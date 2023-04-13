import { IHydrationStats, getTopStories, hydrateComments } from './util';
import * as fs from 'fs';
import * as path from 'path';
import { outputDirectory } from './pages/StaticPage';
import { IndexPage } from './pages/IndexPage';
import { StoryPage } from './pages/StoryPage';
import { AboutPage } from './pages/AboutPage';

const resourceDirectory = './src/resources';

function setupDist() {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
    fs.mkdirSync(outputDirectory, { recursive: true });
}

async function generate() {
    const start = performance.now();

    setupDist();

    const stories = await getTopStories();
    const index = new IndexPage(stories);
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

        const storyPage = new StoryPage(story);
        storyPage.write();
    }));

    // Copy static resources
    fs.copyFileSync(path.join(resourceDirectory, 'styles.css'), path.join(outputDirectory, 'styles.css'));

    const duration = performance.now() - start;
    console.log('Total duration: ' + duration + 'ms');

    const aboutPage = new AboutPage({
        timestamp: new Date(),
        totalNetworkRequests,
        maxDepth,
        duration: Math.round(duration)
    });
    aboutPage.write();
}

generate();
