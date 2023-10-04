import { describe, expect, it, vi } from 'vitest';
import { ChatProtocol } from '@/util/protocols/chat.protocol';
import { ProfileProtocol } from '@/util/protocols/profile.protocol';
import {
  QueryDateSort,
  queryRecords,
  readRecord,
  userDid,
  writeRecord,
} from '@/util/web5';
import {
  queryFromDwnParticipantProfile,
  readFromDwnParticipantPicture,
  queryFromDwnProfile,
  readFromDwnPicture,
  queryFromDwnParticipantMessages,
  queryFromDwnMessages,
  queryFromDwnMessagesWithParticipant,
  writeToDwnMessage,
  queryFromDwnMessageReplies,
  writeToDwnMessageReply,
} from '../dwn';

vi.mock('@/util/web5', () => ({
  queryRecords: vi.fn(() => {
    return {
      status: { code: 200, detail: 'success' },
      records: [{ recordId: '123' }],
    };
  }),
  readRecord: vi.fn(() => {
    return {
      status: { code: 200, detail: 'success' },
      record: { recordId: '456' },
    };
  }),
  writeRecord: vi.fn(() => {
    return {
      status: { code: 200, detail: 'success' },
      record: { recordId: '789' },
    };
  }),
  userDid: 'did:ion:userDid',
  QueryDateSort: {
    createdDescending: 'createdDescending',
  },
}));

describe('Querying and reading from profile protocol', () => {
  describe('#queryFromDwnParticipantProfile', () => {
    it('should get all profiles from a remote DWN', async done => {
      const queryRequest = {
        from: 'did:ion:example',
        message: {
          filter: {
            protocol: ProfileProtocol.protocol,
            protocolPath: 'profile',
            schema: ProfileProtocol.types.profile.schema,
            dataFormat: ProfileProtocol.types.profile.dataFormats[0],
          },
        },
      };
      const result = await queryFromDwnParticipantProfile('did:ion:example');
      await expect(queryRecords).toBeCalledWith(queryRequest);
      await expect(result).toEqual([{ recordId: '123' }]);
      done;
    });
  });

  describe('#readFromDwnParticipantPicture', () => {
    it('should get a profile record from a remote DWN', async done => {
      const readRequest = {
        from: 'did:ion:example',
        message: {
          recordId: '456',
        },
      };
      const result = await readFromDwnParticipantPicture(
        'did:ion:example',
        '456',
      );
      await expect(readRecord).toBeCalledWith(readRequest);
      await expect(result).toEqual({ recordId: '456' });
      done;
    });
  });

  describe('#queryFromDwnProfile', () => {
    it('should get all profile records from a local DWN', async done => {
      const queryRequest = {
        message: {
          filter: {
            protocol: ProfileProtocol.protocol,
            protocolPath: 'profile',
            schema: ProfileProtocol.types.profile.schema,
            dataFormat: ProfileProtocol.types.profile.dataFormats[0],
          },
        },
      };
      const result = await queryFromDwnProfile();
      await expect(queryRecords).toBeCalledWith(queryRequest);
      await expect(result).toEqual([{ recordId: '123' }]);
      done;
    });
  });

  describe('#readFromDwnPicture', () => {
    it('should get a profile picture record from a local DWN', async done => {
      const readRequest = {
        message: {
          recordId: '456',
        },
      };
      const result = await readFromDwnPicture('456');
      await expect(readRecord).toBeCalledWith(readRequest);
      await expect(result).toEqual({ recordId: '456' });
      done;
    });
  });
});

describe('Querying and reading from chat protocol', () => {
  describe('#queryFromDwnParticipantMessages', () => {
    it('should get all root chat records from a remote DWN', async done => {
      const queryRequest = {
        from: 'did:ion:example',
        message: {
          filter: {
            protocol: ChatProtocol.protocol,
            protocolPath: 'message',
            schema: ChatProtocol.types.message.schema,
            dataFormat: ChatProtocol.types.message.dataFormats[0],
          },
        },
      };
      const result = await queryFromDwnParticipantMessages('did:ion:example');
      await expect(queryRecords).toBeCalledWith(queryRequest);
      await expect(result).toEqual([{ recordId: '123' }]);
      done;
    });
  });
  describe('#queryFromDwnMessages', () => {
    it('should get all root chat records from a local DWN sorted by descending date', async done => {
      const queryRequest = {
        message: {
          filter: {
            protocol: ChatProtocol.protocol,
            protocolPath: 'message',
            schema: ChatProtocol.types.message.schema,
            dataFormat: ChatProtocol.types.message.dataFormats[0],
          },
          dateSort: QueryDateSort.createdDescending,
        },
      };
      const result = await queryFromDwnMessages();
      await expect(queryRecords).toBeCalledWith(queryRequest);
      await expect(result).toEqual([{ recordId: '123' }]);
      done;
    });
  });
  describe('#queryFromDwnMessagesWithParticipant', () => {
    it('should get all root chat records from a local DWN where recipient was set by other participant', async done => {
      const queryRequest = {
        message: {
          filter: {
            protocol: ChatProtocol.protocol,
            protocolPath: 'message',
            schema: ChatProtocol.types.message.schema,
            dataFormat: ChatProtocol.types.message.dataFormats[0],
            recipient: 'did:ion:example',
          },
        },
      };
      const result =
        await queryFromDwnMessagesWithParticipant('did:ion:example');
      await expect(queryRecords).toBeCalledWith(queryRequest);
      await expect(result).toEqual([{ recordId: '123' }]);
      done;
    });
  });
  describe('#writeToDwnMessage', () => {
    it('should write a DWN root chat record to local DWN where record recipient is self and record data has chat recipients', async done => {
      const writeRequest = {
        data: {
          recipients: ['did:ion:example', userDid],
        },
        message: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message',
          schema: ChatProtocol.types.message.schema,
          dataFormat: ChatProtocol.types.message.dataFormats[0],
          recipient: userDid,
        },
      };
      const result = await writeToDwnMessage('did:ion:example');
      await expect(writeRecord).toBeCalledWith(writeRequest);
      await expect(result).toEqual({ recordId: '789' });
      done;
    });
  });
  describe('#queryFromDwnMessageReplies', () => {
    it('should get all chat reply records from local DWN', async done => {
      const queryRequest = {
        message: {
          filter: {
            protocol: ChatProtocol.protocol,
            protocolPath: 'message/reply',
            schema: ChatProtocol.types.reply.schema,
            dataFormat: ChatProtocol.types.reply.dataFormats[0],
            contextId: '789',
          },
        },
      };
      const result = await queryFromDwnMessageReplies('789');
      await expect(queryRecords).toBeCalledWith(queryRequest);
      await expect(result).toEqual([{ recordId: '123' }]);
      done;
    });
  });
  describe('#writeToDwnMessageReply', () => {
    it('should get all chat reply records from local DWN', async done => {
      const writeRequest = {
        data: {
          text: 'hello web5',
          author: userDid,
        },
        message: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message/reply',
          schema: ChatProtocol.types.reply.schema,
          dataFormat: ChatProtocol.types.reply.dataFormats[0],
          contextId: '123',
          parentId: '123',
        },
      };
      const result = await writeToDwnMessageReply('hello web5', '123');
      await expect(writeRecord).toBeCalledWith(writeRequest);
      await expect(result).toEqual({ recordId: '789' });
      done;
    });
  });
});
