import { createNewChatThreadMessage, useChatContext } from '@/util/chat';
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './ChatInputBar.module.css';
import Send from '@assets/buttons/send.svg';

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    try {
      console.time('write thread');
      const { record } = await createNewChatThreadMessage({
        parent: {
          id: parentThreadId,
          contextId,
        },
        message: formData.message,
      });
      console.timeEnd('write thread');
      if (record && chats) {
        console.time('write to react context');
        const currentRecords = chats[contextId].records;
        currentRecords?.push(record);
        setChats(prev => {
          return {
            ...prev,
            [contextId]: {
              ...(chats && chats[contextId]),
              records: currentRecords,
            },
          };
        });
        console.timeEnd('write to react context');
        console.time('send to participants');
        for (const participant of chats[contextId].participants) {
          await record.send(participant);
        }
        console.timeEnd('write to react context');
      }
    } catch (e) {
      console.error(e);
      alert(e);
    }

    currentTarget.reset();
    setFormData(initialState);
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
