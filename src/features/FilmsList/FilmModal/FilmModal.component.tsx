import "./FilmModal.styles.css";
import CloseButton from "../../../assets/images/utils/close-button.svg";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Film, { FilmCreateUpdate } from "../../../models/films/films.model";
import { Button, DatePicker, Form, Input, message, Modal } from "antd";
import useMobx from "../../../app/stores/root-store";
import dayjs from "dayjs";
import { ERROR_MESSAGES } from "../../../app/common/constants/error-messages.constants";
import { SUCCESS_MESSAGES } from "../../../app/common/constants/success-messages.constants";
import { REGEX_CONSTANTS } from "../../../app/common/constants/regex.constants";

const FilmModal: React.FC<{
  filmItem?: Film;
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = observer(({ filmItem, open, setIsModalOpen }) => {
  const { filmsStore } = useMobx();
  const [form] = Form.useForm();
  const [waitingForApiResponse, setWaitingForApiResponse] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<any>({});

  message.config({
    top: 100,
    duration: 2,
    maxCount: 1,
  });

  useEffect(() => {
    if (filmItem && open) {
      const initialFormValues = {
        title: filmItem.title,
        genre: filmItem.genre,
        director: filmItem.director,
        releaseDate: dayjs(filmItem.releaseDate),
        rating: filmItem.rating,
        description: filmItem.description,
      };
      form.setFieldsValue(initialFormValues);
      setInitialValues(initialFormValues);
    } else {
      form.resetFields();
    }
  }, [filmItem, open, form]);

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
      message.error(ERROR_MESSAGES.FILM.WRONG_FORM_VALIDATION);
    }
  };

  const onSuccessfulSubmit = async (formValues: {
    title: string;
    genre: string;
    director: string;
    releaseDate: dayjs.Dayjs;
    rating: string;
    description?: string;
  }) => {
    message.loading("Saving...");

    const film: FilmCreateUpdate = {
      id: 0,
      title: formValues.title.trim(),
      genre: formValues.genre.trim(),
      director: formValues.director.trim(),
      releaseDate: formValues.releaseDate.format(),
      rating: formValues.rating ? Number(formValues.rating) : null,
      description: formValues.description?.trim() || null,
    };

    filmsStore.getFilmsArray
      .map((t) => t)
      .forEach((t) => {
        if (formValues.title === t.title) {
          filmItem = t;
        }
      });

    try {
      if (filmItem) {
        film.id = filmItem.id;
        await filmsStore.updateFilm(film);
      } else {
        film.id = (await filmsStore.createFilm(film)).id;
      }
      message.success(SUCCESS_MESSAGES.FILM.ADDING_EDITING);
    } catch {
      setWaitingForApiResponse(false);
      message.error(ERROR_MESSAGES.FILM.SAVING_ERROR);
    }
  };

  const handleInputChange = () => {
    setIsSaved(false);
    form.validateFields({ validateOnly: true }).then(
      () => {
        const currentValues = form.getFieldsValue();
        const hasChanges = Object.keys(currentValues).some(
          (key) => currentValues[key]?.toString() !== initialValues[key]?.toString()
        );
        setIsFormValid(hasChanges);
      },
      () => setIsFormValid(false)
    );
  };

  const closeModal = () => {
    if (!waitingForApiResponse) {
      form.resetFields();
      setIsModalOpen(false);
      setIsSaved(true);
    }
  };

  const validateReleaseDate = (_: any, value: dayjs.Dayjs) => {
    if (value && value.isAfter(dayjs())) {
      return Promise.reject(new Error(ERROR_MESSAGES.FILM.RELEASE_DATE.INVALID_FORMAT));
    }

    return Promise.resolve();
  };

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      className="modal-container"
      footer={null}
      closeIcon={<img src={CloseButton} alt="close" className="custom-close-button" />}
    >
      <div>
        <Form form={form} layout="vertical" onFinish={onSuccessfulSubmit}>
          <div className="center">
            <p>{filmItem ? "Edit Film" : "Add Film"}</p>
          </div>

          <Form.Item
            name="title"
            label="Title:"
            rules={[{ required: true, message: ERROR_MESSAGES.FILM.TITLE.REQUIRED }]}
          >
            <Input maxLength={50} showCount onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="genre"
            label="Genre (use '|' character as a separator):"
            rules={[
              { required: true, message: ERROR_MESSAGES.FILM.GENRE.REQUIRED },
              {
                pattern: REGEX_CONSTANTS.FILM.GENRE,
                message: ERROR_MESSAGES.FILM.GENRE.INVALID_FORMAT,
              },
            ]}
          >
            <Input maxLength={60} showCount onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="director"
            label="Director:"
            rules={[
              { required: true, message: ERROR_MESSAGES.FILM.DIRECTOR.REQUIRED },
              {
                pattern: REGEX_CONSTANTS.FILM.DIRECTOR,
                message: ERROR_MESSAGES.FILM.DIRECTOR.INVALID_FORMAT,
              },
            ]}
          >
            <Input maxLength={25} showCount onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="releaseDate"
            label="Release date:"
            rules={[
              { required: true, message: ERROR_MESSAGES.FILM.RELEASE_DATE.REQUIRED },
              { validator: validateReleaseDate },
            ]}
          >
            <DatePicker onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Rating:"
            rules={[
              {
                pattern: REGEX_CONSTANTS.FILM.RATING,
                message: ERROR_MESSAGES.FILM.RATING.INVALID_FORMAT,
              },
            ]}
          >
            <Input maxLength={1} showCount onChange={handleInputChange} />
          </Form.Item>

          <Form.Item name="description" label="Description:">
            <Input.TextArea rows={5} maxLength={500} showCount onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </div>
      <div className="center">
        <Button
          disabled={!isFormValid || isSaved}
          type="primary"
          size="large"
          className="add-edit-film-button"
          onClick={handleOk}
        >
          {filmItem ? "Update film" : "Add film"}
        </Button>
      </div>
    </Modal>
  );
});

export default FilmModal;
