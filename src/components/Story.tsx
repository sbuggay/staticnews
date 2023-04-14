import Comment from "./Comment";
import { IStory } from "../Items";
import WrappedLinked from "./WrappedLink";

export default function (props: { story: IStory }) {
    const { title, comments, url, by, descendants } = props.story;

    return <div>
        <div id="title">
            <a href={url}>{title}</a>&nbsp;<WrappedLinked urlString={url} />
        </div>
        <div>
            <span>{by}</span>{' | '}<span>{descendants} comments</span>
        </div>
        <br />
        <div>
            {comments?.map(comment => {
                return <Comment key={comment.id} comment={comment} />
            })}
        </div>
    </div>;
}