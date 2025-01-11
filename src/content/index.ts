import "../i18n";
import { getConfig, updateMemoConfig, waitDocumentDomIsReady } from "./exports";
import { APP_NAME } from "../common/const";

const version = process.env.VERSION;
async function main() {
  const config = await getConfig();
  if (!config.enable) {
    console.log("未启用 不执行main");
    return;
  }
  if (injectVersionMeta()) {
    updateMemoConfig({ enable: false });
    console.log("发现已经存在不执行");
    return;
  }
  await checkDomReady();
  await waitDocumentDomIsReady();
}

function checkDomReady() {
  if (document.readyState !== "loading") {
    return true;
  }
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => {
      resolve(true);
    });
  });
}

function injectVersionMeta() {
  if (document.querySelector(`meta[name=${APP_NAME}_version]`)) {
    return true;
  }
  const meta = document.createElement("meta");
  meta.name = APP_NAME + "_version";
  meta.content = version;
  document.head.appendChild(meta);
  return false;
}

console.log("content script running...");
main();
