import { IStory } from "../Items";
import WrappedLinked from "./WrappedLink";

export default function (props: { story: IStory }) {
    const { id, title, descendants, url, by } = props.story;

    let comments = '';

    if (descendants > 0) {
        comments = `${descendants} comment${descendants !== 1 ? 's' : ''}`;
    }

    const link = url ? url : `/${id}`;

    return <div className="preview">
        <div>
            <a className="bullet" href={link}>{title}</a>&nbsp;<WrappedLinked urlString={url} />
        </div>
        <div className="subtext">
            {by}{comments && <>{' | '} <span><a href={`${id}.html`}>{comments}</a></span></>}
        </div>
    </div>
}