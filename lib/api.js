const POST_GRAPHQL_FIELDS = `
slug
title
subtitle
coverImage {
  url
  width
  height
}
bodyContent {
  json
}
disclaimer {
  json
}
callToAction
linkOut
`

const PAGE_TRACKING_SETUP_FIELDS = `
trackingSetup{
  items{
    fbId
    gaId
    gtmId
  }
}
`


async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview
            ? process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json())
}

function extractPage(fetchResponse) {
  return fetchResponse?.data?.pageCollection?.items?.[0]
}

function extractPageEntries(fetchResponse) {
  return fetchResponse?.data?.pageCollection?.items
}

export async function getFirstPage(preview) {
  const entries = await fetchGraphQL(
    `query {
      pageCollection(preview: ${preview ? 'true' : 'false'}) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  console.log('entries')
  console.log(entries)

  return extractPage(entries)

}

export async function getTrackingParamsBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      pageCollection(where: { slug: "${slug}" }, limit: 1) {
        items {
          ${PAGE_TRACKING_SETUP_FIELDS}
        }
      }
    }`,
    true
  )

  console.log(entry);
  const xst = extractPage(entry)
  console.log(xst);
  return extractPage(entry)
}

export async function getPreviewPageBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      pageCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  )

  console.log(entry);
  const xst = extractPage(entry)
  console.log(xst);
  return extractPage(entry)
}

export async function getAllPagesWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      pageCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractPageEntries(entries)
}

export async function getAllPagesForHome(preview) {
  console.log('process.env')
  console.log(process.env.NODE_ENV)
  const entries = await fetchGraphQL(
    `query {
      pageCollection(preview: ${preview ? 'true' : 'false'}) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  console.log('entries')
  console.log(entries)

  return extractPageEntries(entries)
}

export async function getPageAndMorePages(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      pageCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      pageCollection(where: { slug_not_in: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return {
    page: extractPage(entry),
    morePages: extractPageEntries(entries),
  }
}


function extractPost(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items?.[0]
}

function extractPostEntries(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items
}

export async function getPreviewPostBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  )
  return extractPost(entry)
}

export async function getAllPostsWithSlug() {
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_exists: true }, order: date_DESC) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractPostEntries(entries)
}

export async function getAllPostsForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      postCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractPostEntries(entries)
}

export async function getPostAndMorePosts(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      postCollection(where: { slug: "${slug}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      postCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries),
  }
}
