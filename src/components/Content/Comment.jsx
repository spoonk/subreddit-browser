import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { processCommentData } from './contentUtils';
import styles from "./comment.module.css"


const Comment = ({ data }) => {
  const isMore = data.kind === "more";
  data = processCommentData(data);
  const replies = (isMore || data.replies === "" ) ? null : data.replies.data;

  return (
    <div className={styles["comment"]}>
        <div className={styles["author"]}>
          {data.is_op ? 
            <span className={styles["op"]}> OP </span> 
            : 
            <></>}
          {"u/"+data.author}
        </div>
        <ReactMarkdown className={styles["comment-text"]}>{data.body}</ReactMarkdown>
        {data.score !== 1 && 
          <div className={data.score >= 0 ? "ups good" : "ups bad"}>
            {data.ups - data.downs}
          </div>}
        {replies && 
          replies.children.map(reply => {
            return reply.kind === "more" ? 
                <div className={styles["more"]}>load more comments</div>
              : 
                <Comment data={reply} key={reply.data.id} />
          })
        }
    </div>
  )
}

export default Comment