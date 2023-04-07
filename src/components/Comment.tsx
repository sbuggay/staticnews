import { IComment } from "../Items";

function Comment(props: { comment: IComment, depth: number }) {
    const { text, comments, by } = props.comment;
    const { depth } = props;

    return <div style={{ marginLeft: 16 * depth }}>
        <hr />
        <div>{by}</div>
        <div dangerouslySetInnerHTML={{ __html: text }} />
        {comments?.map(comment => <Comment depth={depth + 1} key={comment.id} comment={comment} />)}
    </div>;
}

export default Comment;