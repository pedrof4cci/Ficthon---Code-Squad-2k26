import { Link } from "react-router-dom";

const stories = [
  { id: 1, title: "Assédio moral no trabalho", icon: "😤" },
  { id: 2, title: "Pressão abusiva por metas", icon: "📊" },
  { id: 3, title: "Ambiente tóxico", icon: "☠️" }
];

export default function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="badge">Ficthon · Code Squad</span>
        <h1>Histórias do<br />mundo do trabalho</h1>
        <p>Relatos reais sobre situações difíceis no ambiente profissional.</p>
      </div>

      <div className="cards-grid">
        {stories.map((s) => (
          <Link key={s.id} to={`/story/${s.id}`}>
            <div className="story-card">
              <div className="card-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <div className="card-arrow">Ler história →</div>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/chat">
        <button className="btn btn-primary">💬 Ir para o Chat</button>
      </Link>
    </div>
  );
}
