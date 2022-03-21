import { useState, useEffect } from "react"
import SearchSuggestions from "./SearchSuggestions";
import SearchDDButton from "./SearchDDButton";

const Search = ({ update, initialSR  }) => {
    const [subreddit, setSR] = useState(initialSR);
    const [time, setTime] = useState("week");
    const [trend, setTrend] = useState("hot");
    const [suggestions, setSugg] = useState(false);
    const [trueVal, setTV] = useState(null);

    const changeSearch = (e) => {
        setSR(e.target.value);
        setSugg(true);
    }

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setSugg(false);
        setTV(subreddit);
    }

    const sendQueryString = () => {
        update(`${subreddit}/${trend}`, `t=${time}`);
    }

    const useSuggestion = async(sugg) => {
        sugg = sugg.substring(0, sugg.length - 1)
        setTV(sugg);
        setSR(sugg)
    }

    useEffect(() => {
        sendQueryString();
    }, [trueVal, trend, time])


    return (
        <div id="search-container">
            <div id="search">
                <form onSubmit={handleSubmit} id="search-bar">
                    <input type="text" value={subreddit} onChange={changeSearch} onClick={() => {setSugg(true)}}/>
                </form>
                <SearchDDButton 
                    initialValue={trend}
                    options={["new", "hot", "top"]}
                    select={setTrend}
                />
                <SearchDDButton 
                    initialValue={time}
                    options={["day", "week", "month", "year", "all"]}
                    select={setTime}
                />
            </div>
            <SearchSuggestions 
                suggCB={useSuggestion}
                toggle ={setSugg}
                toggled = {suggestions}
                visible = {suggestions}
                query={subreddit}
            />
        </div>
    )
}

export default Search