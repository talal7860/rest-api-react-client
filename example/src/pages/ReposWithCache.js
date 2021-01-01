import React from 'react';
import { useGet } from 'rest-api-react-client';
import { perPage } from '../constants';
import PaginatedRepos from '../components/PaginatedRepos';

const ReposWithNetworkPolicy = () => {
  const { loading, data: repos, fetchMore } = useGet('/user/repos', {
    json: true,
    'network-policy': 'cache',
    query: {
      per_page: perPage,
    },
  });

  return (
    <PaginatedRepos loading={loading} repos={repos} fetchMore={fetchMore} />
  );
};

export default ReposWithNetworkPolicy;
