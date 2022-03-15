import React from 'react'
import { useState } from 'react'

const SearchDDButton = (  {initialValue, options, select}  ) => {
    const [toggled, toggle] = useState(false);



  return (
    <div className="dropdown-button" onClick={() => toggle(!toggled)}>
        {initialValue}
        {toggled && 
            <div className="dd-container">
                {options.map(opt => {
                    return <div className="dd-option" key={opt} onClick={() => select(opt)}>
                        {opt}
                    </div>
                })}
            </div>
        }
    </div>
  )
}

export default SearchDDButton