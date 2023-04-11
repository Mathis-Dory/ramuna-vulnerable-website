import React, { lazy, Suspense } from "react";

const LazySignInPage = lazy(() => import("./SignInPage"));

const SignInPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazySignInPage {...props} />
  </Suspense>
);

export default SignInPage;
