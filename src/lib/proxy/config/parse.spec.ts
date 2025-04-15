import { test, expect, describe } from "vitest";
import { parseProxyConfig } from "./parse";

describe("parse proxy config", () => {
  test("should return config data when config is valid", () => {
    const validConfig = `
      {
        "routes": [
          {
            "path": "/foo",
            "target": "http://foo.com/"
          },
          {
            "path": "/bar",
            "target": "http://bar.com/"
          }
        ]
      }
    `;
    expect(parseProxyConfig(validConfig)).toStrictEqual({
      routes: [
        {
          path: "/foo",
          target: "http://foo.com/",
        },
        {
          path: "/bar",
          target: "http://bar.com/",
        },
      ],
    });
  });

  test("should not allow extra properties", () => {
    const configWithExtraProps = `
      {
        "routes": [
          {
            "path": "/foo",
            "target": "http://foo.com/"
          },
          {
            "path": "/bar",
            "target": "http://bar.com/",
            "meIsExtraInsideRoutes": "I really should not be here..."
          }
        ],
        "meIsExtra": 2
      }
    `;
    const result = parseProxyConfig(configWithExtraProps) as Error;
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toMatchInlineSnapshot(`
      "invalid config:
      - Unrecognized key(s) in object: 'meIsExtraInsideRoutes' "routes.1"
      - Unrecognized key(s) in object: 'meIsExtra' """
    `);
  });

  test("should return error that includes the erroneous input json when given an invalid json", () => {
    const invalidJson = `
      {
        "routes": [
          {
            "path": "/foo",
            "target": "http://foo.com/"
          },
          {
            "path": "/bar",
            "target": "http://bar.com/"
          },
        ]
      }
    `;
    const result = parseProxyConfig(invalidJson) as Error;
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toMatchInlineSnapshot(`
      "invalid config: not a valid json:
      Unexpected token ']', ...",
              ]
            }
      "... is not valid JSON
      config: 
            {
              "routes": [
                {
                  "path": "/foo",
                  "target": "http://foo.com/"
                },
                {
                  "path": "/bar",
                  "target": "http://bar.com/"
                },
              ]
            }
          "
    `);
  });
});
