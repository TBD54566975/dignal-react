import {
  approveRequestToEnterChat,
  declineRequestToEnterChat,
  updateChatParentContextAfterHandlingRequest,
  useChatContext,
} from '@/util/chat';
import styles from './ChatRequestBanner.module.css';
import RightChevron from '@assets/buttons/right-chevron.svg';

export default function ChatRequestBanner({
  contextId,
}: {
  contextId: string;
}) {
  const [chats, setChats] = useChatContext();
  const chatParentContext = chats && chats[contextId];
  return (
    <details className={styles.requestArea}>
      <summary>
        Requests to enter the chat
        <img src={RightChevron} alt="" />
      </summary>
      <ul>
        {chatParentContext &&
          chatParentContext.requestList?.map(requestingParticipant => (
            <li key={requestingParticipant.request.id}>
              <div className={styles.requestItem}>
                {requestingParticipant.name} would like to join this chat.
                <div className={styles.requestButtons}>
                  <button
                    className="btn primary"
                    onClick={async () => {
                      const result = await approveRequestToEnterChat({
                        request: requestingParticipant.request,
                        inviteId: chatParentContext.inviteRecordId,
                      });
                      if (result.status.code === 202 && contextId) {
                        const updatedChatParentContext =
                          updateChatParentContextAfterHandlingRequest(
                            chatParentContext,
                            requestingParticipant,
                          );
                        setChats(prev => {
                          return {
                            ...prev,
                            [contextId]: {
                              ...updatedChatParentContext,
                            },
                          };
                        });
                      } else {
                        alert('could not complete, try again');
                      }
                    }}
                  >
                    Allow
                  </button>
                  <button
                    className="btn secondary"
                    onClick={async () => {
                      const result = await declineRequestToEnterChat(
                        requestingParticipant.request,
                      );
                      if (result.status.code === 202 && contextId) {
                        const updatedChatParentContext =
                          updateChatParentContextAfterHandlingRequest(
                            chatParentContext,
                            requestingParticipant,
                          );
                        setChats(prev => {
                          return {
                            ...prev,
                            [contextId]: {
                              ...updatedChatParentContext,
                            },
                          };
                        });
                      } else {
                        alert('could not complete, try again');
                      }
                    }}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </details>
  );
}
