import { HeaderWithBackButton } from '@/components/HeaderWithBackButton';
import { useProfileContext } from '@/util/contexts';
import { useParams } from 'react-router-dom';
import styles from './ProfileId.module.css';
import { formatDate } from '@/util/helpers';

export default function ProfileId() {
  const [profiles] = useProfileContext();
  const params = useParams();

  const fullUserProfile = params.contextId && profiles[params.contextId];

  return (
    fullUserProfile &&
    fullUserProfile.contextId && (
      <div className="content">
        <HeaderWithBackButton
          title={fullUserProfile.name}
          icon={fullUserProfile.icon}
          iconAlt={fullUserProfile.iconAlt}
          description={fullUserProfile.label}
        />
        <main>
          <div className="scroll-area">
            <div className="scroll-content visually-hide-scrollbar">
              <div className={styles.profileRow}>
                <h2>Profile label</h2>
                <p>{fullUserProfile.label}</p>
              </div>
              <div className={styles.profileRow}>
                <h2>Public display name</h2>
                <p>{fullUserProfile.name}</p>
              </div>
              <div className={styles.profileRow}>
                <h2>DID</h2>
                <p>{fullUserProfile.did}</p>
              </div>
              <div className={styles.profileRow}>
                <h2>Created on</h2>
                <p>{formatDate(fullUserProfile.dateCreated)}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  );
}
