import { ReactNode, RefObject } from 'react';

export default function ListModal({
  title,
  dismissLabel,
  listItems,
  listModalRef,
}: {
  title: string;
  dismissLabel?: string;
  listItems: ReactNode[];
  listModalRef: RefObject<HTMLDialogElement>;
}) {
  return (
    <dialog
      ref={listModalRef}
      onClick={e => {
        if (e.target === listModalRef.current) {
          listModalRef.current.close();
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
          onClick={() => listModalRef.current?.close()}
        >
          {dismissLabel}
        </button>
      )}
    </dialog>
  );
}
