import React from 'react';

export default function CustomError({ statusCode }) {
  return (
    <div>
      {statusCode === 404 ? (
        <h1>Page Not Found</h1>
      ) : (
        <h1>Server Error</h1>
      )}
    </div>
  );
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};