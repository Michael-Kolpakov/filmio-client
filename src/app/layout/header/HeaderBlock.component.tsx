import "./HeaderBlock.styles.css";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../common/constants/frontend-routes.constants";

const HeaderBlock = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(FRONTEND_ROUTES.BASE);
  };

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick}>
        Filmio
      </div>
    </header>
  );
};

export default HeaderBlock;
