const POST_GRAPHQL_FIELDS = `
slug
headline
subhead
heroImage {
  url
  width
  height
}
bodyText {
  json
}
disclaimerText {
  json
}
cta
linkOut
`

async function fetchGraphQL(query, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json())
}

function extractPage(fetchResponse) {
  return fetchResponse?.data?.firstTypeCollection?.items?.[0]
}

function extractPageEntries(fetchResponse) {
  return fetchResponse?.data?.firstTypeCollection?.items
}

export async function getFirstPage(preview) {
  const entries = await fetchGraphQL(
    `query {
      firstTypeCollection(preview: ${preview ? 'true' : 'false'}) {
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

export async function getPreviewPageBySlug(slug) {
  const entry = await fetchGraphQL(
    `query {
      firstTypeCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
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
      firstTypeCollection(where: { slug_exists: true }, order: date_DESC) {
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
      firstTypeCollection(preview: ${preview ? 'true' : 'false'}) {
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
      firstTypeCollection(where: { slug: "${slug}" }, preview: ${
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
      firstTypeCollection(where: { slug_not_in: "${slug}" }, preview: ${
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
