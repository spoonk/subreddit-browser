import React from 'react'
import { useState, useEffect, useRef } from 'react';

const SearchSuggestions = ({toggle, toggled, visible, query, suggCB}) => {

    const [suggestions, setS] = useState(null);
    const timeout = useRef();

    useEffect(() => {
        debounceSearch();
    }, [query])

    // https://www.codingdeft.com/posts/react-debounce-throttle/
    const debounceSearch = () => {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(() => {
            getSuggestions();    
        }, 200)
    }

    const setSuggestion = (sugg) => {
        suggCB(sugg)
    }

    const getSuggestions = () => {
        fetch(`https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${query}&raw_json=1&gilding_detail=1`)
            .then(res => {
                res.json().then(data => {
                    var list = data.data.children
                    list = list.map(elm => {
                        elm = elm.data;
                        return {
                            color: elm.banner_background_color,
                            display_name: elm.display_name,
                            title: elm.title,
                            subscribers: elm.subscribers,
                            icon: elm.community_icon,
                            url: elm.url
                        }
                    })
                    setS(list);
                })
            }).catch(err => console.log(err))
    }

  return (
    <div id="search-suggestions-container" 
        className={visible ? "container-visible" : "container-invisible"}
        onClick={() => {toggle(false);}}>
        {suggestions && 
            <div   className={toggled ? "suggestions container-visible" : "suggestions container-invisible"}>
                    <>
                        {suggestions.map(sug => {
                            return <div 
                                    className="subreddit-suggestion" 
                                    key={sug.display_name}
                                    onClick={() => {if (toggled) setSuggestion(sug.url)}}
                                >
                                <img className='sug-icon' alt={`${sug.display_name} icon`} src={sug.icon} />
                                <div className="sug-field sug-display-name">{sug.display_name}</div>
                                {sug.subscribers && <div className="sug-field sug-members" >{sug.subscribers} members</div>}
                            </div>
                        })}
                    </>
            </div>}
    </div>
  )
}

export default SearchSuggestions