import { useState, useRef, useEffect } from "react"

const defaultWidth = 960

export default function LazyImage(props){

    const {src, width, height, className, ...attr} = props
    const w = width && width < defaultWidth ? width : defaultWidth

    const pictureRef = useRef(null)
    const [wasShown, setWasShown] = useState(false)
    
    useEffect(() => {
      
        if(!wasShown){
            const observer = new IntersectionObserver((entries)=>{
                const [ image ] = entries
                setWasShown(wasShown=>image.isIntersecting)
            })
            if (pictureRef.current){ 
                observer.observe(pictureRef.current)  
            }
        }
      
      return () => {
        if(pictureRef.current) observer.unobserve(pictureRef.current)
      }
    }, [pictureRef, wasShown])



    return(
        <picture>
            <source 
                data-src={`${src}?fm=webp&q=${wasShown ? 80 : 1}&w=${w}`}
                data-srcset={`${src}?fm=webp&q=80&w=${w}`} type="image/webp"
            />
            <img
                className={`lazyimg ${className || ''}`}
                src={`${src}?fm=${wasShown && 'jpg' || 'png'}&q=${wasShown ? 90 : 1}&w=${w}`}
                data-src={`${src}?fm=jpg&q=90&w=${w}`}
                {...attr}
            />
        </picture>
    )    
}