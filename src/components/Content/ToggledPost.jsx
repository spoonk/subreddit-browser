import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import Comment from "./Comment";
import styles from "./post.module.css"
import tstyles from "./togglePost.module.css"
import Gallery from "./Gallery";

const ToggledPost = ({toggle, data}) => {
  const nsfw = data.over_18;
  const selftext = data.selftext;
  const preview = data.preview ? data.preview["images"][0]["resolutions"][0] : null;
  const image = data.post_hint === "image" ? data.url : null;
  var hostedvideo = (data.post_hint === "hosted:video") ? data.secure_media.reddit_video : null;
  var richvideo = (data.post_hint === "rich:video") ? data.secure_media.oembed : null;
  var link = (data.post_hint === "link") ? data.url : null;
  var gallery = data.is_gallery;

  const utc = data.created_utc
  const [days, setDays] = useState(null)
  const [hours, setHours] = useState(null)
  const [minutes, setMinutes] = useState(null)
  const post_flair = data.link_flair_text;

  const [galleryContent, setGallery] = useState(gallery)

  const [comments, sCom] = useState(null)


  const video = (hostedvideo || richvideo) ?
  hostedvideo ?
    <div className={styles['rich-video']}>
    <video controls>
      <source src={hostedvideo.fallback_url}></source>
    </video>
    </div>
    :
    <div className={styles['rich-video']} dangerouslySetInnerHTML={{__html: richvideo.html.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")}}></div>
: null;

  useEffect(() => {
    const getComments = () => {
      const route = `https://www.reddit.com/r/${data.subreddit}/comments/${data.id}.json`;
      fetch(route)
          .then((res) => {
              res.json().then(data => {
                  data = data[1].data
                  sCom(data.children);
              }).catch(err => {
                  console.log(err);
              })
          }).catch((err) => {
              console.log(err);
          })
  }
    getComments();
    if (gallery){
      fetch(data.url.replaceAll("/gallery/", "/comments/") + ".json")
        .then(res => {
          console.log(data)
          res.json().then(data => {
            console.log(data)
            data = Object.values(data[0].data.children[0].data.media_metadata)
            data = data.map(dict => dict.s.u.replaceAll("&amp;", "&"))
            setGallery(data)
          }).catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }
    const handleTimes = () => {
      const now = Math.round(Date.now() / 1000); // reddit measures time in seconds, whereas javascript measures time in milliseconds
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
  }, [data, gallery, utc])


  return (
    <>
    <div className="toggled-post-container" onClick={(e) => {if (e.target.className==="toggled-post-container") toggle(null);}}>
        <div className={tstyles["toggled-post"]}>
          <div className="exit-button" onClick={(e) => {if (e.target.className==="exit-button") toggle(null);}}></div>
          <div className={`${styles["post-subreddit"]} ${styles["post-text"]}`}>
            {"r/"+data.subreddit} 
            <span style={{fontSize: "8px", paddingLeft:"10px", paddingRight:"10px"}}>●</span>
            {days >= 1 ? 
              <div>{days} day{days !== 1 ? "s" : ""} ago</div>
              :
              hours >= 1 ? 
                <div>{hours} hour{hours !== 1 ? "s" : ""} ago</div>
                :
                <div>{minutes} minute{minutes !== 1 ? "s" : ""} ago</div>  
                }
              </div>
              <div className={`${styles["post-title"]} ${styles["post-text"]}`} >
                <span style={{paddingRight: "10px"}} className={data.upvote_ratio > 0.5 ? "ups bad" : "ups good"}>{data.ups - data.downs}</span>
                {data.title}
              </div>
              {post_flair && 
                <div 
                  className={styles["flair"]} 
                  style={{
                    backgroundColor: data["link_flair_background_color"] ? data["link_flair_background_color"] : "rgb(36, 253, 152)",
                    color: data["link_flair_text_color"] === "light" ? "white" : "black"
                  }}
                >
                    {post_flair}
                  </div>
              }
            <div className={`${styles["post-author"]} ${styles["post-text"]}`}>
              {"u/"+data.author}
            </div>
            <div className={styles["post-content"]}>
              {!nsfw && 
                <>
                  {selftext && 
                    <div className={styles["selftext"]}><ReactMarkdown>{selftext}</ReactMarkdown></div>
                  }
                  {(image && !video) && 
                    <img className={styles["post-img"]} src={data.url.replaceAll("&amp;", "&")} alt = "" />
                  }
                  {(video) && 
                    <>
                      <img className={styles["post-img"]} style={{opacity: "0"}} src={preview.url.replaceAll("&amp;", "&")} alt = "" />
                      {video}
                    </>
                  }
                  {link && 
                      <a href={data.url} className={styles["post-link"]} target="_blank" rel="noreferrer">{data.url}</a>
                  }
                  { (gallery && (galleryContent === gallery)) && 
                      <img className={styles["post-img"]} style={{opacity: "0", height:"40%"}} src={data.thumbnail.replaceAll("&amp;", "&")} alt = "" />
                  }
                  { (gallery && (galleryContent !== gallery)) && 
                      <Gallery content={galleryContent} thumbnail={data.thumbnail} />
                  }
                </>
              }
              {nsfw && !data.is_self && <div className={styles["nsfw"]}>Sorry, I'm not showing you nsfw content. Too bad!</div>}
            </div>
            <div>
              {comments && comments.length !== 0 && <>
              <hr></hr>
              <h2>Comments</h2>    
                {comments.map(comment => {
                  return comment.kind === "more" ? 
                    <></>
                    : 
                    <Comment data={comment} key={comment.data.id + comment.data.created_utc} parentID={comment.data.id} />
                })}
                </>
              }
            </div>
        </div>
      </div>
    </>
  )
}

export default ToggledPost