import React, { useCallback, useState } from "react";
import Form from "antd/lib/form";
import Select from "antd/lib/select";
import Switch from "antd/lib/switch";
import { HookConfig, useConfig } from "../../common/hooks";
import { useTranslation } from "react-i18next";
import { i18nResources } from "../../i18n";

const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
export default function () {
  const context = useConfig();
  return (
    <Form
      {...formItemLayout}
      layout={"horizontal"}
      style={{ maxWidth: 600 }}
    >
      <LngSettingComp context={context} />
      <EnableComp context={context} />
    </Form>
  );
}

function LngSettingComp(
  { context }: { context: HookConfig },
) {
  const [t, i18n] = useTranslation();
  return (
    <Form.Item label={t("lngSetting")}>
      <Select
        key={i18n.language}
        defaultValue={i18n.language}
        popupMatchSelectWidth={false}
        onChange={(value: string) => {
          i18n.changeLanguage(value);
        }}
      >
        {Object.keys(i18nResources).map((lang) => {
          return <Select.Option value={lang}>{t("lng." + lang)}</Select.Option>;
        })}
      </Select>
    </Form.Item>
  );
}

function EnableComp({ context }: { context: HookConfig }) {
  const [t] = useTranslation();
  const [config, setConfig] = context;
  return (
    <Form.Item label={t("enable")}>
      <Switch
        value={config.enable}
        onChange={(e) => {
          setConfig({
            enable: e,
          });
        }}
      />
    </Form.Item>
  );
}
