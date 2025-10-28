import React from "react";
import {
  EmptyState,
  Icon,
  Notification,
  OutlineTag,
  Tooltip,
} from "@contentstack/venus-components";
import { checkSync } from "recheck";
import Moment from "react-moment";
import constants from "common/constants";
import localeTexts from "common/locale/en-us";

const toastMessage = ({ type, text }: any) => {
  Notification({
    notificationContent: {
      text,
    },
    notifyProps: {
      hideProgressBar: true,
    },
    type,
  });
};

const mapForSelectOption = (label: string, value: string) => {
  const result = {
    label,
    value,
  };
  return result;
};

const tooltipWrapper = (
  content: string,
  divClass: string = "content-wrapper"
) => (
  <Tooltip content={content} position="top" type="primary" variantType="dark">
    <div className={divClass}>{content}</div>
  </Tooltip>
);

const getComponent = (
  content: string,
  caseValue: string,
  divClass?: string
) => {
  let component;
  switch (caseValue) {
    case "tooltip":
      component = tooltipWrapper(content, divClass);
      break;
    case "datetime":
      component = <Moment date={content} format="MMM DD, YYYY LT" />;
      break;
    case "status":
      component = (
        <OutlineTag
          content={<div className="outline-content">{content}</div>}
          type="positive"
          className={
            content === localeTexts.Asset.Message.operation.unsuccess.status
              ? "status-failed"
              : "status-success"
          }
        />
      );
      break;
    default:
      component = content;
  }
  return component;
};

const wrapWithDiv = (content: string, caseValue: string, divClass?: string) =>
  content ? (
    <div className="column-wrapper">
      {getComponent(content, caseValue, divClass)}
    </div>
  ) : (
    <div className="column-wrapper asset-filename">-</div>
  );

const getPublishStatusEnv = (
  envId: string,
  stateEnvironments: any[],
  moreNumber?: number
) => {
  const result = stateEnvironments?.find(({ uid }: any) => uid === envId);
  if (result) {
    return (
      <div className="status-wrap">
        <Icon className="table-icon" icon="DefaultEnv" />
        <div className="env-name">{result?.name}</div>
        {moreNumber ? `+${moreNumber} more` : ""}
      </div>
    );
  }
  return null;
};

const createLoadedObject = (count: number) =>
  Object.fromEntries(Array.from({ length: count }, (_, i) => [i, "loaded"]));

const sortLocales = (LocalesArr: any[]) => {
  const sortedArr = [...LocalesArr]?.sort((a, b) =>
    a?.name?.localeCompare(b?.name)
  );
  const masterLocaleIndex = sortedArr?.findIndex(
    (item: any) => item?.fallback_locale === null
  );
  const masterLocale = { ...sortedArr?.[masterLocaleIndex] };
  sortedArr?.splice(masterLocaleIndex, 1);
  sortedArr?.unshift(masterLocale);
  return sortedArr;
};

const getRegionUrl = (region: string, apiKey: string) => {
  let regionUrl = "";
  const regionMapping = JSON.parse(process.env.REACT_APP_REGION_MAPPING ?? "");
  const appRegion = Object.keys(regionMapping)?.find(
    (domainName) => domainName === region
  );
  if (appRegion) {
    regionUrl = regionMapping?.[appRegion]?.DOMAIN_URL;
  }
  return `${regionUrl}/#!/stack/${apiKey}`;
};

const getMenu = (appVersion: number) => {
  const version = parseInt(process.env.REACT_APP_BULKOP_VERSION ?? "1", 10);
  const menu = [...constants.MENU];
  const item =
    appVersion > version
      ? {
          id: "releases",
          title: "Releases",
          description: "Add Entries/Assets to Release and Create a Release",
          icon: "ReleaseModuleLarge",
          path: "/release",
          className: "icon_release",
        }
      : {
          id: "releases-disabled",
          title: "Releases",
          description: "Coming Soon...",
          icon: "ReleaseModuleLarge",
          path: "/dashboard-widget",
          className: "icon_release",
        };
  menu?.splice(2, 0, item);
  return menu;
};

const customSort: any = (arr: any[]) =>
  arr?.sort((a, b) => {
    const charA = a?.label?.charAt(0);
    const charB = b?.label?.charAt(0);
    const codeA = charA?.charCodeAt(0);
    const codeB = charB?.charCodeAt(0);

    const isASpecial =
      !(charA >= "A" && charA <= "Z") && !(charA >= "a" && charA <= "z");
    const isBSpecial =
      !(charB >= "A" && charB <= "Z") && !(charB >= "a" && charB <= "z");
    const isAUpper = charA >= "A" && charA <= "Z";
    const isBUpper = charB >= "A" && charB <= "Z";

    if (isASpecial && !isBSpecial) return -1;
    if (!isASpecial && isBSpecial) return 1;
    if (isAUpper && !isBUpper) return -1;
    if (!isAUpper && isBUpper) return 1;

    return codeA - codeB;
  });

