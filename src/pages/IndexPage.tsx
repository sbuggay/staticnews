import { IStory } from "../Items";
import Index from "../components/Index";
import { StaticPage } from "./StaticPage";

export class IndexPage extends StaticPage {
    constructor(stories: IStory[]) {
        super(<Index stories={stories} />, 'index.html');
    }
}