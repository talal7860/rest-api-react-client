import React from 'react';
import { useGet } from 'rest-api-react-client';
import { perPage } from '../constants';
import FeedRepos from '../components/FeedRepos';

const ReposWithWallFeed = () => {
  const { loading, data: repos, fetchMore } = useGet('/user/repos', {
    json: true,
    'network-policy': 'cache',
    query: {
      feed: 1,
      per_page: perPage,
    },
  });

  return (
    <FeedRepos loading={loading} repos={repos} fetchMore={fetchMore} />
  );
};

export default ReposWithWallFeed;
