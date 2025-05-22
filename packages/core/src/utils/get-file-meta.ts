import * as path from "node:path";
import * as url from "node:url";

export const getFileMeta = (fileUrl: string | URL) => {
  const __filename = url.fileURLToPath(fileUrl);
  const __dirname = path.dirname(__filename);

  return { filename: __filename, dirname: __dirname };
};
