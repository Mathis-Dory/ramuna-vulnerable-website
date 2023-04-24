import React, { lazy, Suspense } from "react";

const LazyFrontPage = lazy(() => import("./FrontPage"));

const FrontPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyFrontPage {...props} />
  </Suspense>
);

export default FrontPage;
