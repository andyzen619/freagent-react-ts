import type { Request } from "express";
import { XMLParser } from "fast-xml-parser";

/**
 * Utility for extracting the authorization token from HTTP request headers.
 *
 * @remarks
 * This object provides methods to retrieve the token used for authentication from the `Authorization` header.
 *
 * @example
 * ```typescript
 * const { token } = AuthorizationToken.fromRequestHeaders(req);
 * ```
 */
export const AuthorizationToken = {
  fromRequestHeaders: (req: Request): { token: string } => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error(
        "Authentication Error: No authorization header provided.",
      );
    }

    const [, token] = authorization.split(" ");

    if (!token) {
      throw new Error("Authentication Error: No token provided.");
    }

    return { token };
  },
};

const xmlParser = new XMLParser();

export const XmlDataParser = {
  YahooApi: {
    parse: (xmlData: string) => {
      const parsedXmlData = xmlParser.parse(xmlData);

      const yahooApiError = parsedXmlData["yahoo:error"];

      if (yahooApiError) {
        const yahooApiErrorDescription = yahooApiError["yahoo:description"];

        throw new Error(yahooApiErrorDescription);
      }

      return { data: parsedXmlData };
    },
  },
};
