export const ContactsProtocol = {
  protocol: 'https://tbddev.org/protocols/contacts',
  types: {
    friend: {
      schema: 'https://schema.org/Person',
      dataFormats: ['application/json'],
    },
    request: {
      schema: 'https://schema.org/Person',
      dataFormats: ['application/json'],
    },
  },
  structure: {
    contact: {
      request: {
        $actions: [
          {
            who: 'anyone',
            can: 'write',
          },
          {
            who: 'recipient',
            of: 'request',
            can: 'read',
          },
        ],
      },
    },
  },
};
