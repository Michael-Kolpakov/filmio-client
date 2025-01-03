import "./Footer.styles.css";

const FooterBlock = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">Filmio ©{new Date().getFullYear()} Trademark</div>
    </footer>
  );
};

export default FooterBlock;
