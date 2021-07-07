import Image from 'next/image'
const contentfulLoader = ({src, width, quality})=>{
  return `${src}?${width && `w=${width}&` || ''}&q=${quality || 75}`
}

export default function PostHeader({ title, subtitle, coverImage }) {
  return (
    <>
      <h6>Advertorial</h6>
      <h1>{title}</h1>
      {subtitle &&
        <h2>{subtitle}</h2>
      }
      {coverImage &&
        <Image alt={title} loader={contentfulLoader} src={coverImage.url} width={coverImage.width} height={coverImage.height} />
      }
    </>
  )
}
