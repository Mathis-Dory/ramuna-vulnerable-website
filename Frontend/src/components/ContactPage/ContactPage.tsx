import React, { FC } from "react";
import NavigationBar from "../NavigationBar/NavigationBar.lazy";
import Footer from "../Footer/Footer.lazy";
interface ContactPageProps {}

const ContactPage: FC<ContactPageProps> = () => (
  <div>
    <NavigationBar />
    <Footer />
  </div>
);

export default ContactPage;
