import { useState, useEffect, useRef } from "react"
import Post from "./Post";
import { GridLayout } from "@egjs/react-infinitegrid";
import { getInitialData, getMorePostData, } from "./contentUtils";
import About from "./About";
import loaderstyles from "./loader.module.css"
import ToggledPost from "./ToggledPost";
import styles from "./postContent.module.css"

const Content = ({query, queryParams}) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const [after, setAfter] = useState(null);
    const [noMorePosts, setNMP] = useState(false);
    const [postToggled, setPT] = useState(null);
    const [loading, setLoading] = useState(false);
    const timeout = useRef();
    const [aboutInfo, setAbout] = useState(null)

    useEffect(() => {
        setPosts([])
        setAbout(null)
        getInitialData(query, queryParams, setNMP, setAfter, setPosts, setError);
        let prefix = query.replaceAll(/(\/hot)*(\/top)*(\/new)*/ig, "");
        getAbout(prefix)
    }, [query, queryParams])

    const getAbout = (q, qp) => {
        const route = `https://www.reddit.com${q}/about.json`;
        fetch(route)
            .then(res => {
                res.json().then(about => {
                    if (!about.error) setAbout(about)
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

  return (
    <div className={styles["content"]}>
        {posts.length !== 0 && !error &&
            <GridLayout
                className={styles["grid"]}
                options={{ isConstantSize: false, transitionDuration: 0.2 }}
                layoutOptions={{ margin: 10, align: "center" }}
                onLayoutComplete = {() => {setLoading(false)}}
            >
                {aboutInfo && 
                    <About about={aboutInfo} />
                }
                {posts.map(postData => {
                    return <Post key={postData.name} data={postData} togglePost={setPT}/>
                })}
            </GridLayout>
        }
        {error && <div className={styles["error-fetching"]}>Error fetching content, your query may be invalid. Make sure it is of the form "/r/subreddit". Also, if you're on Firefox you may want to try a different browser</div>}
        {(!error &&  posts.length !== 0 && !noMorePosts) && 
            !loading ? 
                <button className={styles["getMore"]} onClick={!loading ? 
                    () => {getMorePostData(query, queryParams, after, timeout, setLoading, posts, setPosts, setError, setNMP, setAfter)}
                    : 
                    () => {}} >load more posts</button>
                :
                <div className={styles["loadIndicator"]}><div className={loaderstyles["lds-roller"]}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
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
