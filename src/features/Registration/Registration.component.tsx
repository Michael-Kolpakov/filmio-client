import "./Registration.styles.css";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ERROR_MESSAGES } from "../../app/common/constants/error-messages.constants";
import { REGEX_CONSTANTS } from "../../app/common/constants/regex.constants";
import { FRONTEND_ROUTES } from "../../app/common/constants/frontend-routes.constants";
import useMobx from "../../app/stores/root-store";

const Registration: React.FC = () => {
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
      message.error(ERROR_MESSAGES.REGISTRATION.INVALID_REGISTRATION_ATTEMPT);
    }
  };

  const handleRegistration = async (values: { fullName: string; email: string; password: string }) => {
    await usersStore
      .registration(values.fullName, values.email, values.password)
      .then(() => navigate(FRONTEND_ROUTES.BASE));
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

  const validateConfirmPassword = (_: any, value: string) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject(new Error(ERROR_MESSAGES.REGISTRATION.CONFIRM_PASSWORD.MISMATCH));
    }
    return Promise.resolve();
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <Form form={form} layout="vertical" onFinish={handleRegistration}>
          <div className="center">
            <p>Registration</p>
          </div>

          <Form.Item
            name="fullName"
            rules={[
              { required: true, message: ERROR_MESSAGES.REGISTRATION.FULL_NAME.REQUIRED },
              {
                pattern: REGEX_CONSTANTS.REGISTRATION.FULL_NAME,
                message: ERROR_MESSAGES.REGISTRATION.FULL_NAME.INVALID_FORMAT,
              },
            ]}
          >
            <Input maxLength={30} showCount placeholder="First and second name" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: ERROR_MESSAGES.REGISTRATION.EMAIL.REQUIRED },
              { type: "email", message: ERROR_MESSAGES.REGISTRATION.EMAIL.INVALID_FORMAT },
            ]}
          >
            <Input maxLength={50} showCount placeholder="Email" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: ERROR_MESSAGES.REGISTRATION.PASSWORD.REQUIRED },
              {
                pattern: REGEX_CONSTANTS.COMMON.PASSWORD,
                message: ERROR_MESSAGES.REGISTRATION.PASSWORD.INVALID_FORMAT,
              },
            ]}
          >
            <Input.Password maxLength={22} showCount placeholder="Password" onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: ERROR_MESSAGES.REGISTRATION.CONFIRM_PASSWORD.REQUIRED },
              {
                pattern: REGEX_CONSTANTS.COMMON.PASSWORD,
                message: ERROR_MESSAGES.REGISTRATION.CONFIRM_PASSWORD.INVALID_FORMAT,
              },
              { validator: validateConfirmPassword },
            ]}
          >
            <Input.Password maxLength={22} showCount placeholder="Confirm password" onChange={handleInputChange} />
          </Form.Item>
        </Form>
        <div className="center">
          <Button
            type="primary"
            disabled={!isFormValid || isSaved}
            loading={waitingForApiResponse}
            className="registration-button"
            onClick={handleOk}
            block
          >
            {waitingForApiResponse ? "Signing up..." : "Sign up"}
          </Button>
        </div>
        <div className="center">
          <Link to={FRONTEND_ROUTES.MAIN.LOGIN} className="login-link">
            Do you already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