const optionsCreate = ({ data, label, value }: any, type?: string) => {
  const localeMaster: any[] = [];
  const result: any[] = [];
  data?.forEach((item: any) => {
    if (type === "locale" && !item?.fallback_locale) {
      localeMaster?.push({
        label: item?.[label],
        value: item?.[value],
        data: item,
      });
    } else {
      result?.push({
        label: item?.[label],
        value: item?.[value],
        data: item,
      });
    }
  });

  return type === "locale" ? [...localeMaster, ...customSort(result)] : result;
};

const escapeRegExp = (text: string) =>
  text?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createSafeRegex = (input: string, flags: string) => {
  let errorStr = "";
  if (typeof input !== "string")
    errorStr = localeTexts.Warnings.regexWarn.inputNotStr;
  if (!input?.length) errorStr = localeTexts.Warnings.regexWarn.notLength;
  if (input?.length > 10000) errorStr = localeTexts.Warnings.regexWarn.largeStr;

  if (errorStr) {
    console.error(errorStr);
    toastMessage({
      type: "error",
      text: errorStr,
    });
    return null;
  }

  const allowedFlags = ["g", "i"];
  const safeFlags = flags
    ?.split("")
    ?.filter((f) => allowedFlags?.includes(f))
    ?.join("");

  try {
    const safeInput = escapeRegExp(input);
    if (!safeInput || safeInput?.length === 0) {
      console.error("Error: escaped regex input is empty");
      return null;
    }

    const isSafe = checkSync(safeInput, safeFlags);
    if (isSafe?.status !== "safe") {
      console.error(localeTexts.Message.unsafe_regex);
      toastMessage({
        type: "error",
        text: localeTexts.Message.unsafe_regex,
      });
      return null;
    }

    const regex = new RegExp(safeInput, safeFlags);
    return regex;
  } catch (error) {
    console.error("Error: Failed to create regex", error);
    toastMessage({
      type: "error",
      text: localeTexts.Warnings.regexWarn.invalidRegex,
    });
    return null;
  }
};

const searchEmptyHeading = () => (
  <EmptyState
    type={localeTexts.Entry.emptySearchState.type}
    heading={localeTexts.Entry.emptySearchState.heading}
    moduleIcon={localeTexts.Entry.emptySearchState.moduleIcon}
    description={localeTexts.Entry.emptySearchState.description}
  />
);

const handleBatches = async ({
  skip,
  limit,
  tableType,
  batchSize = 250,
  batchApiCall,
  params,
}: any) => {
  const firstBatchLimit = Math.min(batchSize, limit);
  const firstResult = await batchApiCall({
    skip,
    limit: firstBatchLimit,
    ...params,
  });

  const totalCount = firstResult?.count ?? 0;
  const availableItems = Math.max(0, totalCount - skip);
  const actualLimit = Math.min(limit, availableItems);

  if (actualLimit <= batchSize || actualLimit <= firstBatchLimit)
    return {
      [tableType]: firstResult?.[tableType]?.slice(0, actualLimit) || [],
      count: totalCount,
    };

  const remainingLimit = actualLimit - firstBatchLimit;
  const batches = [{ skip, limit: firstBatchLimit }];
  let currentSkip = skip + firstBatchLimit;
  let remaining = remainingLimit;

  while (remaining > 0) {
    const currentLimit = Math.min(batchSize, remaining);
    batches.push({ skip: currentSkip, limit: currentLimit });
    currentSkip += currentLimit;
    remaining -= currentLimit;
  }

  const apiPromises = batches?.slice(1).map(
    (batch, index) =>
      new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const result = await batchApiCall({ ...params, ...batch });
            resolve({ result, index: index + 1 });
          } catch (error) {
            resolve({ error, index: index + 1 });
          }
        }, (index + 1) * 1000);
      })
  );

  const allResponses = [
    { result: firstResult, index: 0 },
    ...(await Promise.all(apiPromises)),
  ];

  const sortedResults: any[] = allResponses?.sort(
    (a: any, b: any) => a?.index - b?.index
  );

  const results: any[] = [];
  let errorCount = 0;

  sortedResults?.forEach((batch) => {
    if (batch?.error) {
      errorCount += 1;
      console.error(`Batch ${batch?.index} failed:`, batch?.error);
    } else {
      results.push(...(batch?.result?.[tableType] ?? []));
    }
  });

  if (errorCount) {
    toastMessage({
      type: "error",
      text: localeTexts.GetBatchFailure,
    });
  }

  return { [tableType]: results, count: totalCount };
};

const utils = {
  toastMessage,
  mapForSelectOption,
  getPublishStatusEnv,
  createLoadedObject,
  sortLocales,
  getRegionUrl,
  getMenu,
  optionsCreate,
  createSafeRegex,
  customSort,
  tooltipWrapper,
  wrapWithDiv,
  searchEmptyHeading,
  handleBatches,
};

export default utils;
