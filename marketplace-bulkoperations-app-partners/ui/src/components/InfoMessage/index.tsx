import React from "react";
import { Icon, Info } from "@contentstack/venus-components";
import { Props } from "common/types";

const InfoMessage: React.FC<Props> = function ({ content, type, className }) {
  let infoIcon;
  if (type === "attention") {
    infoIcon = <Icon icon="Warning" size="small" />;
  }

  return (
    <Info
      version="v2"
      className={className}
      icon={infoIcon}
      content={content}
      type={type}
    />
  );
};

export default React.memo(InfoMessage);
