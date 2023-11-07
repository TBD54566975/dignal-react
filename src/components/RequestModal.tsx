import {
  createNewRequestToEnterChat,
  getNewRequestToEnterChatError,
} from '@/util/chat';
import { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function RequestModal({
  requestParams,
}: {
  isLoading: boolean;
  requestParams: { inviteId: string; did: string };
}) {
  const requestModalRef = useRef<HTMLDialogElement>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);

  useEffect(() => {
    if (requestParams.inviteId && requestParams.did) {
      requestModalRef.current?.showModal();
    }
  }, [requestParams.inviteId, requestParams.did]);

  const setSearch = useSearchParams()[1];

  function closeModal() {
    requestModalRef.current?.close();
    setSearch('', { replace: true });
  }

  return (
    <dialog
      ref={requestModalRef}
      onClick={e => {
        if (e.target === requestModalRef.current) {
          closeModal();
        }
      }}
    >
      {!isRequestSent ? (
        <>
          <h2>Request access to a chat</h2>
          <button
            disabled={isRequestPending}
            className="btn"
            onClick={async () => {
              setIsRequestPending(true);
              const requestContextRecord = await requestAccess({
                ...requestParams,
              });
              if (requestContextRecord) {
                setIsRequestSent(true);
              }
              setIsRequestPending(false);
            }}
          >
            {isRequestPending ? 'Sending' : 'Request access'}
          </button>
          <button className="btn secondary expanded" onClick={closeModal}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2>Your request was sent.</h2>
          <p>You'll see the chat once the chat owner has granted you access.</p>
          <button className="btn secondary expanded" onClick={closeModal}>
            Done
          </button>
        </>
      )}
    </dialog>
  );
}

async function requestAccess({
  inviteId,
  did,
}: {
  inviteId: string;
  did: string;
}) {
  const error = await getNewRequestToEnterChatError({
    inviteId,
    from: did,
  });
  if (error) {
    console.error(error.message);
    return alert(error.message);
  }
  const { record, status } = await createNewRequestToEnterChat(inviteId);
  if (record) {
    await record.send(did);
  }
  return { record, status };
}
