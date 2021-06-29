export default function CTA({ url, text }) {
    return <p style={{textAlign:'center'}}><a href={url} className="cta btn">{text}</a></p>
  }
  