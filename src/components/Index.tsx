import { IStory } from '../Items';
import StoryPreview from './StoryPreview';

function Index(props: { stories: IStory[] }) {
    const { stories } = props;

    return (
        <>
            {stories.map(story => <StoryPreview story={story} key={story.id} />)}
        </>
    );
}

export default Index;