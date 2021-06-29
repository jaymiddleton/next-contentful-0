import Image from 'next/image'

export default function PostHeader({ headline, subhead, heroImage }) {
  return (
    <>
      <h6>Advertorial</h6>
      <h1>{headline}</h1>
      {subhead &&
        <h2>{subhead}</h2>
      }
      <Image alt={headline} src={heroImage.url} width={heroImage.width} height={heroImage.height} />
    </>
  )
}
