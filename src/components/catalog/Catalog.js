import {useState, useEffect} from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import InfiniteScroll from 'react-infinite-scroll-component'; 
import 'react-lazy-load-image-component/src/effects/opacity.css';
import Spinner from '../spinner/Spinner';

import './Catalog.scss';

const Catalog = () => {
    let perPage = 10;

    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const getPhoto = async () => {
        let clientId = 'Hh441n7vrXtj8O9FY5254MTXTREnB0uTxZxREEKGlOU';
        let search = `https://api.unsplash.com/photos/?per_page=${perPage}&page=${currentPage}&client_id=`;
        let url = `${search}${clientId}`;

        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        } 
        
        const resJson = res.json(); 
        return await resJson;
    }  

    const getFetch = async () => {
        return await getPhoto().then(data => {
            data.forEach(i => (
                i.size = randomCardClass()
            ));
            setImages([...images, ...data]);
            setCurrentPage(prev => prev + 1);
            console.log(data);
        });
    } 

    useEffect(() => {
        getFetch();
    }, [])
    
    const randomCardClass = () => {
        let num = Math.floor(Math.random() * (Math.floor(4) - Math.ceil(1) + 1)) + Math.ceil(1);

        switch(num) {
            case 1 : num = 'small-img';
                break;
            case 2 : num = 'medium-img';
                break;
            case 3 : num = 'small-medium-img';
                break;
            default: num = 'large-img'
        }
        return num;
    }
  
    return (
        <div className='catalog'>
            <div className='container'>
                <InfiniteScroll
                    dataLength={images.length}
                    next={getFetch}
                    hasMore={true}
                    loader={<Spinner/>}
                >
                    <div className="wrapper">
                        {images.map((image,index) => (                                                             
                            <div style={{background: image.color}} className={image.size} key={index}>
                                
                                    <LazyLoadImage
                                        effect='opacity'
                                        key={image.id}
                                        src={image.urls.regular}
                                        alt={image.description}
                                        style={{width: '100%', height: '100%', objectFit: 'cover', background: image.color}}
                                    />   
                               
                            </div>                                                      
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default Catalog;

