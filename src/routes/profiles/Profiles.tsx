import { Header } from '@/components/Header';
import ImportModal from '@/components/ImportModal';
import { useProfileContext } from '@/util/contexts';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Profiles() {
  const [profiles] = useProfileContext();
  const importModalRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="content header-treatment">
      <Header title={'Profiles'} />
      <main>
        <div className="scroll-area">
          <ul className="scroll-content visually-hide-scrollbar">
            {Object.values(profiles).map(profile => {
              return (
                profile && (
                  <li key={profile.contextId}>
                    <Link to={profile.contextId} className="display-link">
                      <span className="display-link-detail">
                        <div className="profile-icon-container">
                          <img
                            width={48}
                            src={profile.icon}
                            alt={profile.iconAlt}
                          />
                        </div>
                        <span>
                          <h2>{profile.name}</h2>
                          <p>{profile.label}</p>
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              );
            })}
          </ul>
        </div>
        <button
          className="btn expanded secondary"
          onClick={() => {
            importModalRef.current?.showModal();
          }}
        >
          Import profile
        </button>
        <ImportModal importModalRef={importModalRef} />
      </main>
    </div>
  );
}
