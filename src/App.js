import Search from "./components/Search/Search";
import Content from "./components/Content/PostContent";
import { useState } from "react";
import { BrowserRouter as Router, Route, Switch, useParams} from 'react-router-dom';


function App() {
  const [queryString, setQuery] = useState("/r/udub");
  const [queryParams, setQP] = useState("t=week");

  return (
    <Router>
      <div className="App">
        <Search
          initialSR = {queryString}
          update = {(q, p) => {
            setQuery(q);
            setQP(p);
          }}
        />
        <Content
          query={queryString}
          queryParams={queryParams}
        />
        {/* <h1>{`${queryString}?${queryParams}`}</h1> */}
      </div>
    </Router>
  );
}

export default App;
