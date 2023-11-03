import { ReactNode, RefObject } from 'react';
import './modal.css';

export default function Modal({
  title,
  dismissLabel,
  listItems,
  objectRef,
}: {
  title: string;
  dismissLabel?: string;
  listItems: ReactNode[];
  objectRef: RefObject<HTMLDialogElement>;
}) {
  return (
    <dialog
      ref={objectRef}
      onClick={e => {
        if (e.target === objectRef.current) {
          objectRef.current.close();
        }
      }}
    >
      <h2>{title}</h2>
      <ul>
        {listItems.map((listItem, index) => (
          <li key={'key-' + index}>{listItem}</li>
        ))}
      </ul>
      {dismissLabel && (
        <button
          className="btn secondary expanded"
          onClick={() => objectRef.current?.close()}
        >
          {dismissLabel}
        </button>
      )}
    </dialog>
  );
}
