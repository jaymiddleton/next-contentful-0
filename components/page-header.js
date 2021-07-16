import LazyImage from './lazy-image'

export default function PostHeader({ title, subtitle, coverImage }) {
  return (
    <>
      <h6>Advertorial</h6>
      <h1>{title}</h1>
      {subtitle &&
        <h2>{subtitle}</h2>
      }
      {coverImage &&
        <LazyImage alt={title} src={coverImage?.url} width={coverImage?.width} height={coverImage?.height} />
      }
    </>
  )
}
