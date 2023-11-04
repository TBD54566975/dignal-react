// prettier-ignore
export const ContactsProtocol = {
  "protocol": "tbd/protocols/contacts/v1",
  "published": true,
  "types": {
    "directory": {
      "dataFormats": ["text/plain"] // the name of the directory, if desired
    },
    "contact": {
      "dataFormats": ["text/plain"] // the did of the contact
    },
    "name": {
      "dataFormats": ["text/plain"] // the display name of the contact
    },
    "icon": {
      "dataFormats": [
        "image/png",
        "image/gif",
        "image/jpeg",
        "image/svg+xml",
        "image/webp"
      ]
    },
    "iconAlt": {
      "dataFormats": ["text/plain"] // the alt text of the contact icon
    }
  },
  "structure": {
    "directory": {
      "$actions": [
        {
          "who": "anyone",
          "can": "write"
        },
        {
          "who": "author",
          "of": "directory",
          "can": "read"
        },
        {
          "who": "recipient",
          "of": "directory",
          "can": "read"
        }
      ],
      "contact": {
        "$actions": [
          {
            "who": "author",
            "of": "directory",
            "can": "write"
          },
          {
            "who": "recipient",
            "of": "directory",
            "can": "write"
          },
          {
            "who": "author",
            "of": "directory/contact",
            "can": "read"
          },
          {
            "who": "recipient",
            "of": "directory/contact",
            "can": "read"
          }
        ],
        "name": {
          "$actions": [
            {
              "who": "author",
              "of": "directory/contact",
              "can": "write"
            },
            {
              "who": "recipient",
              "of": "directory/contact",
              "can": "write"
            },
            {
              "who": "author",
              "of": "directory/contact/name",
              "can": "read"
            },
            {
              "who": "recipient",
              "of": "directory/contact/name",
              "can": "read"
            }
          ]
        },
        "icon": {
          "$actions": [
            {
              "who": "author",
              "of": "directory/contact",
              "can": "write"
            },
            {
              "who": "recipient",
              "of": "directory/contact",
              "can": "write"
            },
            {
              "who": "author",
              "of": "directory/contact/icon",
              "can": "read"
            },
            {
              "who": "recipient",
              "of": "directory/contact/icon",
              "can": "read"
            }
          ],
          "iconAlt": {
            "$actions": [
              {
                "who": "author",
                "of": "directory/contact/icon",
                "can": "write"
              },
              {
                "who": "recipient",
                "of": "directory/contact/icon",
                "can": "write"
              },
              {
                "who": "author",
                "of": "directory/contact/icon/iconAlt",
                "can": "read"
              },
              {
                "who": "recipient",
                "of": "directory/contact/icon/iconAlt",
                "can": "read"
              }
            ]
          }
        }
      }
    }
  }
};
