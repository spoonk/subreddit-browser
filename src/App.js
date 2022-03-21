import Search from "./components/Search/Search";
import Content from "./components/Content/PostContent";
import { useState } from "react";


function App() {
  const [queryString, setQuery] = useState("/r/udub");
  const [queryParams, setQP] = useState("t=week");

  return (
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
    </div>
  );
}

export default App;
