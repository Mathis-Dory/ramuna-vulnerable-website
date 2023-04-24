import React, { lazy, Suspense } from "react";

const LazyNewsPage = lazy(() => import("./NewsPage"));

const NewsPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyNewsPage {...props} />
  </Suspense>
);

export default NewsPage;
