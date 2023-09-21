import { useNavigate } from 'react-router';
import { RoutePaths } from '@/routes';
import SpeechBubble from '@assets/speech-bubble.png';

function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="layout">
      <div className="row text-center justify-center m-auto row-px">
        <img
          alt="Blank white speech bubble with a light blue outline"
          src={SpeechBubble}
        />
        <div>
          <h1 className="text-decor">Dignal</h1>
          <p className="text-md">
            End-to-end encrypted, decentralized chat{' '}
            <strong>built atop the Web5 chat protocol</strong>
          </p>
        </div>
        <button onClick={() => navigate(RoutePaths.CREATE_PROFILE)}>
          Get started
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
