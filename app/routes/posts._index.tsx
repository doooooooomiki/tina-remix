import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { useTina } from 'tinacms/dist/react';
import { client } from 'tina/__generated__/client';

export default function PostList() {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { props } = useLoaderData<typeof loader>();

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const postsList = data.postConnection.edges;

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {postsList.map((post) => (
          <div key={post.node.id}>
            <Link to={`/posts/${post.node._sys.filename}`}>
              {post.node._sys.filename}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export const loader = async () => {
  const { data, query, variables } = await client.queries.postConnection();

  return {
    props: {
      data,
      query,
      variables,
    },
  };
};
