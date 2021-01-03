import React from 'react';
import PaginatedRepos from '../components/PaginatedRepos';
import useReposWithCache from '../hooks/useReposWithCache';

const ReposWithNetworkPolicy = () => {
  const { loading, data: repos, fetchMore } = useReposWithCache();

  return (
    <PaginatedRepos loading={loading} repos={repos} fetchMore={fetchMore} />
  );
};

export default ReposWithNetworkPolicy;
