import {useState, useEffect, useRef} from 'react';

import Spinner from '../spinner/Spinner';

import './Catalog.scss';

const Catalog = () => {
    const perPage = 10;

    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const lastElement = useRef();
    const observer = useRef();

    const getPhoto = async () => {
        setLoading(true);
        const clientId = 'YgaAjnJcx_4-fvVGFDIbb5nD5eM-G3FPR9E44IX5jKM';
        const search = `https://api.unsplash.com/photos/?per_page=${perPage}&page=${currentPage}&client_id=`;
        const url = `${search}${clientId}`;

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
        });
    } 

    useEffect(() => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();

        const callback = function(entries) {
            if (entries[0].isIntersecting) {
                setCurrentPage(prev => prev + 1);
            }
        };

        observer.current = new IntersectionObserver(callback);
        observer.current.observe(lastElement.current);
    }, [loading])
    
    useEffect(() => {
        getFetch();
    }, [currentPage])

    const randomCardClass = () => {
        function getRandomInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let num = getRandomInRange(1, 4);

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

    function imgLoaded(event) {
        setTimeout(() => {
            event.target.style.opacity = '1';
            event.target.offsetParent.classList.add('hoverImg'); 
        }, 1000);
    }

    return (
        <div className='Catalog'>
            <div className='container'>
                <div className="wrapper">
                    {images.map((image,index) => 
                    (                                                     
                        <div className={image.size} key={index} style={{background: image.color}}>
                            <img  onLoad={imgLoaded} key={image.id} src={image.urls.regular} alt={image.description}></img> 
                        </div>                                                     
                    ))}
                </div>
                {loading ? <Spinner></Spinner> : <div ref={lastElement} style={{height: 20, background: 'red'}}/>}
            </div>
        </div>
    )
}

export default Catalog;
