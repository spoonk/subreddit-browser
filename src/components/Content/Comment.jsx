import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const Comment = ({ data }) => {
  const processCommentData = (data) => {
    data = data.data;
    data = {
      id: data.id,
      author: data.author,
      body: data.body,
      body_html: data.body_html,
      is_op: data.is_submitter,
      created_utc: data.created_utc,
      score: data.score,
      replies: data.replies,
      ups: data.ups,
      downs: data.downs
    }
    return data;
  }


  const isMore = data.kind === "more";
  data = processCommentData(data);
  const replies = (isMore || data.replies === "" ) ? null : data.replies.data;


  return (
    <div className="comment" key={data.id}>
        <div className="author">
          {data.is_op ? <span className='op'> OP </span> : ""}
          {"u/"+data.author}
        </div>
        <ReactMarkdown className='comment-text'>{data.body}</ReactMarkdown>
        {data.score !== 1 && <div className={data.score >= 0 ? "ups good" : "ups bad"} >{data.ups - data.downs}</div>}
            {replies && 
              replies.children.map(reply => {
                return reply.kind === "more" ? <div className='more'>load more comments</div>: <Comment data={reply} key={reply.data.id} />
              })
            }
    </div>
  )
}

export default Comment