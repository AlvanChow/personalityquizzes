import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VectorQuizExperience from '../components/VectorQuizExperience';
import { VECTOR_QUIZ_LOADERS } from '../data/vectorQuizzes/registry';

// Loads a vector quiz's definition module and mounts the shared experience.
export default function VectorQuizPage() {
  const { quizKey } = useParams();
  const navigate = useNavigate();
  const [def, setDef] = useState(null);

  useEffect(() => {
    const loader = VECTOR_QUIZ_LOADERS[quizKey];
    if (!loader) {
      navigate('/404', { replace: true });
      return;
    }
    let cancelled = false;
    loader().then((mod) => {
      if (!cancelled) setDef(mod.default);
    });
    return () => { cancelled = true; };
  }, [quizKey, navigate]);

  if (!def) {
    return (
      <div className="min-h-screen bg-[#131019] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white/50 rounded-full animate-spin" />
      </div>
    );
  }
  return <VectorQuizExperience def={def} key={def.key} />;
}
