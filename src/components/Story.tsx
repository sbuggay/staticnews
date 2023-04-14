import Comment from "./Comment";
import { IStory } from "../Items";

export default function (props: { story: IStory }) {
    const { title, comments, url } = props.story;

    const hostname = url ? new URL(url).hostname : null;
    const link = () => <a href={hostname!}>{hostname} </a>;

    return <div>
        <div id="title">
            <a href={url}>{title}</a>&nbsp;<span>{hostname && '(' + link() + ')'}</span>
        </div>
        <br />
        <div>
            {comments?.map(comment => {
                return <Comment key={comment.id} comment={comment} />
            })}
        </div>
    </div>;
}