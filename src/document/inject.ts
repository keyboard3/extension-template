import { getConfig, setDocumentDomIsReady } from "../content/exports";

console.log("inject script running...");

async function main() {
  setDocumentDomIsReady();
  const config = await getConfig();
  console.log("check inject from content context", config);
}
main();