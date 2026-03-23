import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStory } from "../services/api";

export default function Story() {
  const { id } = useParams();
  const [scenario, setScenario] = useState(null);
  const [currentStepId, setCurrentStepId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    async function fetchStory() {
      const res = await getStory(id);
      setScenario(res);
      if (res.steps && res.steps.length > 0) {
        setCurrentStepId(res.steps[0].step_id);
      }
    }
    fetchStory();
  }, [id]);

  function handleOption(option) {
    setSelectedOption(option.option_id);
    setTimeout(() => {
      if (option.next_step === "end") {
        setEnded(true);
      } else {
        setCurrentStepId(option.next_step);
      }
      setSelectedOption(null);
    }, 300);
  }

  if (!scenario) return (
    <div className="loading">
      <div className="spinner"></div>
      Carregando história...
    </div>
  );

  const currentStep = scenario.steps?.find((s) => s.step_id === currentStepId);

  if (ended) return (
    <div className="page">
      <Link to="/" className="story-back">← Voltar para histórias</Link>
      <h1 className="story-title">{scenario.title}</h1>
      <div className="story-main-box story-ending">
        <div className="ending-icon">✅</div>
        <p>Você chegou ao fim desta história.</p>
        <p className="ending-theme">Tema: <strong>{scenario.theme}</strong></p>
      </div>
      <Link to="/">
        <button className="btn btn-primary" style={{ marginTop: 24 }}>Ver outras histórias</button>
      </Link>
    </div>
  );

  return (
    <div className="page">
      <Link to="/" className="story-back">← Voltar para histórias</Link>

      <h1 className="story-title">{scenario.title}</h1>

      <div className="story-main-box">
        <p className="narrative-context">{scenario.trigger_event}</p>
        {currentStep && (
          <p className="narrative-text">{currentStep.narrative}</p>
        )}
      </div>

      {currentStep && (
        <div className="story-options-grid">
          {currentStep.options.map((opt, i) => (
            <div
              key={opt.option_id}
              className={`story-option-card${selectedOption === opt.option_id ? " selected" : ""}`}
              onClick={() => handleOption(opt)}
            >
              <span className="option-label">Opção {opt.option_id.toUpperCase()}</span>
              <p>{opt.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
