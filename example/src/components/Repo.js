import React from 'react';
const styles = {
  root: {
    border: '1px dotted #999',
    width: 320,
    height: 30,
    padding: 20,
  }
};

const Repo = ({ repo }) => (
  <div style={styles.root}>
    <div>Repo ID: {repo.id}</div>
    <div>Repo Name: {repo.name}</div>
  </div>
);

export default Repo;
