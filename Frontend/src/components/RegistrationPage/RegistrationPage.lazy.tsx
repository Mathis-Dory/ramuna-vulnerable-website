import React, { lazy, Suspense } from "react";

const LazyRegistrationPage = lazy(() => import("./RegistrationPage"));

const RegistrationPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyRegistrationPage {...props} />
  </Suspense>
);

export default RegistrationPage;
