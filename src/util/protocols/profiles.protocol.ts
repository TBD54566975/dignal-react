// prettier-ignore
export const ProfilesProtocol = {
  "protocol": "tbd/protocols/profiles/v1",
  "published": true,
  "types": {
    "profile": {},
    "label": {
      "dataFormats": ["text/plain"]
    },
    "name": {
      "dataFormats": ["text/plain"]
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
    "icon_alt": {
      "dataFormats": ["text/plain"]
    }
  },
  "structure": {
    "profile": {
      "$actions": [
        {
          "who": "anyone",
          "can": "write"
        },
        {
          "who": "anyone",
          "can": "read"
        }
      ],
      "label": {
        "$actions": [
          {
            "who": "author",
            "of": "profile",
            "can": "write"
          },
          {
            "who": "author",
            "of": "profile",
            "can": "read"
          }
        ]
      },
      "name": {
        "$actions": [
          {
            "who": "author",
            "of": "profile",
            "can": "write"
          },
          {
            "who": "anyone",
            "can": "read"
          }
        ]
      },
      "icon": {
        "$actions": [
          {
            "who": "author",
            "of": "profile",
            "can": "write"
          },
          {
            "who": "anyone",
            "can": "read"
          }
        ],
        "icon_alt": {
          "$actions": [
            {
              "who": "author",
              "of": "profile/icon",
              "can": "write"
            },
            {
              "who": "anyone",
              "can": "read"
            }
          ]
        }
      }
    }
  }
};
