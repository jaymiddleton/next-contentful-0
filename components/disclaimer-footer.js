import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
//import markdownStyles from './markdown-styles.module.css'

export default function PostBody({ disclaimerText }) {
  return (
    <div className="disclaimer">
        {documentToReactComponents(disclaimerText.json)}
    </div>
  )
}
