import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

const About = ({about}) => {
  return (
    <div className="about">
        <ReactMarkdown>{about.data.description}</ReactMarkdown>
    </div>
  )
}

export default About