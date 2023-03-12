import React, { FC } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";

interface FrontPageProps {}

const FrontPage: FC<FrontPageProps> = () => (
  <div>
    <NavigationBar />
  </div>
);

export default FrontPage;
