import React from "react";
import { createRoot } from "react-dom/client";
import "../i18n";
import "./index.css";
import "../common/init";
import { backgroundExample, openTab } from "../background/exports";
import { getDocTitle } from "../content/exports";
import { useTranslation } from "react-i18next";

export default function Popup({ className }: { className?: string }) {
  const [text, setText] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string | null>(null);
  const [t] = useTranslation();
  return (
    <div className="popup-container">
      <h1>Popup</h1>
      <button
        onClick={() => {
          backgroundExample().then((text) => {
            setText(text);
          });
        }}
      >
        Get Background Text
      </button>
      <p>{text}</p>
      <button
        onClick={() => {
          getDocTitle().then((title) => {
            setTitle(title);
          });
        }}
      >
        Get Doc Text
      </button>
      <p>{title}</p>

      <button
        onClick={() => {
          openTab("dash.html");
        }}
      >
        {t("setting")}
      </button>
    </div>
  );
}

function mainRender() {
  document.body.innerHTML = '<div id="app"></div>';
  const root = createRoot(document.getElementById("app") as HTMLElement);
  root.render(<Popup />);
}

mainRender();
