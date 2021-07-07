import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
//import markdownStyles from './markdown-styles.module.css'

export default function PostBody({ disclaimer }) {
  return (
    <div className="disclaimer">
        {documentToReactComponents(disclaimer.json)}
    </div>
  )
}
