import About, { IStats } from "../components/About";
import { StaticPage } from "./StaticPage";

export class AboutPage extends StaticPage {
    constructor(stats: IStats) {
        super(<About stats={stats} />, 'about.html');
    }
}