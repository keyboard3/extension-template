import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../i18n";
import "./index.css";
import "../common/init";
import {
  openTab,
  sayHelloByBackground,
  sayHelloByBackgroundInvokeContent,
} from "../background/exports";
import { sayHelloByInvokeDocument, sayHelloFromContent } from "../content/exports";
import { useTranslation } from "react-i18next";
import { Button, Divider } from "antd/lib";
import Title from "antd/es/typography/Title";

export default function Popup({ className }: { className?: string }) {
  const [msg, setMsg] = useState<string>("");
  const [t] = useTranslation();
  return (
    <div className="popup-container">
      <Title level={2}>{t('popup.title')}</Title>
      <Button
        onClick={async () => {
          const msg = await sayHelloByBackground();
          setMsg("sayHelloByBackground:" + msg);
        }}
      >
        {t('popup.backgroundHello')}
      </Button>
      <br />
      <br />
      <Button
        onClick={async () => {
          const msg = await sayHelloByBackgroundInvokeContent();
          setMsg("sayHelloByBackgroundInvokeContent:" + msg);
        }}
      >
        {t('popup.backgroundInvokeContent')}
      </Button>
      <br />
      <br />
      <Button
        onClick={async () => {
          const msg = await sayHelloFromContent();
          setMsg("sayHelloFromContent:" + msg);
        }}
      >
        {t('popup.contentHello')}
      </Button>
      <br />
      <br />
      <Button
        onClick={async () => {
          const msg = await sayHelloByInvokeDocument();
          setMsg("sayHelloByInvokeDocument:" + msg);
        }}
      >
        {t('popup.contentInvokeDocument')}
      </Button>
      <br />
      <br />
      <Button
        onClick={() => {
          openTab("dash.html");
        }}
      >
        go {t("setting")}
      </Button>
      <Title level={5}>{msg}</Title>
    </div>
  );
}

function mainRender() {
  document.body.innerHTML = '<div id="app"></div>';
  const root = createRoot(document.getElementById("app") as HTMLElement);
  root.render(<Popup />);
}

mainRender();
