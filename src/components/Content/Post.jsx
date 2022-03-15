import ReactMarkdown from 'react-markdown'

const Post = ({ data, togglePost }) => {
    // const [selftext, setSelftext] = useState()
    const selftext = data.selftext;
    const preview = data.preview ? data.preview["images"][0]["resolutions"][0] : null;
    const image = data.post_hint === "image" ? data.url : null;
    const video = data.post_hint === "rich:video" ? data.secure_media.oembed : null;
    const nsfw = data.over_18;

    return (
      <div className="post" onClick={() => togglePost(data)}>
              <div className="post-author post-text">{"u/"+data.author}</div>
                <div className="post-title post-text" >
                  <span className={data.upvote_ratio > 0.5 ? "ups bad" : "ups good"}>{data.ups - data.downs}</span> {data.title}
                </div>
              <div className="post-subreddit post-text">{"r/"+data.subreddit}</div>
              <div className="post-content">
                {!nsfw && 
                  <>
                    {data.is_self && <div className="selftext" markdown="1">
                    <ReactMarkdown>{selftext}</ReactMarkdown> 
                    </div>}
                    {!image  && preview && <img className="post-img" src={preview.url.replaceAll("&amp;", "&")} alt=""></img>}
                    {image && <img className="post-img" src={data.url.replaceAll("&amp;", "&")} alt = "" />}
                    {video && <div className="video" dangerouslySetInnerHTML={{__html: video.html.replaceAll("&lt;", "<").replaceAll("&gt;", ">")}}></div>}
                  </>
                }
              {nsfw && !data.is_self && <div className="nsfw">Sorry, I'm not showing you nsfw content. Too bad!</div>}

              </div>
            {/* <h1>{data.post_hint}</h1>  */}
      </div>
    )
}

export default Post 