import { PathLike, writeFileSync } from "fs";
import * as path from 'path';
import ReactDOMServer from "react-dom/server";
import Page from "../components/Page";

export const outputDirectory = './build';

type JSXElementWrapper = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

export class StaticPage {
    
    element: JSXElementWrapper;
    path: PathLike;

    constructor(element: JSXElementWrapper, path: PathLike) {
        this.element = element;
        this.path = path;
    }
    
    write() {
        const root = <Page>{this.element}</Page>;
        const html = ReactDOMServer.renderToStaticMarkup(root);
        writeFileSync(path.join(outputDirectory, this.path.toString()), `<!DOCTYPE html>${html}`);
    }
}