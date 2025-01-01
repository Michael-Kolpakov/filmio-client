import "./FilmModal.styles.css";
import CloseButton from "../../../assets/images/utils/close-button.svg";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Film, { FilmCreateUpdate } from "../../../models/films/films.model";
import { Button, DatePicker, Form, Input, message, Modal } from "antd";
import useMobx from "../../../app/stores/root-store";
import dayjs from "dayjs";

const FilmModal: React.FC<{
  filmItem?: Film;
  open: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = observer(({ filmItem, open, setIsModalOpen }) => {
  const genre_regex_validation_pattern = new RegExp("^[a-zA-Z| ]*$");
  const director_regex_validation_pattern = new RegExp("^[a-zA-Z' ]*$");
  const rating_regex_validation_pattern = new RegExp("^[1-5]$");
  const { filmsStore } = useMobx();
  const [form] = Form.useForm();
  const [actionSuccess, setActionSuccess] = useState<boolean>(false);
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
    setWaitingForApiResponse(false);
    if (actionSuccess) {
      message.success("Film added/saved successfully!");
      setActionSuccess(false);
    }
  }, [actionSuccess]);

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
      message.success("Film added successfully!");
      setIsSaved(true);
    } catch {
      setWaitingForApiResponse(false);
      message.error("Please fill in all the required fields and check validaion correctness!");
    }
  };

  const closeModal = () => {
    if (!waitingForApiResponse) {
      form.resetFields();
      setIsModalOpen(false);
      setIsSaved(true);
    }
  };

  const onSuccessfulSubmit = async (formValues: any) => {
    message.loading("Saving...");

    const film: FilmCreateUpdate = {
      id: 0,
      title: formValues.title,
      genre: formValues.genre,
      director: formValues.director,
      releaseDate: formValues.releaseDate.format(),
      rating: formValues.rating,
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

      setActionSuccess(true);
    } catch {
      message.error("An error occurred during adding/saving the film! Please try again later.");
      setWaitingForApiResponse(false);
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

          <Form.Item name="title" label="Title:" rules={[{ required: true, message: "Please enter a title" }]}>
            <Input maxLength={50} showCount onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="genre"
            label="Genre (use '|' character as a separator):"
            rules={[
              { required: true, message: "Please enter a genre" },
              {
                pattern: genre_regex_validation_pattern,
                message: "Can only contain latin letters, spaces and the '|' character",
              },
            ]}
          >
            <Input maxLength={60} showCount onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="director"
            label="Director:"
            rules={[
              { required: true, message: "Please enter a director" },
              {
                pattern: director_regex_validation_pattern,
                message: "Can only contain latin letters and apostrophes",
              },
            ]}
          >
            <Input maxLength={25} showCount onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="releaseDate"
            label="Release date:"
            rules={[
              { required: true, message: "Please enter a release date" },
              {
                validator: (_, value) =>
                  value && value.isAfter(dayjs())
                    ? Promise.reject(new Error("Release date cannot be in the future"))
                    : Promise.resolve(),
              },
            ]}
          >
            <DatePicker onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Rating:"
            rules={[
              {
                pattern: rating_regex_validation_pattern,
                message: "Rating must be an integer between 1 and 5",
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
          className="add-film-button"
          onClick={handleOk}
        >
          {filmItem ? "Update film" : "Add film"}
        </Button>
      </div>
    </Modal>
  );
});

export default FilmModal;
