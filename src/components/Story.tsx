import Comment from "./Comment";
import { IStory } from "../Items";

export default function (props: { story: IStory }) {
    const { title, comments } = props.story;

    return <div>
        <h1>{title}</h1>
        <div>
            {comments?.map(comment => {
                return <Comment key={comment.id} comment={comment} depth={0} />
            })}
        </div>
    </div>;
}