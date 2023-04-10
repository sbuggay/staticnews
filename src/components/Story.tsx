import Comment from "./Comment";
import { IStory } from "../Items";

export default function (props: { story: IStory }) {
    const { title, comments, url } = props.story;

    const hostname = url ? new URL(url).hostname : null;

    return <div>
        <div className="title">
            <a href={url}>{title}</a>
            {hostname ?? (<a href={hostname!}>{hostname}</a>)}
        </div>
        <br />
        <div>
            {comments?.map(comment => {
                return <Comment key={comment.id} comment={comment} />
            })}
        </div>
    </div>;
}