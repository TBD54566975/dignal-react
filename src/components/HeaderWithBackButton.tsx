import { ReactNode } from 'react';
import BackIcon from '@assets/buttons/back-arrow.svg';
import { useNavigate } from 'react-router-dom';
import styles from './HeaderWithBackButton.module.css';

export function HeaderWithBackButton({
  title,
  icon,
  icon_alt,
  buttons,
}: {
  title: string;
  icon?: string;
  icon_alt?: string;
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
          {icon && <img src={icon} alt={icon_alt} />}
          <h1>{title}</h1>
        </div>
        <div className={styles.buttons}>
          {buttons &&
            buttons.map((button, index) => <div key={index}>{button}</div>)}
        </div>
      </div>
    </header>
  );
}
