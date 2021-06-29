import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import Container from '../components/container'
import CTA from '../components/cta-button'
import PageBody from '../components/page-body'
import Header from '../components/header'
import PageHeader from '../components/page-header'
import DisclaimerFooter from '../components/disclaimer-footer'
import Layout from '../components/layout'
import { getFirstPage, getAllPagesWithSlug } from '../lib/api'
import PostTitle from '../components/post-title'
import { CMS_NAME } from '../lib/constants'

const today = new Date()

export default function Page({ page, preview }) {
  const router = useRouter()

  if (!router.isFallback && !page) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>
                  {page.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={page.heroImage && page.heroImage.url} />
              </Head>
              <PageHeader
                headline={page.headline}
                heroImage={page.heroImage}
                subhead={page.subhead}
              />
              <PageBody content={page.bodyText} />
              {page.cta && page.linkOut &&
                <CTA text={page.cta} url={page.linkOut} />
              }
              {page.disclaimerText &&
                <DisclaimerFooter disclaimerText={page.disclaimerText} />
              }
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getFirstPage(preview)

  return {
    props: {
      preview,
      page: data ?? null,
    },
  }
}
