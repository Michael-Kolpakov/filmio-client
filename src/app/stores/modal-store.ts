import { makeAutoObservable } from "mobx";

type ModalState = {
  isOpen: boolean;
  fromCardId?: number;
  confirmationProps?: ConfirmationProps;
};

interface ConfirmationProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  text?: string;
}

const DefaultModalState: ModalState = {
  isOpen: false,
  fromCardId: undefined,
  confirmationProps: undefined,
};

interface ModalList {
  films: ModalState;
  confirmation: ModalState;
}

export default class ModalStore {
  public modalsState: ModalList = {
    films: DefaultModalState,
    confirmation: DefaultModalState,
  };

  public constructor() {
    makeAutoObservable(this);
  }

  public setConfirmationModal = (
    modalName: keyof ModalList,
    onSubmit?: () => void,
    text?: string,
    opened?: boolean,
    onCancel?: () => void
  ) => {
    this.modalsState[modalName] = {
      isOpen: opened ?? !this.modalsState[modalName].isOpen,
      confirmationProps: { onSubmit, text, onCancel },
    };
  };
}
