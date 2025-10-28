/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import { Heading, Paragraph, Icon } from "@contentstack/venus-components";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { Link } from "react-router-dom";
import utils from "common/utils";
import { Menu, TypeSDKData } from "../../common/types";
import "./styles.scss";

const DashboardWidget: React.FC = function () {
  const [state, setState] = useState<TypeSDKData>({
    location: {},
    appSdkInitialized: false,
  });
  const [appVersion, setAppVersion] = useState<any>();

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        setAppVersion(appSdk?.version);
        appSdk?.location?.DashboardWidget?.frame?.updateHeight(680);
        setState({
          location: appSdk?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error("Error: AppSdk Initialization", error);
      });
  }, []);

  return (
    <div className="menu-wrapper">
      {state?.appSdkInitialized &&
        utils.getMenu(appVersion)?.map((module: Menu) => (
          <Link className="menu" key={module?.id} to={`${module?.path}`}>
            <div className="item" id={module?.id}>
              <div className="item-icon">
                <div className={module?.className}>
                  <Icon icon={module?.icon} hover={false} />
                </div>
              </div>
              <div className="content-block">
                <Heading tagName="h2" text={module?.title} />
                <Paragraph text={module?.description} />
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default DashboardWidget;
