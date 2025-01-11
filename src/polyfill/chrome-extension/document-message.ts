import { APP_NAME } from "../../common/const";
import { deserialize, getExportMethodNames, serialize } from "./util";

export function getHookDocToContentExports(platform: ExtensionPlatform) {
  const map = getHooKDocToContentMethodMap();
  const content = Object.entries(map).map(([key, value]) =>
    `export const ${key}=${value};`
  ).join("\n");
  return `${content}\n${getCommonHookDocToContentFun(platform)}`;
}

export function getHooKDocToContentMethodMap() {
  const methodNames = getExportMethodNames("../../content/exports");
  const map: { [key: string]: string } = {};
  methodNames.forEach((key) => {
    map[key] = `commonHookFun.bind(null,"${key}")`;
  });
  return map;
}

export function getCommonHookDocToContentFun(platform: ExtensionPlatform) {
  return `async function commonHookFun(methodName:any,...args:any[]) {
       const mid = Math.random().toString(36).slice(2);
       document.dispatchEvent(new CustomEvent("${APP_NAME}-doc", {detail: ${
    serialize(platform, `{method: methodName,id:mid, args}`)
  }}));
       const response = await new Promise((resolve) => {
            const listener = (event: CustomEvent) => {
                const {method,id,response} = ${
    deserialize(platform, "event.detail")
  } || {};
                if (method === methodName && id == mid) {
                    document.removeEventListener("${APP_NAME}-doc-response", listener);
                    resolve(response);
                }
            };
            document.addEventListener("${APP_NAME}-doc-response", listener);
        });
       return response;
      }
  `;
}
