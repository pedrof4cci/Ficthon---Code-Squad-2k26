import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStory } from "../services/Api";

export default function Story() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchStory() {
      const res = await getStory(id);
      setData(res);
    }

    fetchStory();
  }, [id]);

  if (!data) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}