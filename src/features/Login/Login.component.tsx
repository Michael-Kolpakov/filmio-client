import "./Login.styles.css";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { ERROR_MESSAGES } from "../../app/common/constants/error-messages.constants";
import { REGEX_CONSTANTS } from "../../app/common/constants/regex.constants";

const Login: React.FC = () => {
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
    } catch {
      setWaitingForApiResponse(false);
      message.error(ERROR_MESSAGES.LOGIN.INVALID_LOGIN_ATTEMPT);
    }
  };

  const handleLogin = async (values: { username: string; password: string }) => {};

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
            name="username"
            rules={[
              { required: true, message: ERROR_MESSAGES.LOGIN.USERNAME.REQUIRED },
              { type: "email", message: ERROR_MESSAGES.LOGIN.USERNAME.INVALID_FORMAT },
            ]}
          >
            <Input maxLength={50} placeholder="Username" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: ERROR_MESSAGES.LOGIN.PASSWORD.REQUIRED },
              { pattern: REGEX_CONSTANTS.LOGIN.PASSWORD, message: ERROR_MESSAGES.LOGIN.PASSWORD.INVALID_FORMAT },
            ]}
          >
            <Input.Password maxLength={22} placeholder="Password" onChange={handleInputChange} />
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
      </div>
    </div>
  );
};

export default Login;
