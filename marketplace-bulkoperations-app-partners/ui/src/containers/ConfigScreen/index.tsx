/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { Button } from "@contentstack/venus-components";
import parse from "html-react-parser";
import InfoMessage from "components/InfoMessage";
import ReleaseService from "services/Release";
import localeTexts from "common/locale/en-us";
import utils from "common/utils";
import "./styles.scss";

const ConfigScreen: React.FC = function () {
  const [state, setState] = useState<any>({
    installationData: {},
    setInstallationData: () => {},
  });
  const [releaseVersion, setReleaseVersion] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        const installationData =
          await appSdk?.location?.AppConfigWidget?.installation?.getInstallationData();

        if (installationData?.configuration?.release_version)
          setReleaseVersion(installationData?.configuration?.release_version);

        setState({
          installationData,
          setInstallationData:
            appSdk?.location?.AppConfigWidget?.installation
              ?.setInstallationData,
        });
      })
      .catch((error) => {
        console.error("Error: AppSdk Initialization", error);
      });
  }, []);

  const handleReleaseVersionCheck = async () => {
    setIsLoading(true);
    const { type, text, data } = await ReleaseService.checkReleaseVersion();
    if (type === "success") {
      setReleaseVersion(data?.release_version);
      state?.setInstallationData({
        configuration: { release_version: data?.release_version },
      });
    }
    setIsLoading(false);
    utils.toastMessage({ type, text });
  };

  return (
    <div className="configscreen-container">
      <InfoMessage
        content={parse(localeTexts.Configscreen.Info)}
        type="light"
        className="version-info"
      />
      {releaseVersion && (
        <div className="current-version-info">
          {localeTexts.Configscreen.VersionInfo.replace(
            "{releaseVersion}",
            `${releaseVersion}`
          )}
        </div>
      )}
      <Button
        version="v2"
        buttonType="secondary"
        className="check-release-version"
        isLoading={isLoading}
        loadingColor="#6c5ce7"
        onClick={handleReleaseVersionCheck}
      >
        {localeTexts.Configscreen.ButtonText}
      </Button>
    </div>
  );
};

export default ConfigScreen;
