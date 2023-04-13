import { PathLike, writeFileSync } from "fs";
import ReactDOMServer from "react-dom/server";
import Page from "./components/Page";

type CustomElement = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

export class StaticPage {
    
    element: CustomElement;
    path: PathLike;

    constructor(element: CustomElement, path: PathLike) {
        this.element = element;
        this.path = path;
    }
    
    write() {
        const root = <Page>{this.element}</Page>;
        const html = ReactDOMServer.renderToStaticMarkup(root);
        writeFileSync(this.path, `<!DOCTYPE html>${html}`);
    }
}