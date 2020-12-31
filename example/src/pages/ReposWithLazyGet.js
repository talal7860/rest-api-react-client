import React from 'react';
import { useLazyGet } from 'rest-api-react-client';
import { perPage } from '../constants';
import PaginatedRepos from '../components/PaginatedRepos';

const ReposWithLazyGet = () => {
  const [fetchRepos, { fetchMore, loading, data: repos }] = useLazyGet('/user/repos', {
    json: true,
    query: {
      per_page: perPage,
    },
    onError(err) {
      alert(err.data)
      if (err.status === 401) {
        window.sessionStorage.clear();
        window.location.reload();
      }
    }
  });

  return (
    <>
      <button onClick={() => fetchRepos({ query: { page: 1 } })}>Click to lazy load</button>
      <PaginatedRepos loading={loading} repos={repos} fetchMore={fetchMore} />
    </>
  );
};

export default ReposWithLazyGet;
