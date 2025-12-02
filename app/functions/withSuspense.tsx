import React, { Suspense } from 'react';

function withSuspense<P extends object>(
  Component: React.ComponentType<P>,
  Fallback: React.ReactNode,
) {
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    return (
      <Suspense fallback={Fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}

export default withSuspense;
