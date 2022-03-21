import styles from './post.module.css'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


const Gallery = ({ content, thumbnail }) => {
    console.log(content)

  return (
    <div className="gallery-container">
        <Carousel
            dynamicHeight={false}
            showThumbs={false}
        >
            {content.map(url => {
                return <img className='gallery-img' src={url} alt="bleh" ></img>
            })}
        </Carousel>
    </div>
  )
}

export default Gallery