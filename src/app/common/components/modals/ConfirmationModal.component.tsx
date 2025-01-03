import { observer } from "mobx-react-lite";
import { Modal, Button, message } from "antd";
import useMobx from "../../../stores/root-store";
import React from "react";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import { ERROR_MESSAGES } from "../../constants/error-messages.constants";

const ConfirmationModal: React.FC = observer(() => {
  const {
    modalsStore: {
      setConfirmationModal,
      modalsState: { confirmation },
    },
  } = useMobx();

  const handleCancel = () => {
    if (confirmation.confirmationProps?.onCancel) {
      confirmation.confirmationProps?.onCancel();
    }
    setConfirmationModal("confirmation");
  };

  const handleOk = () => {
    try {
      if (confirmation.confirmationProps?.onSubmit) {
        confirmation.confirmationProps.onSubmit();
      }
      message.success(SUCCESS_MESSAGES.CONFIRMATION.OPERATION_COMPLETED);
    } catch {
      message.error(ERROR_MESSAGES.CONFIRMATION.OPERATION_FAILED);
    }
  };

  return (
    <Modal
      title="Confirmation"
      open={confirmation.isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" danger onClick={handleOk}>
          {confirmation.confirmationProps?.operationName || "Ok"}
        </Button>,
      ]}
    >
      {confirmation.confirmationProps?.text ? (
        <p>{confirmation.confirmationProps.text}</p>
      ) : (
        <p>Are you sure you want to change this item?</p>
      )}
    </Modal>
  );
});

export default ConfirmationModal;
