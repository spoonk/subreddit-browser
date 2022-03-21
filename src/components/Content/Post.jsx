import ReactMarkdown from 'react-markdown'
import styles from './post.module.css'
import { useEffect, useState } from 'react';
import Gallery from './Gallery';

const Post = ({ data, togglePost }) => {
  const nsfw = data.over_18;
  const selftext = data.selftext;
  const preview = data.preview ? data.preview["images"][0]["resolutions"][0] : null;
  const image = data.post_hint === "image" ? data.url : null;
  var hostedvideo = (data.post_hint === "hosted:video") ? data.secure_media.reddit_video : null;
  var richvideo = (data.post_hint === "rich:video") ? data.secure_media.oembed : null;
  var link = (data.post_hint === "link") ? data.url : null;
  var gallery = data.is_gallery;

  if(gallery) console.log(data)

  const video = (hostedvideo || richvideo) ?
        hostedvideo ?
          <div className='rich-video'>
          <video controls>
            <source src={hostedvideo.fallback_url}></source>
          </video>
          </div>
          :
          <div className='rich-video' dangerouslySetInnerHTML={{__html: richvideo.html.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")}}></div>
      : null;


  useEffect(() => {
    
  }, [])


  return (
    <div className={styles.post} onClick={() => {togglePost(data)}}>
      <div className={`${styles["post-subreddit"]} ${styles["post-text"]}`}>{"r/"+data.subreddit}</div>
        <div className={`${styles["post-title"]} ${styles["post-text"]}`} >
          <span className={data.upvote_ratio > 0.5 ? "ups bad" : "ups good"}>{data.ups - data.downs}</span>
          <ReactMarkdown >{data.title}</ReactMarkdown>
        </div>
        {gallery && <h3>[gallery]</h3>}
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
                <a href={data.url} className="post-link" target="_blank">{data.url}</a>
            }
             { gallery && 
                <img className={styles["post-img"]}  src={data.thumbnail} alt = "" />
            }

          </>
        }
        {nsfw && !data.is_self && <div className={styles["nsfw"]}>Sorry, I'm not showing you nsfw content. Too bad!</div>}
      </div>
  </div>)
}

export default Post 