import { useState } from 'react';
import { isEmpty } from 'lodash/fp';

const PaginatedRepos = ({ loading, repos, fetchMore }) => {
  const [page, setPage] = useState(1);
  const onPageChange = (page) => {
    fetchMore({
      query: { page },
      updateQuery(prev, { fetchMoreResult, error }) {
        if (!error) {
          setPage(page);
          return fetchMoreResult;
        }
      },
    });
  };
  const onNext = () => onPageChange(page + 1);
  const onPrevious = () => onPageChange(page - 1);

  return (
    <>
      {loading ? 'Loading...' : null}
      <div>
        {(repos || []).map((repo) => (<div key={repo.id}>Repo Name: {repo.name}</div>))}
      </div>
      <button disabled={loading || page === 1} onClick={onPrevious}>Previous</button>
      Page: {page}
      <button disabled={isEmpty(repos) || loading} onClick={onNext}>Next</button>
    </>
  );
};

export default PaginatedRepos;
