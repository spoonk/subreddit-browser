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
  const vidRef = useRef();
  var vid = useRef(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);


  const onLoadedData = () => {
    setIsVideoLoaded(true);
  };




  // audio for a reddit hosted video is at https://v.redd.it/VIDEO_ID/DASH_audio.mp4
    // and I need to somehow make a custom video player to merge this sound with the video . . . . . ..  .. . . . 
    //  oh crap!
  // https://stackoverflow.com/questions/20203604/how-to-mix-in-audio-to-html5-video


  // https://frontend-digest.com/responsive-and-progressive-video-loading-in-react-e8753315af51
  useEffect(() => {
    // if (video){
    //   if (richvideo){
    //     vid.current = <div className='video' dangerouslySetInnerHTML={{__html: video.html.replaceAll("&lt;", "<").replaceAll("&gt;", ">")}}></div>
    //     setVL(true);
    //   } else if (hostedvideo){
    //     vid.current = (<video ref={vidRef} autoPlay={true} controls={true}><source src={hostedvideo.fallback_url}></source></video>)
    //     // var v = document.createElement("video");
    //     // v.src = hostedvideo.fallback_url;
    //     // vid.current = <div className='video'>{v}</div>

    //     vidRef.current.oncanplay = () => {
    //       console.log("dkfsdfs")
    //     }
    //   }
    // }
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