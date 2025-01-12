import { sayHelloFromContent } from "../content/exports";

export async function fetchInBackground(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
) {
  return fetch(input, init).then(async (res) => {
    const { status, statusText, headers } = res;

    const headersObj: any = {};
    for (let [key, value] of headers.entries()) {
      headersObj[key] = value;
    }
    let result = await res.arrayBuffer() as ArrayBuffer;
    const arrayBuffer = Array.from(new Uint8Array(result));
    const response = {
      arrayBuffer,
      options: {
        status,
        statusText,
        headers: headersObj,
      },
    };
    return JSON.stringify(response);
  });
}

export async function openTab(url: string) {
  browser.tabs.create({ url });
}

export async function sayHelloByBackground() {
  console.log("invoke background sayHello()");
  return "hello world";
}

export async function sayHelloByBackgroundInvokeContent() {
  console.log("invoke sayHelloByBackgroundInvokeContent");
  return await sayHelloFromContent();
}
