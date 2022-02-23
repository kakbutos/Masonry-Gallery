import {useState, useEffect, useRef} from 'react';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import InfiniteScroll from 'react-infinite-scroll-component'; 

import Spinner from '../spinner/Spinner';

import './Catalog.scss';

const Catalog = () => {
    let perPage = 10;

    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const lastElement = useRef();
    const observer = useRef();

    const getPhoto = async () => {
        setLoading(true);
        let clientId = 'YgaAjnJcx_4-fvVGFDIbb5nD5eM-G3FPR9E44IX5jKM';
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
            setLoading(false);
            console.log(data);
        });
    } 

    useEffect(() => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        const callback = function(entries) {
            if (entries[0].isIntersecting) {
                setCurrentPage(prev => prev + 1);
                console.log('vidno');
            }
        };
        observer.current = new IntersectionObserver(callback);
        observer.current.observe(lastElement.current);
    }, [loading])
    
    useEffect(() => {
        getFetch();
        console.log(currentPage);
    }, [currentPage])

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
        <div className='Catalog'>
            <div className='container'>
                <div className="wrapper">
                    {images.map((image,index) => 
                    (                                                        
                        <div className={image.size} key={index} style={{background: image.color}}>
                            <img key={image.id} src={image.urls.regular} alt={image.description}></img>  
                        </div>                                                     
                    ))}
                </div>
                {loading ? <Spinner></Spinner> : <div ref={lastElement} style={{height: 20, background: 'red'}}/>}
            </div>
        </div>
    )
}

export default Catalog;

// <InfiniteScroll
// dataLength={images.length}
// next={getFetch}
// hasMore={true}
// loader={<Spinner/>}
// >
// <div className="wrapper">
//     {images.map((image,index) => (                                                               
//         <div className={image.size} key={index}>
//             <span>
//             <LazyLoadImage
//                 key={image.id}
//                 src={image.urls.regular}
//                 alt={image.description}
//                 style={{width: '100%', height: '100%', objectFit: 'cover', background: image.color}}
//             />   
//             </span>
//         </div>                                                      
//     ))}
// </div>
// </InfiniteScroll> 
