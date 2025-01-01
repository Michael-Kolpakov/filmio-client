import { observer } from "mobx-react-lite";
import { Modal, Button } from "antd";
import { useModalContext } from "../../../stores/root-store";
import React from "react";

const ConfirmationModal: React.FC = observer(() => {
  const {
    modalStore: {
      setConfirmationModal,
      modalsState: { confirmation },
    },
  } = useModalContext();

  return (
    <Modal
      title="Confirmation"
      open={confirmation.isOpen}
      onCancel={() => {
        if (confirmation.confirmationProps?.onCancel) {
          confirmation.confirmationProps?.onCancel();
        }
        setConfirmationModal("confirmation");
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            if (confirmation.confirmationProps?.onCancel) {
              confirmation.confirmationProps?.onCancel();
            }
            setConfirmationModal("confirmation");
          }}
        >
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={() => {
            if (confirmation.confirmationProps?.onSubmit) {
              confirmation.confirmationProps.onSubmit();
            }
          }}
        >
          Delete
        </Button>,
      ]}
    >
      {confirmation.confirmationProps?.text ? (
        <p>{confirmation.confirmationProps.text}</p>
      ) : (
        <p>Are you sure you want to delete this item?</p>
      )}
    </Modal>
  );
});

export default ConfirmationModal;
