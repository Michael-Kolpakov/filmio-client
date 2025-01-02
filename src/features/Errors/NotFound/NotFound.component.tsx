import "./NotFound.styles.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../../app/common/constants/frontend-routes.constants";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(FRONTEND_ROUTES.BASE);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-title">404</div>
      <div className="not-found-message">Page Not Found</div>
      <Button type="primary" onClick={handleGoBack} className="not-found-button">
        Go Back to Home
      </Button>
    </div>
  );
}
