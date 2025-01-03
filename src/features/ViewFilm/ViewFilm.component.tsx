import "./ViewFilm.styles.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMobx from "../../app/stores/root-store";
import Film from "../../models/films/films.model";
import { observer } from "mobx-react-lite";
import { Avatar, Button, Divider, Typography, Rate, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Title, Text, Paragraph } = Typography;
import { format } from "date-fns";

const ViewFilm: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { filmsStore } = useMobx();
  const [film, setFilm] = useState<Film | null>(null);

  const getRandomColor = () => {
    const colors = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchFilm = async () => {
      const filmData = await filmsStore.getFilmById(Number(id));
      setFilm(filmData);
    };
    void fetchFilm();
  }, [id, filmsStore]);

  const goToPreviousPage = () => {
    navigate(-1);
  };

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-film-page">
      <div className="container-justify-start">
        <Button
          type="primary"
          size="large"
          className="go-back-button"
          icon={<ArrowLeftOutlined />}
          onClick={goToPreviousPage}
        >
          Go back
        </Button>
      </div>

      <Divider className="divider" />

      <div className="content-columns">
        <div className="left-column">
          <Title level={3}>{film.title}</Title>

          <div className="director-section">
            <Text type="secondary">Director: </Text>
            {film.director}
          </div>

          <div className="genres-section">
            <Text strong>Genres: </Text>
            {film.genre.split("|").map((genre) => (
              <Tag color={getRandomColor()} key={genre}>
                {genre}
              </Tag>
            ))}
          </div>

          <div className="release-date-section">
            <Text strong>Release date: </Text>
            {format(new Date(film.releaseDate), "d MMMM yyyy")}
          </div>

          <div className="description-section">
            <Text strong>Description:</Text>
            <Paragraph>{film.description ? film.description : "N/A"}</Paragraph>
          </div>
        </div>

        <div className="right-column">
          <Avatar shape="square" size={180} src="https://placehold.co/200?text=Film's\ncover&font=roboto" />

          <div className="rating-section">
            {film.rating ? <Rate disabled defaultValue={film.rating} /> : <Text strong>Rating is not specified</Text>}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ViewFilm;
