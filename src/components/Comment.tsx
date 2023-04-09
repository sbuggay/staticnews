import { IComment } from "../Items";

function Comment(props: { comment: IComment }) {
    const { id, text, comments, by, dead, deleted, score, parent, depth } = props.comment;

    if (!text || dead || deleted) return null;

    return <div id={`${id}`} className="c">
        <input defaultChecked type="checkbox" id={`c-${id}`}></input>
        <div className="controls">
            <span className="by">{by}</span>
            <span>|</span>
            {(depth > 0) && (
                <>
                    <a href={`#${parent}`}>parent</a>
                </>
            )}
            <label className="collapse" htmlFor={`c-${id}`}>[-]</label>
            <label className="expand" htmlFor={`c-${id}`}>[+]</label>
        </div>
        <br />
        <div className="children">
            <div dangerouslySetInnerHTML={{ __html: text }} />
            <br />
            {comments?.map(comment => <Comment key={comment.id} comment={comment} />)}
        </div>
    </div>;
}

export default Comment;