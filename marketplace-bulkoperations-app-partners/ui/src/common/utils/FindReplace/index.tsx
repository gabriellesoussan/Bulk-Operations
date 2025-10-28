/* -------FIND AND REPLACE UTILS------- */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
import React from "react";
import { Icon } from "@contentstack/venus-components";
import { set, get, has } from "lodash";
import FindReplaceServices from "services/FindReplace";
import constants from "common/constants";
import utils from "../index";
import localeTexts from "../../locale/en-us";

const ASSET_CHECKER = ".content_type";

const flatten = (data: any) => {
  const result: any = {};
  function recurse(cur: any, prop: string) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      let l;
      // eslint-disable-next-line
      for (let i = 0, l = cur?.length; i < l; i++)
        recurse(cur?.[i], `${prop}[${i}]`);
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      // eslint-disable-next-line
      for (const p in cur) {
        isEmpty = false;
        recurse(cur?.[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
};

const assetUidReplace = ({ entry }: any) => {
  const result: any = [];
  const flat = flatten(entry);
  Object.entries(flat).forEach(([key, value]: any) => {
    if (
      key.includes(ASSET_CHECKER) &&
      has(entry, key) &&
      get(entry, key) === value
    ) {
      const path = key?.replace(ASSET_CHECKER, "");
      if (path) {
        const assetsObject = get(entry, path);
        if (assetsObject?.url && assetsObject?.filename) {
          result?.push({ assetInfo: assetsObject, path });
        }
      }
    }
  });
  if (result?.length) {
    result?.forEach((item: any) => {
      set(entry, item?.path, item?.assetInfo?.uid);
    });
  }
};

const filedCreator = ({ schema, data = { path: "" } }: any) => {
  let result: any = [];
  for (let schemaPos = 0; schemaPos < schema?.length; schemaPos += 1) {
    const field = schema[schemaPos];
    if (field?.data_type === "blocks") {
      for (
        let modulerPos = 0;
        modulerPos < field?.blocks?.length;
        modulerPos += 1
      ) {
        if (
          field?.blocks?.[modulerPos] &&
          field?.blocks?.[modulerPos]?.schema &&
          field?.blocks?.[modulerPos]?.schema?.length > 0
        ) {
          const newData = {
            path:
              data?.path !== ""
                ? `${data?.path}.${field?.uid}.${field?.blocks?.[modulerPos]?.uid}`
                : `${field?.uid}.${field?.blocks?.[modulerPos]?.uid}`,
            data: field?.blocks?.[modulerPos],
          };
          result?.push(
            ...filedCreator({
              schema: field?.blocks?.[modulerPos]?.schema,
              data: newData,
            })
          );
        } else {
          const newData = {
            path:
              data?.path !== ""
                ? `${data?.path}.${field?.uid}.${field?.blocks?.[modulerPos]?.uid}`
                : `${field?.uid}.${field?.blocks?.[modulerPos]?.uid}`,
            data: field?.blocks?.[modulerPos],
          };
          result?.push(newData);
        }
      }
    }
    const newData: any = {
      path: data?.path !== "" ? `${data?.path}.${field?.uid}` : `${field?.uid}`,
      data: field,
    };
    result?.push(newData);

    if (field?.schema && field?.schema?.length > 0) {
      result?.push(
        ...filedCreator({
          schema: field?.schema,
          data: newData,
        })
      );
    }
  }
  if (result?.length) {
    // eslint-disable-next-line
    result = result?.filter((item: any, pos: any, self: any) => {
      if (
        constants.findreplaceDataTypes.allowed?.includes(item?.data?.data_type)
      ) {
        return self?.findIndex((v: any) => v?.path === item?.path) === pos;
      }
    });
  }
  return result;
};

const getContentFieldOptions = ({ data }: any) => {
  let fieldData = filedCreator({
    schema: data?.schema,
  });
  const linkArr: any[] = [];
  const removeIndexArr: number[] = [];
  fieldData?.forEach((i: any, p: any) => {
    if (i?.data?.data_type === "link") {
      linkArr?.push(
        { path: `${i?.path}.title`, data: i?.data },
        { path: `${i?.path}.href`, data: i?.data }
      );
      removeIndexArr?.push(p);
    }
    if (
      i?.data?.data_type === "isodate" &&
      !(i?.data?.field_metadata?.hide_time ?? false)
    ) {
      removeIndexArr?.push(p);
    }
    if (i?.data?.display_type === "dropdown") {
      removeIndexArr?.push(p);
    }
  });
  const indexSet = new Set(removeIndexArr);
  fieldData = fieldData?.filter((value: any, i: number) => !indexSet?.has(i));
  fieldData = [...fieldData, ...linkArr];

  const result: any = [];
  if (fieldData?.length) {
    fieldData?.forEach((field: any) => {
      if (!field?.data?.field_metadata?.extension) {
        result?.push({
          label: field?.path,
          value: field?.path,
          data: field?.data,
          type: field?.data?.data_type,
        });
      }
    });
  }
  return result;
};

const escapeSpecialChars = (str: string) =>
  // eslint-disable-next-line
  str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

const queryGenrator = ({ inputValue, fieldValue, contentTypeValue }: any) => {
  let returnQuery;
  switch (fieldValue?.type) {
    case "number":
      returnQuery = inputValue;
      break;
    case "isodate":
      returnQuery = inputValue;
      break;
    case "boolean":
      returnQuery = inputValue?.value;
      break;
    case "reference":
      returnQuery = {
        [fieldValue?.value]: {
          $in_query: {
            _content_type_uid: `${inputValue?.contentType}`,
            uid: `${inputValue?.value}`,
          },
        },
        _content_type_uid: `${contentTypeValue?.value}`,
      };
      break;
    default:
      returnQuery = { $regex: `${escapeSpecialChars(inputValue)}` };
  }
  return returnQuery;
};

const getJsonSearchResult = ({
  stack,
  contentTypeValue,
  localeValue,
  findInputValue,
}: any) =>
  FindReplaceServices.getJsonEntries({
    stack,
    contentTypeValue,
    localeValue,
    findQuery: findInputValue,
  });

const getTableEntries = async ({
  contentFieldValue,
  stack,
  contentTypeValue,
  localeValue,
  findInputValue,
  skip,
  limit,
  sortBy,
  jsonSearchData,
  searchText,
}: any) => {
  if (contentFieldValue?.type === "json") {
    let jsonEntryUid: string[] = [];
    jsonSearchData?.forEach((item: any) => {
      const jsonField = item?.fields?.filter(
        (i: any) =>
          i?.uid?.includes(contentFieldValue?.value) &&
          `${i?.value}`?.includes(findInputValue)
      );

      let jsonFieldValue: any = "";
      if (Array?.isArray(jsonField)) {
        jsonFieldValue = jsonField?.map((i: any) => i?.value);
      } else {
        jsonFieldValue = [jsonField?.value];
      }

      jsonFieldValue?.forEach((jsonValue: string) => {
        if (jsonValue?.includes(findInputValue)) {
          jsonEntryUid?.push(item?.uid);
        }
      });
    });
    jsonEntryUid = [...new Set(jsonEntryUid)];
    return FindReplaceServices?.getEntriesWithUids({
      stack,
      contentTypeValue,
      localeValue,
      jsonEntryUid,
      skip,
      limit,
      searchText,
    });
    // eslint-disable-next-line
  } else {
    const findQuery = queryGenrator({
      inputValue: findInputValue,
      fieldValue: contentFieldValue,
      contentTypeValue,
    });
    return FindReplaceServices.getEntries({
      fieldValue: contentFieldValue,
      findQuery,
      stack,
      contentTypeValue,
      localeValue,
      sortBy,
      skip,
      limit,
      searchText,
    });
  }
};

const keyFilter = (string: string, isRef = false) => {
  let key = string;
  if (isRef) {
    key = string?.replaceAll(`.uid`, "");
  }
  if (key?.includes("[") && key?.includes("]")) {
    if (/\[\d+\]/.test(key)) {
      key = key?.replace(/\[\d+\]/g, "") ?? key;
    }
  }
  return key;
};

const getDataforFieldTypes = ({
  fieldValue,
  value,
  inputValue,
  item,
  key,
  filteredKey,
}: any) => {
  const result: any[] = [];
  switch (fieldValue?.type) {
    case "boolean":
      if (value === inputValue?.value) {
        result?.push({
          id: `${item?.uid}-${key}`,
          uid: item?.uid,
          title:
            item?.title === ""
              ? localeTexts.FindReplace.Table.untitled
              : item?.title,
          fieldName: key,
          value: inputValue?.label,
          version: item?._version,
          entry: item,
        });
      }
      break;
    case "number":
      if (value === parseInt(inputValue, 10)) {
        result?.push({
          id: `${item?.uid}-${key}`,
          uid: item?.uid,
          title:
            item?.title === ""
              ? localeTexts.FindReplace.Table.untitled
              : item?.title,
          fieldName: key,
          value,
          version: item?._version,
          entry: item,
        });
      }
      break;
    case "reference":
      if (value === inputValue?.value) {
        result?.push({
          id: `${item?.uid}-${key}`,
          uid: item?.uid,
          title:
            item?.title === ""
              ? localeTexts.FindReplace.Table.untitled
              : item?.title,
          fieldName: key,
          refUid: value,
          value: inputValue?.label,
          version: item?._version,
          entry: item,
        });
      }
      break;
    case "isodate":
      if (inputValue && value === inputValue) {
        result?.push({
          id: `${item?.uid}-${key}`,
          uid: item?.uid,
          title:
            item?.title === ""
              ? localeTexts.FindReplace.Table.untitled
              : item?.title,
          fieldName: key,
          value: `${get(item, key)}`,
          version: item?._version,
          entry: item,
        });
      }
      break;
    default:
      if (typeof inputValue === "object") {
        result?.push({
          id: `${item?.uid}-${key}`,
          uid: item?.uid,
          title:
            item?.title === ""
              ? localeTexts.FindReplace.Table.untitled
              : item?.title,
          fieldName: filteredKey,
          value: `${get(item, filteredKey)}`,
          version: item?._version,
          entry: item,
        });
      } else if (typeof value === "string" && value?.includes(inputValue)) {
        result?.push({
          id: `${item?.uid}-${key}`,
          uid: item?.uid,
          title:
            item?.title === ""
              ? localeTexts.FindReplace.Table.untitled
              : item?.title,
          fieldName: key,
          value: fieldValue?.data?.field_metadata?.allow_rich_text
            ? value?.replace(/(<([^>]+)>)/gi, "")
            : value,
          version: item?._version,
          entry: item,
        });
      }
  }
  return result;
};

const generateTableData = ({ entry, fieldValue, inputValue }: any) => {
  let result: any = [];
  entry?.entries?.forEach((item: any) => {
    const flat = flatten(item);
    if (fieldValue?.type === "json") {
      const regex = /^children\[\d+\]$/;
      Object.entries(flat)?.forEach(([key, value]: any) => {
        if (key?.endsWith(".text") && value?.includes(inputValue)) {
          const keyMakerArr: string[] = [];
          const keySplitArr = key?.split(".");
          keySplitArr?.forEach((k: string, index: number) => {
            const isLastElement = index === keySplitArr?.length - 1;
            if (!(regex.test(k) || (isLastElement && k === "text"))) {
              keyMakerArr?.push(k?.split("[")?.[0]);
            }
          });
          if (keyMakerArr?.join(".") === fieldValue?.value) {
            const keySplit = key?.split(".");
            const index = keySplit?.findIndex((kvalue: string) =>
              kvalue?.includes("children")
            );
            const finalKey = keySplit?.slice(0, index + 1)?.join(".");
            const pushObj = {
              id: `${item?.uid}-${finalKey}`,
              uid: item?.uid,
              title:
                item?.title === ""
                  ? localeTexts.FindReplace.Table.untitled
                  : item?.title,
              fieldName: finalKey,
              value,
              version: item?._version,
              entry: item,
            };
            result?.push(pushObj);
          }
        }
      });
      const value = new Map(result?.map((i: any) => [i?.id, i]))?.values();
      result = value ? [...value] : [];
    } else {
      Object.entries(flat)?.forEach(([key, value]: any) => {
        const filteredKey = keyFilter(key, fieldValue?.type === "reference");
        if (filteredKey === fieldValue?.value) {
          const resData = getDataforFieldTypes({
            fieldValue,
            value,
            inputValue,
            item,
            key,
            filteredKey,
          });
          result = [...result, ...resData];
        }
      });
    }
  });
  return result;
};

const modifyEntryFields = ({
  entry,
  fieldPath,
  replaceValue,
  contentFieldValue,
  findInputValue,
}: any) => {
  fieldPath?.forEach((field: string) => {
    let stringData = get(entry, field);
    let newReplace = replaceValue;
    let safeRegex;
    switch (contentFieldValue?.type) {
      case "number":
        newReplace = parseInt(newReplace, 10);
        set(entry, field, newReplace);
        break;
      case "boolean":
        newReplace = newReplace?.value;
        set(entry, field, newReplace);
        break;
      case "isodate":
        safeRegex = utils.createSafeRegex(findInputValue, "g");
        if (safeRegex) {
          const newInput: any = stringData?.match(safeRegex);
          if (newInput?.length) {
            stringData = stringData?.replaceAll(newInput?.[0], newReplace);
            set(entry, field, stringData);
          }
        }
        break;
      case "reference": {
        const obj = {
          uid: replaceValue?.value,
          _content_type_uid: replaceValue?.contentType,
        };
        set(entry, field?.replaceAll(".uid", ""), obj);
        break;
      }
      case "json":
        const flat = flatten(stringData);
        Object.entries(flat)?.forEach(([key, value]: any) => {
          safeRegex = utils.createSafeRegex(findInputValue, "g");
          if (
            key?.endsWith(".text") &&
            value?.includes(findInputValue) &&
            safeRegex &&
            value?.match(safeRegex)?.length
          ) {
            const newData = value?.replaceAll(safeRegex, newReplace);
            set(entry, `${field}.${key}`, newData);
          }
        });
        break;
      default:
        if (typeof stringData === "string") {
          safeRegex = utils.createSafeRegex(findInputValue, "g");
          if (safeRegex) {
            const stringInput: any = stringData?.match(safeRegex);
            if (stringInput?.length) {
              stringData = stringData?.replaceAll(safeRegex, newReplace);
              set(entry, field, stringData);
            }
          }
        }
        break;
    }
  });
  return entry;
};

const generateEntriesToUpdate = ({
  selectedTableData,
  replaceValue,
  contentFieldValue,
  findInputValue,
}: any) => {
  const entriesToUpdate: any = [];
  const fieldsOfUpdatingEntries: any = {};
  selectedTableData?.forEach(({ fieldName, uid, entry }: any) => {
    assetUidReplace({ entry });
    entriesToUpdate?.push(entry);
    if (fieldsOfUpdatingEntries?.[uid]) {
      fieldsOfUpdatingEntries[uid]?.push(fieldName);
    } else {
      fieldsOfUpdatingEntries[uid] = [fieldName];
    }
  });
  const values = new Map(
    entriesToUpdate?.map((item: any) => [item?.uid, item])
  )?.values();
  const uniqueUpdatingEntries = values ? [...values] : [];
  return uniqueUpdatingEntries?.map((entry: any) =>
    modifyEntryFields({
      entry,
      fieldPath: fieldsOfUpdatingEntries?.[entry?.uid],
      replaceValue,
      contentFieldValue,
      findInputValue,
    })
  );
};

const generateReplaceTableData = ({
  entryData,
  resData,
  replaceValue,
  findInputValue,
  contentFieldValue,
}: any) => {
  const result = entryData?.map((data: any) => {
    if (
      resData?.status ===
      localeTexts.FindReplace.Message.operation.update.status
    ) {
      if (
        contentFieldValue?.type === "reference" ||
        contentFieldValue?.type === "boolean"
      ) {
        return {
          ...data,
          value: replaceValue?.label,
          // eslint-disable-next-line
          version: data?.version + 1,
          status: resData?.status,
          message: resData?.notice,
        };
        // eslint-disable-next-line
      } else if (contentFieldValue?.type === "number") {
        return {
          ...data,
          value: replaceValue,
          // eslint-disable-next-line
          version: data?.version + 1,
          status: resData?.status,
          message: resData?.notice,
        };
      } else {
        const safeRegex = utils.createSafeRegex(findInputValue, "g");
        if (safeRegex)
          return {
            ...data,
            title:
              contentFieldValue?.value === "title"
                ? data?.value?.replaceAll(safeRegex, replaceValue)
                : data?.title,
            value: data?.value?.replaceAll(safeRegex, replaceValue),
            // eslint-disable-next-line
            version: data?.version + 1,
            status: resData?.status,
            message: resData?.notice,
          };
        return null;
      }
      // eslint-disable-next-line
    } else {
      return {
        ...data,
        status: resData?.status,
        message: resData?.notice,
      };
    }
  });
  return result?.filter((v: any) => v !== null);
};

const generatePublishTableData = ({ entry, response, localeValue }: any) => ({
  ...entry,
  locale: localeValue?.value,
  status: response?.status,
  message: response?.notice,
});

const transformModalData = (data: any, type: string) => {
  let finalData: any[] = [];
  if (type === "locale") {
    finalData = data?.map((item: any) => ({
      name: item?.label,
      code: item?.value,
    }));
  } else {
    finalData = data?.map((item: any) => ({
      label: item?.name,
      value: item?.name,
    }));
  }
  return finalData;
};

const getHoverActions = ({
  operation,
  regionURL,
  selectedContentType,
  locale,
}: any) => {
  const hoverActions = [];
  if (operation === "publish") {
    hoverActions?.push(
      {
        label: (
          <div className="Table_ActionsOp ActionPublish--View">
            <Icon icon="NewTab" />
            <div>{localeTexts.Entry.table.actions.view.entry}</div>
          </div>
        ),
        // eslint-disable-nexxt-line
        action: (e: any, data: any) => {
          window.open(
            `${regionURL}/content-type/${selectedContentType?.value}/${locale?.value}/entry/${data?.uid}/edit?branch=main`,
            "_blank"
          );
        },
      },
      {
        label: (
          <div className="Table_ActionsOp ActionPublish--Queue">
            <Icon icon="PublishQueue" size="medium" />
            <div>{localeTexts.Entry.table.actions.view.publishQueue}</div>
          </div>
        ),
        action: () => {
          window.open(
            `${regionURL}/publish-queue?category=single&status=published`,
            "_blank"
          );
        },
      }
    );
  } else {
    hoverActions?.push({
      label: (
        <div className="Table_hoverActions ActionDefault--View">
          <Icon
            icon="NewTab"
            data={
              <div>
                &ensp;
                {localeTexts.Entry.table.actions.view.entry}
              </div>
            }
          />
        </div>
      ),
      // eslint-disable-nexxt-line
      action: (e: any, data: any) => {
        e?.stopPropagation();
        window.open(
          `${regionURL}/content-type/${selectedContentType?.value}/${locale?.value}/entry/${data?.uid}/edit?branch=main`,
          "_blank"
        );
      },
    });
  }
  return hoverActions;
};

const findReplaceUtils = {
  keyFilter,
  filedCreator,
  ASSET_CHECKER,
  flatten,
  queryGenrator,
  generateTableData,
  getContentFieldOptions,
  getTableEntries,
  generateEntriesToUpdate,
  generateReplaceTableData,
  generatePublishTableData,
  transformModalData,
  getHoverActions,
  getJsonSearchResult,
};

export default findReplaceUtils;
