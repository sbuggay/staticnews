import { IStory } from "../Items";

export default function (props: { story: IStory }) {
    const { id, title, descendants, url } = props.story;

    let comments = '';

    if (descendants > 0) {
        comments = `${descendants} comment${descendants !== 1 ? 's' : ''}`;
    }

    const link = url ? url : `/${id}`;

    return <li>
        <span>
            <a href={link}>{title}</a>
        </span>
        {comments && <span> - <a href={`${id}.html`}>{comments}</a></span>}
    </li>
}