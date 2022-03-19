import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import Comment from "./Comment";

const ToggledPost = ({toggle, data}) => {
  const [comments, sCom] = useState(null)
  const selftext = data.selftext;
  const preview = data.preview ? data.preview["images"][0]["resolutions"][0] : null;
  const image = data.post_hint === "image" ? data.url : null;
  const video = (data.post_hint === "rich:video" || data.post_hint === "hosted:video") ? data.secure_media.oembed : null;
  const nsfw = data.over_18;

  useEffect(() => {
    getComments();
    console.log(data)
  }, [])

  const getComments = () => {
        const route = `https://www.reddit.com/r/${data.subreddit}/comments/${data.id}.json`;
        fetch(route)
            .then((res) => {
                res.json().then(data => {
                    data = data[1].data
                    sCom(data.children);
                    // setPosts(data);
                    // setError(false);
                }).catch(err => {
                    console.log(err);
                    // setError(true)
                })
            }).catch((err) => {
                console.log(err);
                // setError(true);
            })
  }



  return (
    <>
    <div className="toggled-post-container" onClick={(e) => {if (e.target.className==="toggled-post-container") toggle(null);}}>
        <div className="toggled-post">
        <div className="post-author post-text">{"u/"+data.author}</div>
                <div className="post-title post-text" >
                  <span className={data.upvote_ratio > 0.5 ? "ups bad" : "ups good"}>{data.ups - data.downs}</span> {data.title}
                </div>
              <div className="post-subreddit post-text">{"r/"+data.subreddit}</div>
              <div className="post-content">
                {!nsfw && 
                  <>
                    {data.is_self && <div className="selftext" markdown="1">
                    <ReactMarkdown className="md">{selftext}</ReactMarkdown> 
                    </div>}
                    {!image && !video && preview && <img className="img-toggled" src={preview.url.replaceAll("&amp;", "&")} alt=""></img>}
                    {image && !video && <img className="img-toggled" src={data.url.replaceAll("&amp;", "&")} alt = "" />}
                    {video && <div className="video" dangerouslySetInnerHTML={{__html: video.html.replaceAll("&lt;", "<").replaceAll("&gt;", ">")}}></div>}
                  </>
                }
              {nsfw && !data.is_self && <div className="nsfw">Sorry, I'm not showing you nsfw content. Too bad!</div>}

              </div>
            {/* <h1>{data.post_hint}</h1> */}
            <div className="comments">
              {comments && comments.length !== 0 && <>
              <hr></hr>
              <h2>Comments</h2>    
                {comments.map(comment => {
                  return <Comment data={comment} key={comment.data.id} />
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