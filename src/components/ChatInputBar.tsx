import {
  createNewChatThreadMessage,
  sendRecordToParticipants,
} from '@/util/chat';
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './ChatInputBar.module.css';
import Send from '@assets/buttons/send.svg';
import { useChatContext } from '@/util/contexts';

export default function ChatInputField({
  parentThreadId,
  contextId,
}: {
  parentThreadId: string;
  contextId: string;
}) {
  const initialState = {
    message: '',
  };
  const [formData, setFormData] = useState(initialState);
  const [chats, setChats] = useChatContext();

  const currentChat = chats[contextId];

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    try {
      if (chats) {
        const { record } = await createNewChatThreadMessage({
          parent: {
            id: parentThreadId,
            contextId,
          },
          message: formData.message,
        });
        if (record && currentChat) {
          const currentRecords = currentChat.records;
          currentRecords?.push(record);
          setChats(prev => {
            return {
              ...prev,
              [contextId]: {
                ...currentChat,
                records: currentRecords,
                latest: formData.message ?? 'Empty message',
              },
            };
          });
          currentTarget.reset();
          setFormData(initialState);
          await sendRecordToParticipants(record, currentChat.participants);
        } else {
          console.error('Something went wrong. please try again');
          alert('Something went wrong. please try again');
        }
      }
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formField}>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <input
          ref={inputRef}
          type="text"
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          autoComplete="off"
          autoFocus
        />
      </div>
      <button className="btn" aria-label="Send">
        <img src={Send} alt="" />
      </button>
    </form>
  );
}
