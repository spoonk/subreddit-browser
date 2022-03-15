import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import Comment from "./Comment";

const ToggledPost = ({toggle, data, query, queryParams}) => {
  const [comments, sCom] = useState(null)
  const selftext = data.selftext;
  const preview = data.preview ? data.preview["images"][0]["resolutions"][0] : null;
  const image = data.post_hint === "image" ? data.url : null;
  const video = data.post_hint === "rich:video" ? data.secure_media.oembed : null;
  const nsfw = data.over_18;

  useEffect(() => {
    getComments();
  }, [])

  const getComments = () => {
        const route = `http://www.reddit.com/r/${data.subreddit}/comments/${data.id}.json`;
        fetch(route)
            .then((res) => {
                res.json().then(data => {
                    data = processComments(data);
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

  const processComments = (commentdata) => {
    commentdata = commentdata[1].data
    var comments = commentdata.children.map(data => {
      data = data.data
      return {
        author: data["author"],
        author_flair_color: data["author_flair_background_color"],
        author_flair_text: data["author_flair_text"],
        author_flair_text_color: data["author_flair_text_color"],
        body: data["body"],
        created_time_utc: data["created_utc"],
        id: data["id"],
        replies: data["replies"],
        score: data["score"],
        ups: data["ups"],
        downs: data["downs"]
      }
    })
    sCom(comments);
  } 

  return (
    <div className="toggled-post-container" onClick={() => toggle(null)}>
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
                    {!image  && preview && <img className="img-toggled" src={preview.url.replaceAll("&amp;", "&")} alt=""></img>}
                    {image && <img className="img-toggled" src={data.url.replaceAll("&amp;", "&")} alt = "" />}
                    {video && <div className="video" dangerouslySetInnerHTML={{__html: video.html.replaceAll("&lt;", "<").replaceAll("&gt;", ">")}}></div>}
                  </>
                }
              {nsfw && !data.is_self && <div className="nsfw">Sorry, I'm not showing you nsfw content. Too bad!</div>}

              </div>
            {/* <h1>{data.post_hint}</h1> */}
            <div className="comments">
              {comments && comments.length !== 0&& <>
              <hr></hr>
              <h2>Comments</h2>    
                {comments.map(comment => {
                  return <Comment key={comment.id} data={comment} />
                })}

                </>
              }
            </div>
        </div>
    </div>
  )
}

export default ToggledPost