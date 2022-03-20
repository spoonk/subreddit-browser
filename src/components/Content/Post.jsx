import ReactMarkdown from 'react-markdown'
import { useEffect, useState, useRef } from 'react';

const Post = ({ data, togglePost }) => {
  const nsfw = data.over_18;
  const selftext = data.selftext;

  const preview = data.preview ? data.preview["images"][0]["resolutions"][0] : null;
  const image = data.post_hint === "image" ? data.url : null;

  const hostedvideo = (data.post_hint === "hosted:video") ? data.secure_media.reddit_video : null;
  const richvideo = (data.post_hint === "rich:video") ? data.secure_media.oembed : null;
  const video = hostedvideo || richvideo;
  const [vidLoaded, setVL] = useState(null);

  const link = data.post_hint === "link" ? data.url : null;
  var vid = useRef(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);


  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };

  useEffect(() => {

  }, [])

  return (
    <div className="post" data-height="100px" onClick={() => togglePost(data)}>
      <div className="post-subreddit post-text">{"r/"+data.subreddit}</div>
        <div className="post-title post-text" >
          <span className={data.upvote_ratio > 0.5 ? "ups bad" : "ups good"}>{data.ups - data.downs}</span> {data.title}
        </div>
      <div className="post-author post-text">{"u/"+data.author}</div>
      <div className="post-content">
        {!nsfw && 
          <>
            {/* text post */}
            {data.is_self && <div className="selftext" markdown="1"><ReactMarkdown>{selftext}</ReactMarkdown> </div>}
            {/* image post */}
            {image && !video && <img data-height="10" className="post-img" src={data.url.replaceAll("&amp;", "&")} alt = "" />}
            {/* link post */}

            {/* video post */}
            {(!image && video && hostedvideo && preview) && <>
                {vidLoaded ? vid.current:<img className="post-img" src={preview.url.replaceAll("&amp;", "&")} alt=""></img> }
              </>
            }

          </>
        }
      {nsfw && !data.is_self && <div className="nsfw">Sorry, I'm not showing you nsfw content. Too bad!</div>}

      </div>
    <h1>{data.post_hint}</h1> 
  </div>)
}

export default Post 