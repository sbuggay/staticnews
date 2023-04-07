import Comment from "./Comment";
import { IStory } from "../Items";

export default function (props: { story: IStory }) {
    const { title, comments, url } = props.story;

    return <div>
        <a href={url}><h1>{title}</h1></a>
        <div>
            {comments?.map(comment => {
                return <Comment key={comment.id} comment={comment} />
            })}
        </div>
    </div>;
}