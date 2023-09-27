import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/routes';
import { IChatRecord } from '@routes/chat/types';
import Close from '@assets/icons/x-close.svg';
import { queryRecords } from '@/util/web5';
import { ChatProtocol } from '@/util/protocols/chat.protocol';
import { MouseEvent, useEffect } from 'react';
import { hideSidebar } from '../../utils';
import { VerifiableCredential } from '@web5/credentials';

function ChatLink({ chat }: { chat: IChatRecord }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [verified, setVerified] = useState<boolean>(false);


  useEffect(() => {
    checkVerified();
  });
  
  async function checkVerified() {
    setVerified(await isVerified(chat.record.contextId, chat.name));
  }

  async function deleteChat(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // delete all chats in a context, but preserve the root context
    // so other participant can reignite chat context if needed
    const { records } = await queryRecords({
      message: {
        filter: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message/reply',
          contextId: chat.record.contextId,
        },
      },
    });
    if (records) {
      for (const record of records) {
        await record.delete();
      }
    }
    if (location.pathname.includes(chat.record.contextId)) {
      navigate(RoutePaths.CHAT);
    }
  }

  return (
    <>
      <NavLink
        to={RoutePaths.CHAT + '/' + chat.record.id}
        onClick={hideSidebar}
        end
        className="message-row"
      >
        <div className="avatar-container">
          <div className="avatar">
            <img src={chat.picture} alt="" />
          </div>
        </div>
        <div className="contents">
          <div className="message">
            <h2>{verified ? chat.name + " ✅" : chat.name}  </h2>
          </div>
        </div>
      </NavLink>
      <button className="icon-button highlight-button" onClick={deleteChat}>
        <img width="16" src={Close} alt="" /> Delete
      </button>
    </>
  );
}

async function isVerified(contextId: string, chatName: string) {
  const { records } = await queryRecords({
    message: {
      filter: { contextId, protocolPath: 'message/reply' },
    },
  });

  if (records) {
    for (const record of records) {
      const data = await record.data.json();
      if(isJwt(data.text)) {
        try {
          // Check if valid VcJwt. This checks that the VC is authentic
          await VerifiableCredential.verify(data.text)

          const payload = JSON.parse(atob(data.text.split('.')[1]))
          console.log(JSON.stringify(payload, null, 2))

          // This is a hardcoded trusted issuer
          if(payload.iss !== "did:key:z6MkhjgMe6jrA65VczjNeAUqYN1n91gttw6aJJ4pKdTCJ4Yd") {
            continue;
          }

          // TODO: Validate subject (get subject from chat object)
          // if(payload.sub !== "") {
          //  continue;
          // }

          // Confirm that the VC is for the username
          if(payload.vc.credentialSubject.username !== chatName) {
            continue;
          }

          return true;
        } catch (e) {
          continue;
        }
      }
    }
  }
  return false;
}

function isJwt(input: string): boolean {
  if (typeof input !== 'string') return false;
  const parts = input.split('.');
  if (parts.length !== 3) return false;

  try {
    const payloadString = atob(parts[1]); 
    const payload = JSON.parse(payloadString);
    if (payload.vc) {
      return true
    }
  } catch(e) {
    // console.warn('Invalid JWT', input)
  }

  return false;
}

export default ChatLink;
