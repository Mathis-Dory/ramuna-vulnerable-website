import React, { lazy, Suspense } from "react";

const LazyRegisterPage = lazy(() => import("./SignUpPage"));

const RegisterPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyRegisterPage {...props} />
  </Suspense>
);

export default RegisterPage;
