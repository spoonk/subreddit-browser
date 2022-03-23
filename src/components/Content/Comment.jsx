import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { processCommentData } from './contentUtils'
import {useState, useEffect} from 'react'
import styles from "./comment.module.css"


const Comment = ({ data, parentID }) => {
  const isMore = data.kind === "more";
  data = processCommentData(data);
  const replies = (isMore || data.replies === "" ) ? null : data.replies.data;
  const post_flair = data.author_flair_text;

  const utc = data.created_utc
  const [days, setDays] = useState(null)
  const [hours, setHours] = useState(null)
  const [minutes, setMinutes] = useState(null)


  useEffect(()=> {
    const handleTimes = () => {
      const now = Math.round(Date.now() / 1000); 
      var diff = now - utc;
      var days = Math.floor(diff / (60 * 60 * 24));
      diff -= days * 60 * 60 * 24;
      var hours = Math.floor(diff / 3600);
      diff -= hours;
      var minutes = Math.floor(diff / 60)
      setDays(days);
      setHours(hours);
      setMinutes(minutes)
    }

    handleTimes();
  }, [utc])


  return (
    <div className={styles["comment"]}>
        <div className={styles["author"]}>
          {data.is_op ? 
            <span className={styles["op"]}> OP </span> 
            : 
            <></>}
          <span className={styles["comment-author"]}>{"u/"+data.author}</span> 
          {post_flair && 
            <span
              className={styles["comment-flair"]}
              style={{
                backgroundColor: data["author_flair_background_color"] ? data["author_flair_background_color"] : "rgb(36, 253, 152)",
                color: data["author_flair_text_color"] === "light" ? "white" : "black"
              }}
            >
                {post_flair}
              </span>
          }
          {days >= 1 ? 
            <div className={styles["comment-time"]}>{days} day{days !== 1 ? "s" : ""} ago</div>
            :
            hours >= 1 ? 
              <div className={styles["comment-time"]}>{hours} hr{hours !== 1 ? "s" : ""} ago</div>
              :
              <div className={styles["comment-time"]}>{minutes} min{minutes !== 1 ? "s" : ""} ago</div>  
          }
        </div>
        
        <ReactMarkdown className={styles["comment-text"]}>{data.body}</ReactMarkdown>
        {data.score !== 1 && 
          <div className={data.score >= 0 ? "ups good" : "ups bad"}>
            {data.ups - data.downs}
          </div>}
        {replies && 
          replies.children.map(reply => {
            return reply.kind === "more" ? 
              <> </> // unfortunately, I can't load more without being authenticated, which I'll do on the next iteration of this project (when I completely redo it with more features)
              : 
                <Comment data={reply} key={reply.data.id + reply.data.created_utc} parentID={data.id} />
          })
        }
    </div>
  )
}

export default Comment