import { IStory } from "../Items";
import Story from "../components/Story";
import { StaticPage } from "./StaticPage";

export class StoryPage extends StaticPage {
    constructor(story: IStory) {
        super(<Story story={story} />, story.id + '.html');
    }
}