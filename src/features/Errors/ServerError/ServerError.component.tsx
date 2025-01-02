import "./ServerError.styles.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FRONTEND_ROUTES } from "../../../app/common/constants/frontend-routes.constants";
import { observer } from "mobx-react-lite";
import useMobx from "../../../app/stores/root-store";

const ServerError = observer(() => {
  const navigate = useNavigate();
  const { commonStore } = useMobx();
  const error = commonStore.getServerError();

  const handleGoBack = () => {
    navigate(FRONTEND_ROUTES.BASE);
  };

  return (
    <div className="server-error-container">
      <div className="server-error-title">{error?.statusCode || 500}</div>
      <div className="server-error-message">{error?.message || "Internal Server Error"}</div>
      {error?.details && (
        <div className="server-error-details-container">
          <div className="server-error-details-label">Stack Trace:</div>
          <code className="server-error-details">{error.details}</code>
        </div>
      )}
      <Button type="primary" onClick={handleGoBack} className="server-error-button">
        Go Back to Home
      </Button>
    </div>
  );
});

export default ServerError;
