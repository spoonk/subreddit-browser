import React from 'react'
import { useState } from 'react'
import styles from "./dropdown.module.css"

const SearchDDButton = (  {initialValue, options, select}  ) => {
    const [toggled, toggle] = useState(false);

  return (
    <div className={styles["dropdown-button"]} onClick={() => toggle(!toggled)}>
        {initialValue}
        {toggled && 
            <div className={styles["dd-container"]}>
                {options.map(opt => {
                    return <div className={styles["dd-option"]} key={opt} onClick={() => select(opt)}>
                        {opt}
                    </div>
                })}
            </div>
        }
    </div>
  )
}

export default SearchDDButton