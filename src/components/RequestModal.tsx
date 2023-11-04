// import { matchUserDidToTargetDid } from '@/util/chat';
import { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function RequestModal({
  requestParams,
}: {
  isLoading: boolean;
  requestParams: { recordId: string; did: string };
}) {
  const requestModalRef = useRef<HTMLDialogElement>(null);
  const { recordId: inviteRecordId, did: didToRequestFrom } = requestParams;

  useEffect(() => {
    if (inviteRecordId && didToRequestFrom) {
      requestModalRef.current?.showModal();
    }
  }, [inviteRecordId, didToRequestFrom]);

  const setSearch = useSearchParams()[1];

  return (
    <dialog
      ref={requestModalRef}
      onClick={e => {
        if (e.target === requestModalRef.current) {
          requestModalRef.current.close();
          setSearch('', { replace: true });
        }
      }}
    >
      <h2>Request access to a chat</h2>
      <button className="btn" onClick={() => {}}>
        Request access
      </button>
      <button
        className="btn secondary expanded"
        onClick={() => {
          requestModalRef.current?.close();
          setSearch('', { replace: true });
        }}
      >
        Cancel
      </button>
    </dialog>
  );
}
