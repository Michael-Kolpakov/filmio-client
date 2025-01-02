import "./FilmsList.styles.css";
import React, { useEffect, useState } from "react";
import { Table, Button, Empty } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useMobx from "../../app/stores/root-store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import Film from "../../models/films/films.model";
import FilmModal from "./FilmModal/FilmModal.component";
import { format } from "date-fns";
import { FRONTEND_ROUTES } from "../../app/common/constants/frontend-routes.constants";

const FilmsList: React.FC = observer(() => {
  const defaultFilmsPerPage = 15;
  const navigate = useNavigate();
  const { filmsStore, modalsStore } = useMobx();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);
  const [modalEditOpened, setModalEditOpened] = useState<boolean>(false);
  const [filmToEdit, setFilmToedit] = useState<Film>();

  useEffect(() => {
    setIsLoading(true);
    filmsStore.getAllFilms(defaultFilmsPerPage);
    filmsStore.setInternalMap(filmsStore.getFilmsArray);
    setIsLoading(false);
  }, [filmsStore, modalAddOpened, modalEditOpened]);

  const handleDelete = (record: Film) => {
    modalsStore.setConfirmationModal(
      "confirmation",
      async () => {
        await filmsStore.deleteFilm(record.id);
        await filmsStore.getAllFilms(defaultFilmsPerPage);
        modalsStore.setConfirmationModal("confirmation");
      },
      `Are you sure you want to delete '${record.title}'?`,
      "Delete"
    );
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      align: "center" as const,
      width: "5%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
      width: "20%",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      width: "15%",
      render: (value: string) => format(new Date(value), "dd/MM/yyyy"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_: any, record: Film) => (
        <div className="film-page-actions" onClick={(e) => e.stopPropagation()}>
          <Button
            icon={<EditOutlined />}
            className="action-film-button edit-film-button button-margin-right"
            size="large"
            onClick={() => {
              setFilmToedit(record);
              setModalEditOpened(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            className="action-film-button delete-film-button"
            size="large"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="films-page">
      <h1>Films List</h1>
      <div className="films-page-container">
        <div className="container-justify-end">
          <Button
            type="primary"
            size="large"
            className="add-film-button"
            icon={<PlusOutlined />}
            iconPosition="end"
            onClick={() => setModalAddOpened(true)}
          >
            Create film
          </Button>
        </div>
        <Table
          columns={columns}
          className="films-table"
          dataSource={isLoading ? [] : filmsStore.getFilmsArray}
          pagination={{
            current: filmsStore.PaginationInfo.CurrentPage,
            pageSize: filmsStore.PaginationInfo.PageSize,
            total: filmsStore.PaginationInfo.TotalItems,
            showSizeChanger: false,
            defaultCurrent: 1,
            onChange: (value: number) => {
              filmsStore.setCurrentPage(value);
            },
          }}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => navigate(`${FRONTEND_ROUTES.MAIN.VIEW_FILM}/${record.id}`),
          })}
          locale={{
            emptyText: isLoading ? (
              <div className="loadingWrapper">
                <p className="loading-text">Loading...</p>
              </div>
            ) : (
              <Empty description="No data" />
            ),
          }}
        />
        <FilmModal open={modalAddOpened} setIsModalOpen={setModalAddOpened} />
        <FilmModal open={modalEditOpened} setIsModalOpen={setModalEditOpened} filmItem={filmToEdit} />
      </div>
    </div>
  );
});

export default FilmsList;
