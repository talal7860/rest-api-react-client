import { useState } from 'react';
import { isEmpty } from 'lodash/fp';
import Repo from './Repo';

const FeedRepos = ({ loading, repos, fetchMore }) => {
  const [page, setPage] = useState(1);
  const [noLoadMore, setNoLoadMore] = useState(false);
  const loadMore = () => {
    fetchMore({
      query: { page: page + 1 },
      updateQuery(prev, { fetchMoreResult, error }) {
        if (!error) {
          if (isEmpty(fetchMoreResult)) {
            setNoLoadMore(true);
            return prev;
          } else {
            setPage(page + 1);
            return [...prev, ...fetchMoreResult];
          }
        }
      },
    });
  };

  return (
    <>
      {loading ? 'Loading...' : null}
      <div>
        {(repos || []).map((repo) => (<Repo key={repo.id} repo={repo} />))}
      </div>
      Page: {page}
      <button disabled={isEmpty(repos) || loading || noLoadMore} onClick={loadMore}>Load More</button>
    </>
  );
};

export default FeedRepos;
