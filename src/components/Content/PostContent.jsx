import { useState, useEffect, useRef } from "react"
import Post from "./Post";
import { GridLayout } from "@egjs/react-infinitegrid";
import { getInitialData, getMorePostData, } from "./contentUtils";

import ToggledPost from "./ToggledPost";


const Content = ({query, queryParams}) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const [after, setAfter] = useState(null);
    const [noMorePosts, setNMP] = useState(false);
    const [postToggled, setPT] = useState(null);
    const [loading, setLoading] = useState(false);
    const timeout = useRef();

    useEffect(() => {
        getInitialData(query, queryParams, setNMP, setAfter, setPosts, setError);
    }, [query, queryParams])


// https://www.npmjs.com/package/@egjs/react-infinitegrid
  return (
    <div id="content">
        {posts.length !== 0 && !error &&
            <GridLayout
                className="grid"
                options={{ isConstantSize: false, transitionDuration: 0.2 }}
                layoutOptions={{ margin: 10, align: "center" }}
                onLayoutComplete = {() => {setLoading(false)}}
            >
                {posts.map(postData => {
                    return <Post key={postData.name} data={postData} togglePost={setPT}/>
                })}
            </GridLayout>
        }
        {error && <div className="error-fetching">Error fetching content, your query may be invalid. Make sure it is of the form "/r/subreddit"</div>}
        {(!error &&  posts.length !== 0 && !noMorePosts) && 
            !loading ? 
                <button className="getMore" onClick={!loading ? 
                    () => {getMorePostData(query, queryParams, after, timeout, setLoading, posts, setPosts, setError, setNMP, setAfter)}
                    : 
                    () => {}} >load more posts</button>
                :
                <div className="getMore loadIndicator"> loading.... </div>
        }

        {postToggled && 
          <ToggledPost 
            toggle={setPT}
            data={postToggled}
            query={query}
            queryParams={queryParams}
          />
        }
    </div>
  )
}

export default Content