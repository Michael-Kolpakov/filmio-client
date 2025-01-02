import "./Login.styles.css";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ERROR_MESSAGES } from "../../app/common/constants/error-messages.constants";
import { REGEX_CONSTANTS } from "../../app/common/constants/regex.constants";
import { FRONTEND_ROUTES } from "../../app/common/constants/frontend-routes.constants";
import useMobx from "../../app/stores/root-store";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { usersStore } = useMobx();
  const [waitingForApiResponse, setWaitingForApiResponse] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [form] = Form.useForm();

  message.config({
    top: 100,
    duration: 2,
    maxCount: 1,
  });

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => setIsFormValid(true),
      () => setIsFormValid(false)
    );
  }, [form]);

  const handleOk = async () => {
    try {
      setWaitingForApiResponse(true);
      await form.validateFields();
      form.submit();
      setIsSaved(true);
      setWaitingForApiResponse(false);
    } catch {
      setWaitingForApiResponse(false);
      message.error(ERROR_MESSAGES.LOGIN.INVALID_LOGIN_ATTEMPT);
    }
  };

  const handleLogin = async (values: { login: string; password: string }) => {
    await usersStore.login(values.login, values.password).then(() => navigate(FRONTEND_ROUTES.BASE));
  };

  const handleInputChange = () => {
    setIsSaved(false);
    form.validateFields({ validateOnly: true }).then(
      () => {
        setIsFormValid(true);
      },
      () => setIsFormValid(false)
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <div className="center">
            <p>Login</p>
          </div>

          <Form.Item
            name="login"
            rules={[
              { required: true, message: ERROR_MESSAGES.LOGIN.EMAIL.REQUIRED },
              { type: "email", message: ERROR_MESSAGES.LOGIN.EMAIL.INVALID_FORMAT },
            ]}
          >
            <Input maxLength={50} showCount placeholder="Login (your email)" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: ERROR_MESSAGES.LOGIN.PASSWORD.REQUIRED },
              { pattern: REGEX_CONSTANTS.COMMON.PASSWORD, message: ERROR_MESSAGES.LOGIN.PASSWORD.INVALID_FORMAT },
            ]}
          >
            <Input.Password maxLength={22} showCount placeholder="Password" onChange={handleInputChange} />
          </Form.Item>
        </Form>
        <div className="center">
          <Button
            type="primary"
            disabled={!isFormValid || isSaved}
            loading={waitingForApiResponse}
            className="login-button"
            onClick={handleOk}
            block
          >
            {waitingForApiResponse ? "Logging in..." : "Login"}
          </Button>
        </div>
        <div className="center">
          <Link to={FRONTEND_ROUTES.MAIN.REGISTRATION} className="registration-link">
            Don't have an account yet?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
