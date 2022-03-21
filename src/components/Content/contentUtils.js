export const processCommentData = (data) => {
    data = data.data;
    data = {
        id: data.id,
        author: data.author,
        body: data.body,
        body_html: data.body_html,
        is_op: data.is_submitter,
        created_utc: data.created_utc,
        score: data.score,
        replies: data.replies,
        ups: data.ups,
        downs: data.downs
    }
    return data;
}
export const processPostData = (data, setNMP, setAfter) => {
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
            created_utc: l["created_utc"],
            author: l["author"],
            name: l["name"],
            is_self: l["is_self"],
            id: l["id"],
            is_gallery: l["is_gallery"]
        }
    })
    return listings;
}

export const getInitialData = (query, queryParams, setNMP, setAfter, setPosts, setError) => {
    const route = `https://www.reddit.com${query}.json?${queryParams}`;
    fetch(route)
        .then((res) => {
            res.json().then(data => {
                data = processPostData(data, setNMP, setAfter);
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
export const getMorePostData = (query, queryParams, after, timeout, setLoading, posts, setPosts, setError, setNMP, setAfter) => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
        setLoading(true);
        const route = `https://www.reddit.com${query}.json?${queryParams}&after=${after}`;
        fetch(route)
            .then((res) => {
                res.json().then(data => {
                    data = processPostData(data, setNMP, setAfter);
                    var postKeys = posts.map(post => {return post.id});
                    data = data.filter(data => !postKeys.includes(data.id))
                    data = [...posts, ...data];
                    setPosts(data);
                    setError(false);
                }).catch(err => {
                    console.log(err);
                    setError(true);
                    setLoading(false);
                })
            }).catch((err) => {
                console.log(err);
                setError(true);
                setLoading(false);
            })
    }, 100)
}