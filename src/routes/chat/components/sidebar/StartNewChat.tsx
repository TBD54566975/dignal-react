import { copyToClipboard } from '@/util/helpers';
import { queryRecords, userDid, writeRecord } from '@/util/web5';
import { ChatProtocol } from '@/util/protocols/chat.protocol';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function StartNewChat() {
  const [recipientDid, setRecipientDid] = useState('');
  const navigate = useNavigate();

  async function startNewChat() {
    if (recipientDid) {
      const route = await startChat(recipientDid);
      route && navigate(String(route));
    }
  }

  return (
    <>
      <CopyDidButton />
      <div className="profile-row">
        <label htmlFor="recipientDid" className="sr-only">
          To:{' '}
        </label>
        <input
          autoComplete="off"
          id="recipientDid"
          type="text"
          onBlur={e => setRecipientDid(e.currentTarget.value)}
          placeholder="To:"
        />
        <button disabled={!recipientDid} onClick={startNewChat}>
          + New Chat
        </button>
      </div>
      {/* <HelperButtons recipientDid={recipientDid} /> */}
    </>
  );
}

export default StartNewChat;

function CopyDidButton() {
  return (
    <div className="profile-row">
      <button onClick={() => copyToClipboard(userDid)}>Copy my DID</button>
    </div>
  );
}

async function checkForDuplicateRecords(recipient: string) {
  // Check if chat exists already in DWN, where recipient initiated
  let duplicateRecords;
  const { records: duplicateRecordsFrom } = await queryRecords({
    from: recipient,
    message: {
      filter: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message',
      },
    },
  });
  duplicateRecords = duplicateRecordsFrom;
  if (!duplicateRecordsFrom || duplicateRecordsFrom.length === 0) {
    // Else check if chat exists already, where user had initiated chat
    const { records: duplicateRecordsTo } = await queryRecords({
      message: {
        filter: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message',
          recipient,
        },
      },
    });
    duplicateRecords = duplicateRecordsTo;
  }
  if (duplicateRecords && duplicateRecords.length > 0) {
    if (duplicateRecords.length > 1) {
      console.warn('More than 1 record found for protocolPath `message`');
    }
    return duplicateRecords[0].id;
  }
  return null;
}

async function startChat(recipient: string) {
  // Check for duplicate records
  const duplicateRecordId = checkForDuplicateRecords(recipient);
  if (duplicateRecordId) {
    return duplicateRecordId;
  }
  // Else write a new record to start the chat
  const { record } = await writeRecord({
    data: {
      recipients: [recipient, userDid],
    },
    message: {
      protocol: ChatProtocol.protocol,
      protocolPath: 'message',
      schema: ChatProtocol.types.message.schema,
      recipient: userDid, // make self the recipient just so we can check for dupes
      // since we dont want to publish all our chats so anyone can query
    },
  });
  if (record) {
    const { status: sendStatus } = await record.send(recipient);
    console.log(sendStatus);
    return record?.id;
  }
}
