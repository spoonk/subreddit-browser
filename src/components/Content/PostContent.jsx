import { useState, useEffect, useRef } from "react"
import Post from "./Post";
import { MasonryInfiniteGrid, PackingInfiniteGrid } from "@egjs/react-infinitegrid";
import ToggledPost from "./ToggledPost";


const Content = ({query, queryParams}) => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(false);
    const [after, setAfter] = useState(null);
    const [noMorePosts, setNMP] = useState(false);
    const [postToggled, setPT] = useState(null);
    var fetching = false;
    const timeout = useRef();


    useEffect(() => {
        getInitialData();
    }, [query, queryParams])


    window.onresize = () => {

    }

    const getInitialData = () => {
        const route = `https://www.reddit.com${query}.json?${queryParams}`;
        fetch(route)
            .then((res) => {
                res.json().then(data => {
                    data = processPostData(data);
                    setPosts(data);
                    setError(false);
                }).catch(err => {
                    console.log(err);
                    setError(true)
                })
            }).catch((err) => {
                console.log(err);
                setError(true);
            })
    }

    // debounce this
    const getMorePostData = () => {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            fetching = true;
            const route = `https://www.reddit.com${query}.json?${queryParams}&after=${after}`;
            fetch(route)
                .then((res) => {
                    res.json().then(data => {
                        data = processPostData(data);
                        data = [...posts, ...data];
                        setPosts(data);
                        setError(false);
                        fetching = false;
                    }).catch(err => {
                        console.log(err);
                        setError(true);
                        fetching = false;
                    })
                }).catch((err) => {
                    console.log(err);
                    setError(true);
                    fetching = false;
                })
        }, 100)
    }

    // assuming no errors in fetching
    const processPostData = (data) => {
        data = data["data"];
        var listings = data["children"];
        const dist = data["dist"];
        if (dist === 0) setNMP(true);
        setAfter(data["after"]);

        listings = listings.map(listing => {
            const l = listing["data"];
            return {
                ups: l["ups"],
                downs: l["downs"],
                up_ratio: l["upvote_ratio"],
                title: l["title"],
                url: l["url"],
                thumbnail: l["thumbnail"],
                subreddit: l["subreddit"],
                selftext: l["selftext"],
                secure_media: l["secure_media"],
                preview: l["preview"],
                permalink: l["permalink"],
                post_hint: l["post_hint"],
                over_18: l["over_18"],
                is_video: l["is_video"],
                created: l["created"],
                author: l["author"],
                name: l["name"],
                is_self: l["is_self"], // tells us if this is just a text post
                id: l["id"]
            }
        })
        return listings;
    }


    
  return (
    //   https://github.com/naver/egjs-infinitegrid/wiki/react-infinitegrid-API-documentation
    // https://naver.github.io/egjs-grid/storybook/?path=/story/introduction--page
    // https://naver.github.io/egjs-grid/release/latest/doc/Grid.MasonryGrid.html#columnSize
    <div id="content">
        {/* {posts.length !== 0 && !error && posts.map(postData => { */}
            {/* return <Post key={postData.name} data={postData} /> */}
        {/* })} */}
        {posts.length !== 0 && !error &&
            <MasonryInfiniteGrid
                className="grid"
                gap={8}
                align={"center"}
            >
            {posts.map(postData => {
                return <Post key={postData.name} data={postData} togglePost={setPT}/>
            })}
            </MasonryInfiniteGrid>
        }
        {error && <div className="error-fetching">Error fetching content, your query may be invalid. Make sure it is of the form "/r/subreddit"</div>}
        {!error &&  posts.length !== 0 && !noMorePosts && <button className="getMore" onClick={!fetching ? getMorePostData : () => {}} >load more posts</button>}

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