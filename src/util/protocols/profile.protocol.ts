export const ProfileProtocol = {
  published: true,
  protocol: 'https://identity.foundation/protocols/person',
  types: {
    name: {
      schema: 'https://identity.foundation/schemas/person-name',
    },
    social: {
      schema: 'https://identity.foundation/schemas/person-social',
      dataFormats: ['application/json'],
    },
    messaging: {
      schema: 'https://identity.foundation/schemas/person-messaging',
      dataFormats: ['application/json'],
    },
    phone: {
      schema: 'https://identity.foundation/schemas/person-phone',
      dataFormats: ['application/json'],
    },
    address: {
      schema: 'https://identity.foundation/schemas/person-address',
      dataFormats: ['application/json'],
    },
    icon: {
      dataFormats: ['image/png', 'jpeg', 'gif'],
    },
    avatar: {
      dataFormats: ['image/png', 'jpeg', 'gif'],
    },
    photo: {
      schema: 'https://identity.foundation/schemas/photo',
      dataFormats: ['image/png', 'jpeg', 'gif'],
    },
    profile: {
      schema: 'https://identity.foundation/schemas/profile',
      dataFormats: ['application/json'],
    },
  },
  structure: {
    name: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
      ],
    },
    social: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
      ],
    },
    icon: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
      ],
    },
    avatar: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
      ],
    },
    messaging: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
      ],
    },
    address: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
      ],
    },
    phone: {
      $actions: [
        {
          who: 'anyone',
          can: 'read',
        },
      ],
    },
    photo: {
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
    profile: {
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
};
