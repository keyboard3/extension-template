const rspack = require("@rspack/core");
import { RspackDevServer } from "@rspack/dev-server";
import { getDashConfig, getExtensionConfigs } from "./package/webpack.config";
import {
  getPreCompileUSConfig,
  getUserScriptConfigs,
} from "./package/webpack.us.config";
import "dotenv/config";

const args = process.argv.slice(2); // 获取命令行参数（去掉前两个默认参数）
const isBuild = args.includes("--build");
const isChromeBuild = args.includes("--type") &&
  args[args.indexOf("--type") + 1] === "chrome";

const buildPlatform = getBuildPlatform();
const isChrome = buildPlatform === "chrome";
const isFirefox = buildPlatform === "firefox";
const isUserScript = buildPlatform === "userscript";
const isAll = buildPlatform === "all" || !buildPlatform;

const buildConfigs = [];

if (isAll || isChrome) {
  const chromeExtensionConfigs = getExtensionConfigs("chrome");
  buildConfigs.push(...chromeExtensionConfigs);
}

if (isAll || isFirefox) {
  const firefoxExtensionConfigs = getExtensionConfigs("firefox");
  buildConfigs.push(...firefoxExtensionConfigs);
}

// const usPreConfig = getPreCompileUSConfig();
// const userScriptConfigs = getUserScriptConfigs();


const compiler = rspack(buildConfigs);

// const usCompiler = rspack(userScriptConfigs);
if (isBuild) {
  compiler.run((err: any, stats: any) => {
    if (err) {
      console.error(err);
      return;
    }
    // usCompiler.run((err: any, stats: any) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log("changed");
    // });
  });
} else {
  const dashConfig = getDashConfig();
  if (dashConfig.devServer) {
    const devServerCompiler = rspack(dashConfig);
    const server = new RspackDevServer(
      { ...dashConfig.devServer },
      devServerCompiler,
    );
    server.startCallback(() => {
      console.log(
        "Starting server on http://localhost:" + dashConfig.devServer.port,
      );
    });
  }

  compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err: any, stats: any) => {
      if (err) {
        console.error(err);
        return;
      }
      // usCompiler.run((err: any, stats: any) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      //   console.log("changed");
      // });
    },
  );
}

function getBuildPlatform() {
  const index = args.indexOf("--type");
  if (index === -1 || args.length <= index + 1) return;
  return args[index + 1];
}
