import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import styles from './gallery.module.css'


const Gallery = ({ content, thumbnail }) => {

  return (
    <div className={styles["gallery-container"]}>
        <Carousel
            dynamicHeight={false}
            showThumbs={false}
        >
            {content.map(url => {
                return <img className={styles['gallery-img']} src={url} alt="bleh" ></img>
            })}
        </Carousel>
    </div>
  )
}

export default Gallery