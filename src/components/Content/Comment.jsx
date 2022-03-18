import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const Comment = ({ data }) => {
    const replies = data.replies === "" ? null : data.replies;


    
  return (
    <div className="comment">
        <div className="author">{"u/"+data.author}</div>
        <ReactMarkdown className='comment-text'>{data.body}</ReactMarkdown>
        <div className={data.score >= 0 ? "ups good" : "ups bad"} >{data.score}</div>
        {/* {
            data.replies && 
            <div className="comment">dkdkdk</div>
        } */}
    </div>
  )
}

export default Comment