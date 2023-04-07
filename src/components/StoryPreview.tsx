import { IStory } from "../Items";

export default function (props: { story: IStory }) {
    const { id, title, descendants, url } = props.story;

    const comments = `${descendants} comment${descendants !== 1 ? 's' : ''}`;

    return <li>
        <a href={url}>{title}</a> - <a href={`${id}.html`}>{comments}</a>
    </li>
}