/// <reference path="../src/types/typings.d.ts" />
import fs from "fs";
import path from "path";
import {
  getHookContentToBackExports,
  getHookContentToDocExports,
  getImplDocToContentExports,
} from "../src/polyfill/chrome-extension/content-message";
import {
  getCommonHookDocToContentFun,
  getHookDocToContentExports,
  getHooKDocToContentMethodMap,
} from "../src/polyfill/chrome-extension/document-message";
import {
  getHookExtensionToContent,
  getHookExtensionToPopup,
  getImplExtensionToPopup,
} from "../src/polyfill/chrome-extension/extension-message";
import { APP_NAME } from "../src/common/const";

export default async function (source: string) {
  const resourcePath = path.normalize(this.resourcePath);
  try {
    const { entry, platform } = this.getOptions();
    if (
      entry != "popup" &&
      resourcePath.includes(path.normalize("src/popup/index"))
    ) {
      return source.replace("mainRender();", "");
    }
    if (entry == "popup") {
      const res = injectPopup.call(this, platform, source);
      if (res) return res;
    }
    if (platform === "userscript") {
      const res = injectUserScript.call(this, entry, source);
      if (res) return res;
    }
    if (entry == "content") {
      const res = injectContent.call(this, platform, source);
      if (res) return res;
    }
    if (entry == "background") {
      const res = injectBackground.call(this, platform, source);
      if (res) return res;
    }
    if (entry == "inject") {
      const res = injectInject.call(this, platform, source);
      if (res) return res;
    }
    if (entry == "dash") {
      const res = injectDash.call(this, platform, source);
      if (res) return res;
    }
    return source;
  } catch (error) {
    console.error(error);
    return source;
  }
}

function injectUserScript(entry: string, source: string) {
  const resourcePath = path.normalize(this.resourcePath);
  if (
    entry == "template.user" &&
    resourcePath.includes(path.normalize("document/inject.ts"))
  ) {
    //读取dist/userscript/inject.js 然后返回
    const content = fs.readFileSync(
      path.resolve(__dirname, "../dist/userscript/inject.js"),
      "utf-8",
    );
    return `export default ${JSON.stringify(content)}`;
  }
  const newResourcePath = this.resourcePath.replace(/(\.tsx?)/, ".us$1");
  if (fs.existsSync(newResourcePath)) {
    const content = fs.readFileSync(newResourcePath, "utf-8");
    source = content;
  }
  if (
    entry == "inject" &&
    resourcePath.includes(path.normalize("src/content/exports"))
  ) {
    return getHookDocToContentExports("firefox");
  }
  if (
    entry == "template.user" &&
    resourcePath.includes(path.normalize("src/polyfill/userscript/index"))
  ) {
    return `${getImplDocToContentExports("firefox")}${source}`;
  }

  if (resourcePath.includes(path.normalize("common/resource"))) {
    //统计出dist/chrome/css 下所有的css文件名
    const cssCodes = fs.readdirSync(
      path.resolve(__dirname, "../dist/chrome/css"),
    ).filter((item) => !["dash.css"].includes(item))
      .map((filename) => {
        const fileContent = fs.readFileSync(
          path.resolve(__dirname, "../dist/chrome/css", filename),
          "utf-8",
        );
        const id = `${APP_NAME}_${
          filename.replace(".css", "").replace("/", "_")
        }`;
        return `
      if(resource.includes("${filename}")){
        id = "${id}";
        resource = ${JSON.stringify(fileContent)};
      }
      `;
      });

    source = source.replace(
      /(createCSSLink.+?{)/ig,
      `$1${cssCodes.join("\n")}`,
    );
  }
  return source;
}

function injectBackground(platform: ExtensionPlatform, source: string) {
  const resourcePath = path.normalize(this.resourcePath);
  if (resourcePath.includes(path.normalize("src/background/exports"))) {
    const code = source.replace(
      /export async function sync/g,
      "export function sync",
    );
    return code;
  }
  if (resourcePath.includes(path.normalize("src/content/exports"))) {
    const code = getHookExtensionToContent(platform);
    return code;
  }
  if (resourcePath.includes(path.normalize("src/popup/exports"))) {
    const code = getHookExtensionToPopup(platform);
    return code;
  }
  return;
}

function injectPopup(platform: ExtensionPlatform, source: string) {
  const resourcePath = path.normalize(this.resourcePath);
  if (
    resourcePath.includes(path.normalize("src/popup/index.tsx")) &&
    platform == "chrome"
  ) {
    return `${source} ${getImplExtensionToPopup()}`;
  }
  if (resourcePath.includes(path.normalize("src/background/exports"))) {
    return getHookContentToBackExports(platform);
  }
  if (resourcePath.includes(path.normalize("src/content/exports"))) {
    const code = getHookExtensionToContent(platform);
    return code;
  }
  return;
}

function injectContent(platform: ExtensionPlatform, source: string) {
  const resourcePath = path.normalize(this.resourcePath);
  if (resourcePath.includes(path.normalize("src/background/exports"))) {
    return getHookContentToBackExports(platform);
  }
  if (resourcePath.includes(path.normalize("src/popup/exports"))) {
    return getHookExtensionToPopup(platform);
  }
  if (resourcePath.includes(path.normalize("src/document/exports"))) {
    return getHookContentToDocExports(platform);
  }
  return;
}

function injectDash(platform: ExtensionPlatform, source: string) {
  const resourcePath = path.normalize(this.resourcePath);
  if (resourcePath.includes(path.normalize("src/content/exports"))) {
    const map = getHooKDocToContentMethodMap();
    const commonHook = getCommonHookDocToContentFun(platform);
    let newSource = source + "\n" + commonHook;
    Object.keys(map).forEach((methodName) => {
      newSource = newSource.replace(
        new RegExp(`(export async function ${methodName}.+)`),
        `$1\n
      if(typeof browser == "undefined") {
        return ${map[methodName]}.apply(null, arguments);
      }
      `,
      );
    });
    return newSource;
  }
  return;
}

function injectInject(platform: ExtensionPlatform, source: string) {
  const resourcePath = path.normalize(this.resourcePath);
  if (resourcePath.includes(path.normalize("src/content/exports"))) {
    return getHookDocToContentExports(platform);
  }
  return;
}
