import * as fs from 'fs';
import * as path from 'path';
import { outputDirectory } from './pages/StaticPage';
import { IndexPage } from './pages/IndexPage';
import { StoryPage } from './pages/StoryPage';
import { AboutPage } from './pages/AboutPage';
import { IHydrationStats, getTopStories, hydrateComments } from './hn';

const resourceDirectory = './src/resources';

async function generate() {
    const start = performance.now();

    fs.mkdirSync(outputDirectory, { recursive: true });

    const stories = await getTopStories();
    const index = new IndexPage(stories);
    index.write();

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
