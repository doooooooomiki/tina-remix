import { useLoaderData, useRouteError } from '@remix-run/react';
import { useTina } from 'tinacms/dist/react';
import { client } from 'tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { LoaderFunctionArgs } from '@remix-run/node';

export default function Post() {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { props } = useLoaderData<typeof loader>();

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <div>
      <h1>{data.post.title}</h1>
      <TinaMarkdown content={data.post.body} />
    </div>
  );
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { data, query, variables } = await client.queries.post({
      relativePath: params.slug + '.md',
    });
    return {
      props: {
        data,
        query,
        variables,
      },
    };
  } catch (e) {
    throw new Response('Not Found', { status: 404 });
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div>
      <p>sheeesh...</p>
      <p>this entry does not exist</p>
    </div>
  );
}
