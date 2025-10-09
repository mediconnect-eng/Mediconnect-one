import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";

const app = createApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise<void>((resolve, reject) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    res.on("error", reject);

    try {
      app(req, res);
    } catch (error) {
      reject(error);
    }
  });
}
