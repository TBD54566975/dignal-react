import { ReactNode } from 'react';
import BackIcon from '@assets/buttons/back-arrow.svg';
import { useNavigate } from 'react-router-dom';
import styles from './HeaderWithBackButton.module.css';

export function HeaderWithBackButton({
  title,
  description,
  icon,
  iconAlt,
  buttons,
}: {
  title: string;
  description?: string;
  icon?: string;
  iconAlt?: string;
  buttons?: ReactNode[];
}) {
  const navigate = useNavigate();
  return (
    <header>
      <button aria-label="Back" onClick={() => navigate(-1)}>
        <img src={BackIcon} alt="" />
      </button>
      <div className={styles.headerDisplay}>
        <div className={styles.heading}>
          {icon && (
            <div className="profile-icon-container">
              <img width={48} src={icon} alt={iconAlt} />
            </div>
          )}
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
        </div>
        <div className={styles.buttons}>
          {buttons &&
            buttons.map((button, index) => <div key={index}>{button}</div>)}
        </div>
      </div>
    </header>
  );
}
