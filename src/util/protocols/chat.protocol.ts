export const ChatProtocol = {
  protocol: 'https://tbddev.org/protocols/chat',
  published: true,
  types: {
    thread: {
      schema: 'https://schema.zion.fyi/chat/thread/v2',
      dataFormats: ['application/json'],
    },
    message: {
      schema: 'https://schema.zion.fyi/chat/message/v2',
      dataFormats: ['application/json'],
    },
    reply: {
      schema: 'https://schema.zion.fyi/chat/message/v2',
      dataFormats: ['application/json'],
    },
    reaction: {
      schema: 'reaction',
      dataFormats: ['application/json'],
    },
    block: {
      schema: 'block',
      dataFormats: ['application/json'],
    },
    attachment: {
      dataFormats: [
        'image/png',
        'image/gif',
        'image/jpeg',
        'application/mp4',
        'audio/mp4',
      ],
    },
    admin: {
      schema: 'https://identity.foundation/protocols/chat/role',
      dataFormats: ['application/json'],
    },
    participant: {
      schema: 'https://identity.foundation/protocols/chat/role',
      dataFormats: ['application/json'],
    },
    maintainer: {
      schema: 'https://identity.foundation/protocols/chat/role',
      dataFormats: ['application/json'],
    },
    invite: {
      schema: 'https://identity.foundation/protocols/chat/invite',
      dataFormats: ['application/json'],
    },
  },
  structure: {
    invite: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
      ],
    },
    thread: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
      ],
    },
    maintainer: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
      ],
    },
    participant: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
      ],
    },
    message: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
        {
          who: 'anyone',
          can: 'read',
        },
      ],
      reply: {
        $actions: [
          {
            who: 'anyone',
            can: 'write',
          },
          {
            who: 'anyone',
            can: 'read',
          },
        ],
      },
    },
    attachment: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
      ],
    },
    reaction: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
      ],
    },
    block: {
      $actions: [
        {
          who: 'anyone',
          can: 'write',
        },
      ],
    },
  },
};
