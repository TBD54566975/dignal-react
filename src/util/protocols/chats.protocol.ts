// prettier-ignore
export const ChatsProtocol = {
  "protocol": "tbd/protocols/chats/v1",
  "published": true,
  "types": {
    "chat": {},
    "metadata": {
      "schema": "metadata",
      "dataFormats": ["application/json"]
    },
    "thread": {},
    "message": {
      "dataFormats": ["text/plain"]
    },
    "log": {
      "dataFormats": ["text/plain"]
    },
    "attachment": {
      "dataFormats": [
        "image/png",
        "image/gif",
        "image/jpeg",
        "image/svg+xml",
        "image/webp",
      ]
    },
    "reaction": {
      "dataFormats": ["text/plain"]
    },
    "invite": {},
    "request": {
      "dataFormats": ["text/plain"]
    }
  },
  "structure": {
    "chat": {
      "$actions": [
        {
          "who": "anyone",
          "can": "write"
        },
        {
          "who": "anyone",
          "can": "read"
        },
      ],
      "metadata": {
        "$actions": [
          {
            "who": "author",
            "of": "chat",
            "can": "write"
          },
          {
            "who": "recipient",
            "of": "chat",
            "can": "write"
          },
          {
            "who": "author",
            "of": "chat/metadata",
            "can": "read"
          },
          {
            "who": "recipient",
            "of": "chat/metadata",
            "can": "read"
          }
        ],
      },
      "thread": {
        "$actions": [
          {
            "who": "author",
            "of": "chat",
            "can": "write"
          },
          {
            "who": "recipient",
            "of": "chat",
            "can": "write"
          },
          {
            "who": "author",
            "of": "chat/thread",
            "can": "read"
          },
          {
            "who": "recipient",
            "of": "chat/thread",
            "can": "read"
          }
        ],
        "log": {
          "$actions": [
            {
              "who": "author",
              "of": "chat/thread",
              "can": "write"
            },
            {
              "who": "recipient",
              "of": "chat/thread",
              "can": "write"
            },
            {
              "who": "author",
              "of": "chat/thread/log",
              "can": "read"
            },
            {
              "who": "recipient",
              "of": "chat/thread/log",
              "can": "read"
            }
          ],
        },
        "message": {
          "$actions": [
            {
              "who": "author",
              "of": "chat/thread",
              "can": "write"
            },
            {
              "who": "recipient",
              "of": "chat/thread",
              "can": "write"
            },
            {
              "who": "author",
              "of": "chat/thread/message",
              "can": "read"
            },
            {
              "who": "recipient",
              "of": "chat/thread/message",
              "can": "read"
            }
          ],
          "reaction": {
            "$actions": [
              {
                "who": "author",
                "of": "chat/thread/message",
                "can": "write"
              },
              {
                "who": "recipient",
                "of": "chat/thread/message",
                "can": "write"
              },
              {
                "who": "author",
                "of": "chat/thread/message/reaction",
                "can": "read"
              },
              {
                "who": "recipient",
                "of": "chat/thread/message/reaction",
                "can": "read"
              }
            ]
          },
          "thread": {
            "$actions": [
              {
                "who": "author",
                "of": "chat/thread/message",
                "can": "write"
              },
              {
                "who": "recipient",
                "of": "chat/thread/message",
                "can": "write"
              },
              {
                "who": "author",
                "of": "chat/thread/message/thread",
                "can": "read"
              },
              {
                "who": "recipient",
                "of": "chat/thread/message/thread",
                "can": "read"
              }
            ],
            "message": {
              "$actions": [
                {
                  "who": "author",
                  "of": "chat/thread/message/thread",
                  "can": "write"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/message/thread/message",
                  "can": "write"
                },
                {
                  "who": "author",
                  "of": "chat/thread/message/thread/message",
                  "can": "read"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/message/thread/message",
                  "can": "read"
                }
              ],
              "reaction": {
                "$actions": [
                  {
                    "who": "author",
                    "of": "chat/thread/message/thread/message",
                    "can": "write"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/message/thread/message",
                    "can": "write"
                  },
                  {
                    "who": "author",
                    "of": "chat/thread/message/thread/message/reaction",
                    "can": "read"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/message/thread/message/reaction",
                    "can": "read"
                  }
                ]
              },
            },
            "attachment": {
              "$actions": [
                {
                  "who": "author",
                  "of": "chat/thread/message/thread",
                  "can": "write"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/message/thread",
                  "can": "write"
                },
                {
                  "who": "author",
                  "of": "chat/thread/message/thread/attachment",
                  "can": "read"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/message/thread/attachment",
                  "can": "read"
                }
              ],
              "reaction": {
                "$actions": [
                  {
                    "who": "author",
                    "of": "chat/thread/message/thread/attachment",
                    "can": "write"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/message/thread/attachment",
                    "can": "write"
                  },
                  {
                    "who": "author",
                    "of": "chat/thread/message/thread/attachment/reaction",
                    "can": "read"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/message/thread/attachment/reaction",
                    "can": "read"
                  }
                ]
              },
            }
          },
        },
        "attachment": {
          "$actions": [
            {
              "who": "author",
              "of": "chat/thread",
              "can": "write"
            },
            {
              "who": "recipient",
              "of": "chat/thread",
              "can": "write"
            },
            {
              "who": "author",
              "of": "chat/thread/attachment",
              "can": "read"
            },
            {
              "who": "recipient",
              "of": "chat/thread/attachment",
              "can": "read"
            }
          ],
          "reaction": {
            "$actions": [
              {
                "who": "author",
                "of": "chat/thread/attachment",
                "can": "write"
              },
              {
                "who": "recipient",
                "of": "chat/thread/attachment",
                "can": "write"
              },
              {
                "who": "author",
                "of": "chat/thread/attachment/reaction",
                "can": "read"
              },
              {
                "who": "recipient",
                "of": "chat/thread/attachment/reaction",
                "can": "read"
              }
            ]
          },
          "thread": {
            "$actions": [
              {
                "who": "author",
                "of": "chat/thread/attachment",
                "can": "write"
              },
              {
                "who": "recipient",
                "of": "chat/thread/attachment",
                "can": "write"
              },
              {
                "who": "author",
                "of": "chat/thread/attachment/thread",
                "can": "read"
              },
              {
                "who": "recipient",
                "of": "chat/thread/attachment/thread",
                "can": "read"
              }
            ],
            "message": {
              "$actions": [
                {
                  "who": "author",
                  "of": "chat/thread/attachment/thread",
                  "can": "write"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/attachment/thread",
                  "can": "write"
                },
                {
                  "who": "author",
                  "of": "chat/thread/attachment/thread/message",
                  "can": "read"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/attachment/thread/message",
                  "can": "read"
                }
              ],
              "reaction": {
                "$actions": [
                  {
                    "who": "author",
                    "of": "chat/thread/attachment/thread/message",
                    "can": "write"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/attachment/thread/message",
                    "can": "write"
                  },
                  {
                    "who": "author",
                    "of": "chat/thread/attachment/thread/message/reaction",
                    "can": "read"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/attachment/thread/message/reaction",
                    "can": "read"
                  }
                ]
              },
            },
            "attachment": {
              "$actions": [
                {
                  "who": "author",
                  "of": "chat/thread/attachment/thread",
                  "can": "write"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/attachment/thread",
                  "can": "write"
                },
                {
                  "who": "author",
                  "of": "chat/thread/attachment/thread/attachment",
                  "can": "read"
                },
                {
                  "who": "recipient",
                  "of": "chat/thread/attachment/thread/attachment",
                  "can": "read"
                }
              ],
              "reaction": {
                "$actions": [
                  {
                    "who": "author",
                    "of": "chat/thread/attachment/thread/attachment",
                    "can": "write"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/attachment/thread/attachment",
                    "can": "write"
                  },
                  {
                    "who": "author",
                    "of": "chat/thread/attachment/thread/attachment/reaction",
                    "can": "read"
                  },
                  {
                    "who": "recipient",
                    "of": "chat/thread/attachment/thread/attachment/reaction",
                    "can": "read"
                  }
                ]
              },
            }
          },
        }
      },
      "invite": {
        "$actions": [
          {
            "who": "author",
            "of": "chat",
            "can": "write"
          },
          {
            "who": "anyone",
            "can": "read",
          },
        ]
      },
    },
    "request": {
      "$actions": [
        {
          "who": "anyone",
          "can": "write"
        },
        {
          "who": "author",
          "of": "request",
          "can": "read"
        },
        {
          "who": "recipient",
          "of": "request",
          "can": "read"
        }
      ]
    }
  }
};
