import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
const Layout = ({ children, description, keyword, author, title }) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Header />
      <main>
        <Toaster />
        {children}
      </main>
      <Footer />
    </>
  );
};

Layout.defaultProps = {
  title: "SIH - 2k23",
  description: "SIH problem Solution",
  keyword: "SIH, sit",
  author: "Team Name",
};

export default Layout;
