import React from "react";
import parse from "html-react-parser";
import { EmptyState } from "@contentstack/venus-components";
import localeTexts from "common/locale/en-us";

const getReleaseOptions = (releases: any[]) => {
  const options: any[] = [];
  releases?.forEach(({ locked, uid, name }: any) => {
    if (!locked) options?.push({ label: name, value: uid });
  });
  return options;
};

const transformReleaseItems = (
  items: any[],
  contentTypeUid: string,
  releaseAction: string,
  locales: string[]
) => {
  const releaseItems: any = [];
  items?.forEach((item: any) => {
    if (locales?.length > 1) {
      locales?.forEach((locale: string) =>
        releaseItems?.push({
          locale,
          uid: item?.uid,
          version: item?._version,
          title: item?.title,
          content_type_uid: contentTypeUid,
          action: releaseAction,
        })
      );
    } else {
      releaseItems?.push({
        uid: item?.uid,
        title: item?.title,
        version: item?._version,
        entry_locale: item?.locale,
        locale: locales?.[0],
        content_type_uid: contentTypeUid,
        action: releaseAction,
      });
    }
  });
  return releaseItems;
};

const entryReleaseTableEmptyHeading = (
  <EmptyState
    heading={localeTexts.Release.emptyState.heading}
    moduleIcon={localeTexts.Release.emptyState.moduleIcon}
    description={
      <div>{parse(localeTexts.Release.emptyState.entryDescription)}</div>
    }
    headingType={localeTexts.Release.emptyState.headingType}
  />
);

const assetReleaseTableEmptyHeading = (
  <EmptyState
    heading={localeTexts.Release.emptyState.heading}
    moduleIcon={localeTexts.Release.emptyState.moduleIcon}
    description={
      <div>{parse(localeTexts.Release.emptyState.assetDescription)}</div>
    }
    headingType={localeTexts.Release.emptyState.headingType}
  />
);

const releaseUtils = {
  getReleaseOptions,
  transformReleaseItems,
  entryReleaseTableEmptyHeading,
  assetReleaseTableEmptyHeading,
};

export default releaseUtils;
