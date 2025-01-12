/// <reference path="../../src/types/interface.d.ts" />
import i18next from "i18next";
import defaultConfigList from "../assets/default.config.json";
import { getLocalConfigs, matchConfig, mergeConfig } from "../common/config";
import { APP_NAME, StorageKey } from "../common/const";
import { geSyncValue, setSyncValue } from "../utils/storage";
import { sayHelloByDocument } from "../document/exports";
const defaultConfigs = defaultConfigList as Config[];

export async function getUserConfigs(): Promise<Partial<Config>[]> {
  return await geSyncValue(StorageKey.userConfig) || [];
}

let globalConfig: Config | undefined = undefined;

export async function setUserConfig(config: Partial<Config>) {
  const userConfigs = await getUserConfigs();
  let userDefaultConfig = userConfigs[0] || {};
  if (userDefaultConfig) {
    Object.assign(userDefaultConfig, config);
  }
  userConfigs[0] = userDefaultConfig;
  if (globalConfig) {
    mergeConfig(globalConfig, config);
  }
  await setSyncValue(StorageKey.userConfig, userConfigs);
  return userConfigs[0];
}

export async function getConfig(): Promise<Config> {
  if (globalConfig) return globalConfig;

  const configs: Config[] = await getLocalConfigs() || defaultConfigs;

  const userConfigs = await getUserConfigs();
  const userDefaultConfig = userConfigs[0];
  const userOtherConfigs = userDefaultConfig ? userConfigs.slice(1) : [];

  if (userDefaultConfig) {
    mergeConfig(configs[0], userDefaultConfig);
  }
  globalConfig = await matchConfig(
    userOtherConfigs.concat(configs),
    location.href,
  );
  return globalConfig;
}

export async function updateMemoConfig(config: Partial<Config>) {
  if (globalConfig) {
    mergeConfig(globalConfig, config);
  } else {
    globalConfig = config as Config;
  }
}

// 配置dom变动
let documentDomIsReady = false;
export async function setDocumentDomIsReady() {
  documentDomIsReady = true;
}

let times = 0;
export async function waitDocumentDomIsReady() {
  times++;
  if (times > 20) return false;
  if (documentDomIsReady) return true;
  //延时等待 50毫秒
  await new Promise((resolve) => setTimeout(resolve, 100));
  return waitDocumentDomIsReady();
}

export async function getDocTitle() {
  return document.title;
}

export async function getUrl() {
  return window.location.href;
}

export async function sayHelloFromContent() {
  console.log("invoke content sayHello()");
  return "hello world";
}

export async function sayHelloByInvokeDocument() {
  console.log("invoke sayHelloByInvokeDocument()");
  return sayHelloByDocument();
}
