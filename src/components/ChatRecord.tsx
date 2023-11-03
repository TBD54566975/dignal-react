import { matchRecordSchema } from '@/util/chat';
import styles from './ChatRecord.module.css';
import { convertBlobToUrl } from '@/util/helpers';

export default function ChatRecord({
  isSentFromUser,
  recordId,
  recordData,
  recordSchema,
}: {
  isSentFromUser: boolean;
  recordId: string;
  recordData: string | Blob;
  recordSchema: string;
}) {
  return (
    <span
      className={
        styles.message +
        ' ' +
        (matchRecordSchema(recordSchema, 'log')
          ? styles.messageLog
          : isSentFromUser
          ? styles.messageSent
          : styles.messageReceived)
      }
      aria-labelledby={`sr-${recordId} ${recordId}`}
    >
      <span id={'sr-' + recordId} className="sr-only">
        {isSentFromUser && recordSchema !== 'log' ? 'Sent' : 'Received'}
      </span>
      {/* {chatRecordElement} */}
      {typeof recordData === 'string' ? (
        <span id={recordId}>
          {recordData}{' '}
          <strong>
            {matchRecordSchema(recordSchema, 'log') &&
              isSentFromUser &&
              '(this is you)'}
          </strong>
        </span>
      ) : (
        <img
          id={recordId}
          width={240}
          src={convertBlobToUrl(recordData)}
          alt="Chat message includes picture."
        />
      )}
    </span>
  );
}
