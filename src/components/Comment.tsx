import { IComment } from "../Items";

function Comment(props: { comment: IComment, depth: number }) {
    const { text, comments } = props.comment;
    const { depth } = props;

    return <div style={{marginLeft: 16 * depth}}>
        {text}
        {comments?.map(comment => <Comment depth={depth + 1} key={comment.id} comment={comment} />)}
    </div>;
}

export default Comment;