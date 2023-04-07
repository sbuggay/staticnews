import { IComment } from "../Items";

function Comment(props: { comment: IComment }) {
    const { text, comments, by } = props.comment;

    if (!text) return null;

    return <div className="comment">
        <hr />
        <div className="by">{by}</div>
        <div dangerouslySetInnerHTML={{ __html: text }} />
        {comments?.map(comment => <Comment key={comment.id} comment={comment} />)}
    </div>;
}

export default Comment;