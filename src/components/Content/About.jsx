import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import styles from './about.module.css'

const About = ({about}) => {
  return (
    <div className={styles["about"]}>
        <ReactMarkdown>{about.data.description}</ReactMarkdown>
    </div>
  )
}

export default About