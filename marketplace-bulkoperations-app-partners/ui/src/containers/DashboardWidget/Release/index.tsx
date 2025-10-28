import React, { useEffect, useRef, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { Icon, Tabs, cbModal } from "@contentstack/venus-components";
import Skeleton from "components/Skeleton";
import { TypeSDKData } from "common/types";
import utils from "common/utils";
import releaseUtils from "common/utils/Release";
import localeTexts from "common/locale/en-us";
import constants from "common/constants";
import Entry from "../Entry";
import Assets from "../Asset";
import ReleaseModal from "./RelaseModal";
import "./style.scss";

function Release() {
  const ref = useRef(null);
  const [state, setState] = useState<TypeSDKData>({
    location: {},
    appSdkInitialized: false,
  });
  const [stack, setStack] = useState<any>();
  const [locales, setLocales] = useState<any>([]);
  const [releaseVersion, setReleaseVersion] = useState<number>(1);

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSDK) => {
        window.iframeRef = ref?.current;
        window.postRobot = appSDK?.postRobot;
        appSDK?.location?.DashboardWidget?.frame?.updateHeight(680);
        setStack(appSDK?.stack);
        const { locales: locale } = (await appSDK?.stack?.getLocales()) || {};
        const sortedLocales = utils.sortLocales(locale);
        setLocales(sortedLocales);
        const config = await appSDK?.getConfig();
        setReleaseVersion(config?.release_version ?? 1);
        setState({
          location: appSDK?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error: any) => console.error("Error: Contentstack Init", error));
  }, []);

  const getReleases = async () => {
    const { releases } = (await stack?.getReleases()) ?? {};
    return releaseUtils.getReleaseOptions(releases);
  };

  const openReleaseModal = (
    handleReset: Function,
    actionType: string,
    selectedData: any[],
    contentTypeUid: string,
    defaultLocale: any
  ) =>
    cbModal({
      // eslint-disable-next-line
      component: (props: any) => (
        <ReleaseModal
          actionType={actionType}
          closeModal={props?.closeModal}
          incomingLocales={locales}
          defaultLocale={defaultLocale ?? locales?.[0]?.code}
          selectedData={selectedData}
          contentTypeUid={contentTypeUid}
          handleReset={handleReset}
          getReleases={getReleases}
          releaseVersion={releaseVersion}
        />
      ),
      modalProps: {
        size: "max",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscape: true,
      },
    });

  const view = (
    <Tabs
      tabInfo={[
        {
          componentTitle: (
            <>
              <Icon className="Tab__icon" icon="Entries" />
              <div className="Tab__name">
                {localeTexts.Release.view.entryTab}
              </div>
            </>
          ),
          id: "entries",
          componentData: (
            <Entry
              // eslint-disable-next-line
              isRelease={true}
              maxSelectReleaseEntries={
                releaseVersion === 1
                  ? constants.scrollTableConstants.maxSelect.release_v1
                  : constants.scrollTableConstants.maxSelect.release_v2
              }
              openReleaseModal={openReleaseModal}
            />
          ),
        },
        {
          componentTitle: (
            <>
              <Icon className="Tab__icon" icon="Assets" />
              <div className="Tab__name">
                {localeTexts.Release.view.assetTab}
              </div>
            </>
          ),
          id: "assets",
          componentData: (
            <Assets
              // eslint-disable-next-line
              isRelease={true}
              maxSelectReleaseAssets={
                releaseVersion === 1
                  ? constants.scrollTableConstants.maxSelect.release_v1
                  : constants.scrollTableConstants.maxSelect.release_v2
              }
              openReleaseModal={openReleaseModal}
            />
          ),
        },
      ]}
      type="secondary"
    />
  );

  return (
    <div className="view-wrapper">
      {state?.appSdkInitialized ? view : <Skeleton />}
      {releaseVersion && (
        <div className="release-version-container">
          {localeTexts.Release.releaseVersionText.replace(
            "{releaseVersion}",
            `${releaseVersion}`
          )}
        </div>
      )}
    </div>
  );
}

export default Release;
