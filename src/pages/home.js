import { Link } from "react-router-dom";

const stories = [
  { id: 1, title: "Assédio moral no trabalho" },
  { id: 2, title: "Pressão abusiva por metas" },
  { id: 3, title: "Ambiente tóxico" }
];

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Histórias</h1>

      <div style={{ display: "flex", gap: 20 }}>
        {stories.map((s) => (
          <Link key={s.id} to={`/story/${s.id}`}>
            <div style={{ border: "1px solid #ccc", padding: 20 }}>
              <h3>{s.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      <br />

      <Link to="/chat">
        <button>Ir para Chat</button>
      </Link>
    </div>
  );
}