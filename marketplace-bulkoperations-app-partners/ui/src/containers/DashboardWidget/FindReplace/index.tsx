/* eslint-disable no-param-reassign */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useRef, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import { cbModal } from "@contentstack/venus-components";
import "@contentstack/venus-components/build/main.css";
import utils from "common/utils";
import localeTexts from "common/locale/en-us";
import services from "services";
import FindReplaceServices from "services/FindReplace";
import ReplaceModal from "containers/DashboardWidget/FindReplace/ReplaceModal";
import ResetModal from "components/ResetModal";
import findReplaceUtils from "common/utils/FindReplace";
import constants from "common/constants";
import Skeleton from "components/Skeleton";
import InfinteTable from "./Table";
import { TypeSDKData } from "../../../common/types";
import {
  ButtonContainer,
  DropDownContainer,
  FindValueContainer,
  HeaderContainer,
  ReplaceValueContainer,
} from "./Components";
import "./styles.scss";
import PublishUnpublishModal from "../../../components/PublishUnpublishModal";

declare global {
  interface Window {
    iframeRef: any;
    postRobot: any;
  }
}

const FindReplace: React.FC = function () {
  const ref = useRef(null);
  const tableRef: any = useRef(null);
  // contentstack state
  const [state, setState] = useState<TypeSDKData>({
    location: {},
    appSdkInitialized: false,
  });
  // stack object from appSdk
  const [stack, setStack] = useState<any>();
  // value of contentType select field
  const [contentTypeValue, setContentTypeValue] = useState<any>(null);
  // options for locale select field
  const [localeOptions, setLocaleOptions] = useState<any>([]);
  // value of locale select field
  const [localeValue, setLocaleValue] = useState<any>(null);
  // environments array
  const [enviroment, setEnviroment] = useState<any>([]);
  // options for field select field
  const [contentFieldOptions, setContentFieldOptions] = useState<any>([]);
  // value of entry-field select field
  const [contentFieldValue, setContentFieldValue] = useState<any>(null);
  // input value for "find" operation
  const [findInputValue, setFindInputValue] = useState<any>(null);
  // itemStatusMap for infinite scroll table
  const [itemStatusMap, setItemStatusMap] = useState({});
  // total counts for infinite scroll table
  const [totalCounts, setTotalCounts] = useState(0);
  // loading state for infinite scroll table
  const [loading, setLoading] = useState(false);
  // data of infinite scroll table
  const [tableData, setTableData] = useState<any>([]);
  // selected id's of infinite scroll table
  const [selectedTableRow, setSelectedTableRow] = useState<any>([]);
  // selected id data of infinite scroll table
  const [selectedTableData, setSelectedTableData] = useState<any>([]);
  // search button disable state
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  // input value for "replace" operation
  const [replaceValue, setReplaceValue] = useState<any>(null);
  // check state for replace button
  const [isReplaceDisabled, setIsReplaceDisable] = useState<boolean>(true);
  // check state for replace fields
  const [replaceFieldDisabled, setRelplaceFieldDisabled] =
    useState<boolean>(true);
  // check state publish button disabled
  const [isPublishDisabled, setIsPublishDisabled] = useState<boolean>(true);
  // current operation state [value = 'find' |'replace' | 'publish' ]
  const [operation, setOperation] = useState<string>(
    localeTexts.FindReplace.Operation.search
  );
  // state for reference content type
  const [refContentType, setRefContentType] = useState<any>(null);
  // state for reference replace content type
  const [refReplaceContentType, setRefReplaceContentType] = useState<any>(null);
  // check state for search of infinite scroll table
  const [isSearch, setIsSearch] = useState<boolean>(false);
  // search table data
  const [searchData, setSearchData] = useState<any>([]);
  // selected counts to be displayed on the header
  const [selectedCount, setSelectedCount] = useState<number>(0);
  // error tracking state for select/text fields
  const [errorObj, setErrorObj] = useState<any>({
    contentType_error: false,
    locale_error: false,
    contentField_error: false,
    findValue_error: false,
    replaceValue_error: false,
  });
  // state for search text of table
  const [tableSearchText, setTableSearchText] = useState<string>("");
  // reset state for table search
  const [resetSearch, setResetSearch] = useState<boolean>(false);
  // region url required for redirection
  const [regionURL, setRegionURL] = useState("");
  // table state for showing initial selected rows
  const [initialSelectedIds, setInitialSelectedIds] = useState<any>({});

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSdk) => {
        window.iframeRef = ref?.current;
        window.postRobot = appSdk?.postRobot;
        setRegionURL(
          utils.getRegionUrl(appSdk?.region, appSdk?.stack?._data?.api_key)
        );
        const { stack: appSdkStack } = appSdk;
        appSdk?.location?.DashboardWidget?.frame?.updateHeight(680);
        appSdk?.location?.DashboardWidget?.frame?.disableAutoResizing();

        const locales = await appSdkStack?.getLocales();
        const enviromentData = await appSdkStack?.getEnvironments();
        setLocaleOptions(
          utils.optionsCreate(
            {
              data: locales?.locales,
              label: localeTexts.FindReplace.SelectOptions.locale.label,
              value: localeTexts.FindReplace.SelectOptions.locale.value,
            },
            "locale"
          )
        );
        setStack(appSdkStack);
        setEnviroment(enviromentData?.environments);
        setState({
          location: appSdk?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error) => {
        console.error("Error: AppSdk Initialization", error);
      });
  }, []);

  const resetSearchFn = async () => {
    await setTableSearchText("");
    setIsSearch(false);
    setSearchData([]);
    setResetSearch(true);
    setTimeout(() => {
      setResetSearch(false);
    }, 500);
  };

  const resetTableStates = () => {
    resetSearchFn();
    setTableData([]);
    setTotalCounts(0);
    setItemStatusMap({});
    setSelectedTableRow([]);
    setSelectedTableData([]);
    setOperation(localeTexts.FindReplace.Operation.search);
    setInitialSelectedIds({});
  };

  const resetStateValues = ({ fieldName, isReset, data }: any) => {
    switch (fieldName) {
      case localeTexts.FindReplace.FieldName.contentType:
        resetTableStates();
        if (isReset) {
          setContentTypeValue(null);
          setContentFieldOptions([]);
          setLocaleValue(null);
          setFindInputValue(null);
        } else if (typeof findInputValue !== "string") {
          setFindInputValue(null);
        }
        setContentFieldValue(null);
        setRefContentType(null);
        setReplaceValue(null);
        setRefReplaceContentType(null);
        setIsSearchDisabled(false);
        setIsReplaceDisable(true);
        setIsPublishDisabled(true);
        setRelplaceFieldDisabled(true);
        setErrorObj({
          contentType_error: false,
          locale_error: false,
          contentField_error: false,
          findValue_error: false,
          replaceValue_error: false,
        });
        break;
      case localeTexts.FindReplace.FieldName.locale:
        setIsReplaceDisable(true);
        setRelplaceFieldDisabled(true);
        setReplaceValue(null);
        setRelplaceFieldDisabled(true);
        setIsSearchDisabled(false);
        setIsPublishDisabled(true);
        resetTableStates();
        setErrorObj({
          ...errorObj,
          replaceValue_error: false,
        });
        break;
      case localeTexts.FindReplace.FieldName.contentField:
        if (
          typeof findInputValue !== "string" ||
          data?.type === "reference" ||
          data?.type === "boolean" ||
          data?.type === "isodate"
        ) {
          setFindInputValue(null);
        }
        setReplaceValue(null);
        setRelplaceFieldDisabled(true);
        setIsSearchDisabled(false);
        setIsReplaceDisable(true);
        setIsPublishDisabled(true);
        resetTableStates();
        setErrorObj({
          ...errorObj,
          replaceValue_error: false,
        });
        break;
      case localeTexts.FindReplace.FieldName.replaceField:
        setFindInputValue(null);
        setReplaceValue(null);
        setRelplaceFieldDisabled(true);
        setRefReplaceContentType(null);
        setIsSearchDisabled(false);
        setIsReplaceDisable(true);
        setIsPublishDisabled(true);
        resetTableStates();
        setErrorObj({
          ...errorObj,
          replaceValue_error: false,
        });
        break;
      default:
    }
  };

  const handleOptionsUpdate = (data: any, updateField: string) => {
    let setValueFunc: any;
    let prevValue: any;
    let errorField: any;
    switch (updateField) {
      case localeTexts.FindReplace.FieldName.contentType:
        if (data !== null && data?.value !== contentTypeValue?.value) {
          setContentFieldOptions(findReplaceUtils.getContentFieldOptions(data));
        }
        prevValue = contentTypeValue;
        setValueFunc = setContentTypeValue;
        errorField = "contentType_error";
        break;
      case localeTexts.FindReplace.FieldName.locale:
        prevValue = localeValue;
        setValueFunc = setLocaleValue;
        errorField = "locale_error";
        break;
      case localeTexts.FindReplace.FieldName.contentField:
        prevValue = contentFieldValue;
        setValueFunc = setContentFieldValue;
        if (
          data?.type === "reference" &&
          data?.data?.reference_to?.length === 1
        ) {
          setRefContentType({
            label: data?.data?.reference_to?.[0],
            value: data?.data?.reference_to?.[0],
          });
        } else {
          setRefContentType(null);
          setRefReplaceContentType(null);
        }
        errorField = "contentField_error";
        break;
      default:
    }
    if (errorObj?.[errorField]) errorObj[errorField] = false;
    if (data === null || prevValue !== data) {
      resetStateValues({ fieldName: updateField, data });
      setValueFunc(data);
    }
  };

  const handleInputValue = (
    data: any,
    type?: string,
    componentType?: string
  ) => {
    setInitialSelectedIds({});
    if (componentType !== "replace") {
      resetTableStates();
      setErrorObj({
        contentType_error: false,
        locale_error: false,
        contentField_error: false,
        findValue_error: false,
        replaceValue_error: false,
      });
      setReplaceValue(null);
      setIsSearchDisabled(false);
      setIsReplaceDisable(true);
      setRelplaceFieldDisabled(true);
      setIsPublishDisabled(true);
      setRefReplaceContentType(null);
    }
    let UpdateFn = setFindInputValue;
    if (componentType === "replace") {
      UpdateFn = setReplaceValue;
      if (errorObj?.replaceValue_error)
        setErrorObj({
          ...errorObj,
          replaceValue_error: false,
        });
    }
    let dataValue = data;
    if (type === "textValueUpdate") {
      dataValue = data?.target?.value;
    }
    UpdateFn(dataValue);
  };

  const getFindTableData = async (
    { sortBy, skip, limit, searchText }: any,
    jsonSearchData: any[] = []
  ) => {
    const tableEntries: any = await findReplaceUtils?.getTableEntries({
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
    });
    let tableRows: any = [];
    if (tableEntries?.entries?.length) {
      const result = findReplaceUtils.generateTableData({
        entry: tableEntries,
        fieldValue: contentFieldValue,
        inputValue: findInputValue,
      });
      tableRows = result;
    }
    return {
      tableEntries,
      tableRows,
    };
  };

  const emptySearch = () => {
    setSearchData([]);
    setTotalCounts(0);
    setItemStatusMap({});
  };

  const handleTableSearch = (searchText: string) => {
    const regex = utils.createSafeRegex(searchText, "gi");
    if (regex) {
      const searchDataArr = tableData?.filter((data: any) =>
        data?.title?.match(regex)
      );
      if (searchDataArr?.length) {
        const itemStatus = utils.createLoadedObject(searchDataArr?.length);
        setSearchData(searchDataArr);
        setTotalCounts(searchDataArr?.length);
        setItemStatusMap(itemStatus);
      } else emptySearch();
    } else emptySearch();
  };

  const setTableAndRefValues = () => {
    if (
      contentFieldValue?.type === "reference" &&
      contentFieldValue?.data?.reference_to?.length === 1
    ) {
      setRefReplaceContentType({
        label: contentFieldValue?.data?.reference_to?.[0],
        value: contentFieldValue?.data?.reference_to?.[0],
      });
    } else {
      setRefReplaceContentType(null);
    }
  };

  const handleFieldChecks = () => {
    const missingValues = [];
    const modifiedErrObj: any = {};

    if (!contentTypeValue?.value) {
      missingValues?.push(
        localeTexts.FindReplace.SelectFields.contentType.label
      );
      modifiedErrObj.contentType_error = true;
    } else modifiedErrObj.contentType_error = false;

    if (!localeValue?.value) {
      missingValues?.push(localeTexts.FindReplace.SelectFields.locale.label);
      modifiedErrObj.locale_error = true;
    } else modifiedErrObj.locale_error = false;

    if (!contentFieldValue?.value) {
      missingValues?.push(localeTexts.FindReplace.SelectFields.field.label);
      modifiedErrObj.contentField_error = true;
    } else modifiedErrObj.contentField_error = false;

    if (
      !findInputValue ||
      !(findInputValue?.length || `${findInputValue?.value}`?.length)
    ) {
      missingValues?.push(localeTexts.FindReplace.InputBuilder.findLabel);
      modifiedErrObj.findValue_error = true;
    } else modifiedErrObj.findValue_error = false;

    setErrorObj({
      ...errorObj,
      ...modifiedErrObj,
    });

    return missingValues;
  };

  const handleFindOperation = async (
    { sortBy = {}, searchText = "", skip, limit }: any,
    searchClick?: boolean
  ) => {
    try {
      if (searchClick) {
        skip = constants.findTableConstants.tableInitState.skip;
        limit = constants.findTableConstants.tableInitState.limit;
        if (tableRef?.current) {
          tableRef.current.setTablePageSize(limit);
          tableRef.current.setTablePage(1);
        }
        const missingVales = handleFieldChecks();
        if (missingVales?.length) {
          utils.toastMessage({
            type: localeTexts.FindReplace.ToastMsg.Error.type,
            text: `${
              localeTexts.FindReplace.ToastMsg.Error.error_start
            } ${missingVales?.join(", ")} ${
              localeTexts.FindReplace.ToastMsg.Error.error_end
            }`,
          });
          return;
        }
      }
      setTableAndRefValues();

      if (operation !== "find") {
        setLoading(true);
        if (searchText) {
          setIsSearch(true);
          setTableSearchText(searchText);
          handleTableSearch(searchText);
        } else {
          resetSearchFn();
          setTotalCounts(tableData?.length);
          setItemStatusMap(utils.createLoadedObject(tableData?.length));
          setIsSearch(false);
        }
        setLoading(false);
      }

      if (
        contentTypeValue?.value &&
        localeValue?.value &&
        contentFieldValue?.value &&
        findInputValue &&
        operation === "find"
      ) {
        if (searchText) setTableSearchText(searchText);
        else resetSearchFn();
        setLoading(true);
        let jsonSearchResult = [];
        if (contentFieldValue?.type === "json") {
          jsonSearchResult = await findReplaceUtils.getJsonSearchResult({
            stack,
            contentTypeValue,
            localeValue,
            findInputValue,
          });
        }
        const { tableEntries, tableRows } = await getFindTableData(
          {
            sortBy,
            skip,
            limit,
            searchText,
          },
          jsonSearchResult?.items
        );
        const itemStatus: any = utils.createLoadedObject(tableRows?.length);

        if (!tableRows?.length) {
          setTotalCounts(0);
          utils.toastMessage({
            type: localeTexts.FindReplace.ToastMsg.Default.type,
            text: localeTexts.FindReplace.ToastMsg.Default.no_search_msg,
          });
        } else {
          setItemStatusMap(itemStatus);
          let count = tableEntries?.count;
          if (count < tableRows?.length) count = tableRows?.length;
          setTotalCounts(count);
          setTableData(tableRows);
          setIsSearchDisabled(true);
          setRelplaceFieldDisabled(false);
          setIsReplaceDisable(false);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error: Find Operation FetchData", error);
    }
  };

  const getReplaceTableData = async (entriesToUpdate: any) => {
    const replaceTableData = await Promise.all(
      entriesToUpdate?.map(async (entry: any) => {
        const response = await FindReplaceServices.updateEntryData({
          stack,
          contentTypeValue,
          entry,
          localeValue,
        });
        const selectedEntryData = selectedTableData?.filter(
          (item: any) => item?.uid === entry?.uid
        );
        const result = findReplaceUtils.generateReplaceTableData({
          entryData: selectedEntryData,
          resData: response,
          findInputValue,
          replaceValue,
          contentFieldValue,
        });
        return result;
      })
    );
    return replaceTableData?.flat();
  };

  const handleReplaceOperation = async ({ closeModal }: any) => {
    try {
      if (selectedTableRow?.length) {
        resetSearchFn();
        setInitialSelectedIds({});
        setOperation(localeTexts.FindReplace.Operation.replace);
        setLoading(true);
        closeModal();
        const modifiedEntriesToUpdate =
          findReplaceUtils.generateEntriesToUpdate({
            selectedTableData,
            replaceValue,
            contentFieldValue,
            findInputValue,
          });
        const replaceTableData = await getReplaceTableData(
          modifiedEntriesToUpdate
        );
        let itemStatus: any = {};
        if (replaceTableData?.length) {
          itemStatus = utils.createLoadedObject(replaceTableData?.length);
        }
        setTotalCounts(replaceTableData?.length);
        setItemStatusMap(itemStatus);
        setTableData(replaceTableData);
        setLoading(false);
        setIsSearchDisabled(true);
        setIsReplaceDisable(true);
        setIsPublishDisabled(false);
      }
    } catch (error: any) {
      closeModal();
      utils.toastMessage(localeTexts.FindReplace.Message.replaceFailure);
      console.error("Error: Replace Operation", error);
    }
  };

  const getPublishTableData = async (
    publishEntries: any,
    publishEnv: any,
    time: string
  ) => {
    const publishTableData = await Promise.all(
      publishEntries?.map(async (entry: any) => {
        const response = await services.makeApiCall(
          services.publishEntries,
          {
            stack,
            contentTypeValue: contentTypeValue?.value,
            environments: publishEnv,
            entryUid: entry?.uid,
            locales: [localeValue?.value],
            time,
          },
          "publish"
        );

        const publishDataObj = findReplaceUtils.generatePublishTableData({
          entry,
          response,
          localeValue,
        });
        return publishDataObj;
      })
    );
    return publishTableData;
  };

  const handlePublish = async ({
    environments: publishEnv,
    time,
    closeModal,
  }: any) => {
    try {
      setIsSearch(false);
      if (selectedTableData?.length && publishEnv?.length) {
        setTableSearchText("");
        setLoading(true);
        setOperation(localeTexts.FindReplace.Operation.publish);
        closeModal();
        const entries = [
          // eslint-disable-next-line
          ...(new Map(
            selectedTableData?.map((entry: any) => [entry?.uid, entry])
          )?.values() ?? []),
        ];
        const publishTableData = await getPublishTableData(
          entries,
          publishEnv,
          time
        );
        let itemStatus: any = {};
        if (publishTableData?.length) {
          itemStatus = utils.createLoadedObject(publishTableData?.length);
        }
        setLoading(false);
        setTotalCounts(publishTableData?.length);
        setItemStatusMap(itemStatus);
        setTableData(publishTableData);
        setIsPublishDisabled(true);
      }
    } catch (error: any) {
      closeModal();
      console.error("Error: Publish Operation", error);
    }
  };

  const modalSelect = (props: any, type: string) => {
    let Modal: any;
    switch (type) {
      case localeTexts.FindReplace.ModalType.replace:
        Modal = (
          <ReplaceModal
            {...props}
            handleReplaceClick={handleReplaceOperation}
            loading={loading}
            selectedUids={selectedTableRow}
            findValue={findInputValue}
            replaceValue={replaceValue}
            contentField={contentFieldValue}
          />
        );
        break;
      case localeTexts.FindReplace.ModalType.publish:
        Modal = (
          <PublishUnpublishModal
            action="publish"
            incomingLocales={findReplaceUtils.transformModalData(
              [localeValue],
              "locale"
            )}
            incomingEnvironments={findReplaceUtils.transformModalData(
              enviroment,
              "enviroment"
            )}
            // eslint-disable-next-line
            closeModal={props?.closeModal}
            handleActions={handlePublish}
            defaultLocale={localeValue?.value}
            componentType="FindReplace"
          />
        );
        break;
      case localeTexts.FindReplace.ModalType.reset:
        Modal = (
          <ResetModal
            {...props}
            resetValues={() =>
              resetStateValues({
                fieldName: localeTexts.FindReplace.FieldName.contentType,
                isReset: true,
              })
            }
          />
        );
        break;
      default:
    }
    return Modal;
  };

  const handleModal = (type: string) => {
    let checkState = true;
    // eslint-disable-next-line
    let size = localeTexts.FindReplace.Modal.reset.size;
    if (type === localeTexts.FindReplace.ModalType.replace) {
      size = localeTexts.FindReplace.Modal.replace.size;
      const missingVales = [];
      if (
        !replaceValue ||
        !(
          replaceValue !== null &&
          (replaceValue?.length || Object.keys(replaceValue)?.length)
        )
      ) {
        setErrorObj({
          ...errorObj,
          replaceValue_error: true,
        });
        missingVales.push(localeTexts.FindReplace.InputBuilder.replaceLabel);
      }
      if (selectedCount === 0)
        missingVales.push(localeTexts.FindReplace.Table.selectedEntryLabel);
      if (missingVales?.length) {
        checkState = false;
        utils.toastMessage({
          type: localeTexts.FindReplace.ToastMsg.Error.type,
          text: `${
            localeTexts.FindReplace.ToastMsg.Error.error_start
          } ${missingVales?.join(", ")} ${
            localeTexts.FindReplace.ToastMsg.Error.error_end
          }`,
        });
      } else {
        const fvalue =
          typeof findInputValue === "string"
            ? findInputValue
            : findInputValue?.value;
        const rvalue =
          typeof replaceValue === "string" ? replaceValue : replaceValue?.value;

        if (fvalue === rvalue) {
          checkState = false;
          setErrorObj({
            ...errorObj,
            replaceValue_error: true,
          });
          utils.toastMessage({
            type: localeTexts.FindReplace.ToastMsg.Error.type,
            text: `${localeTexts.FindReplace.ToastMsg.Error.sameValue}`,
          });
        }
      }
    } else if (type === localeTexts.FindReplace.ModalType.publish) {
      if (selectedCount === 0) {
        checkState = false;
        utils.toastMessage({
          type: localeTexts.FindReplace.ToastMsg.Error.type,
          text: `${localeTexts.FindReplace.ToastMsg.Error.error_start} ${localeTexts.FindReplace.Table.selectedEntryLabel} ${localeTexts.FindReplace.ToastMsg.Error.error_end}`,
        });
      } else if (!enviroment?.length) {
        checkState = false;
        utils.toastMessage({
          type: localeTexts.FindReplace.ToastMsg.Error.type,
          text: localeTexts.FindReplace.ToastMsg.Error.noEnv,
        });
      }
    }
    if (checkState) {
      cbModal({
        component: (props: any) => modalSelect(props, type),
        modalProps: {
          size:
            type === localeTexts.FindReplace.ModalType.publish
              ? localeTexts.FindReplace.Modal.publish.size
              : size,
        },
      });
    }
  };

  const handleSelectedTableRow = (ids: string[], data: any[]) => {
    const selectedRow: any = {};
    const idArr: string[] = [];
    const dataArr: any[] = [];
    data?.forEach((item: any) => {
      if (
        item?.status !==
        localeTexts.FindReplace.Message.operation.unsuccess.status
      ) {
        dataArr?.push(item);
        idArr?.push(item?.id);
        selectedRow[item.id] = true;
      }
    });
    setSelectedTableRow(idArr);
    setSelectedTableData(dataArr);
    setSelectedCount(idArr?.length);
    setInitialSelectedIds(selectedRow);
  };

  const getContentTypeOptions = async ({
    search,
    skip: optionSkip,
    limit: optionLimit,
  }: {
    search: string;
    skip: number;
    limit: number;
  }) => {
    const contentTypes = await stack?.getContentTypes("", {
      include_count: true,
      include_global_field_schema: true,
      skip: optionSkip,
      limit: optionLimit,
      asc: "title",
      typeahead: search,
    });

    const options = utils.optionsCreate({
      data: contentTypes?.content_types,
      label: localeTexts.FindReplace.SelectOptions.contentType.label,
      value: localeTexts.FindReplace.SelectOptions.contentType.value,
    });

    return {
      options,
      hasMore: contentTypes.count > optionSkip + optionLimit,
    };
  };

  return (
    <div className="main-Conatiner">
      {state.appSdkInitialized ? (
        <div className="intial-Conatiner">
          <div className="header-container">
            <HeaderContainer
              selectedCount={selectedCount}
              operation={operation}
            />
          </div>
          <div className="action-container ">
            <div className="select-conatiner">
              <DropDownContainer
                contentTypeValue={contentTypeValue}
                getContentTypeOptions={getContentTypeOptions}
                localeValue={localeValue}
                localeOptions={localeOptions}
                contentFieldValue={contentFieldValue}
                contentFieldOptions={contentFieldOptions}
                handleOptionsUpdate={handleOptionsUpdate}
                errorObj={errorObj}
                setErrorObj={setErrorObj}
              />
              <FindValueContainer
                stack={stack}
                findInputValue={findInputValue}
                contentFieldValue={contentFieldValue}
                localeValue={localeValue}
                refContentType={refContentType}
                handleInputValue={handleInputValue}
                errorObj={errorObj}
                handleContentType={(data: any) => {
                  setRefContentType(data);
                  resetStateValues({
                    fieldName: localeTexts.FindReplace.FieldName.replaceField,
                  });
                }}
              />
              <ReplaceValueContainer
                stack={stack}
                contentFieldValue={contentFieldValue}
                localeValue={localeValue}
                replaceValue={replaceValue}
                replaceFieldDisabled={replaceFieldDisabled}
                refReplaceContentType={refReplaceContentType}
                handleInputValue={handleInputValue}
                errorObj={errorObj}
                handleContentType={(data: any) => {
                  setRefReplaceContentType(data);
                  setReplaceValue(null);
                }}
              />
            </div>
            <div className="button-conatiner">
              <ButtonContainer
                handleModal={handleModal}
                handleFindOperation={(obj: any) =>
                  handleFindOperation(obj, true)
                }
                isSearchDisabled={isSearchDisabled}
                isReplaceDisabled={isReplaceDisabled}
                isPublishDisabled={isPublishDisabled}
              />
            </div>
          </div>
          <div className="table-Conatiner">
            <InfinteTable
              data={!isSearch ? tableData : searchData}
              itemStatusMap={itemStatusMap}
              fetchData={handleFindOperation}
              totalCounts={totalCounts}
              loading={loading}
              getSelectedRow={handleSelectedTableRow}
              operation={operation}
              isTableSelect={operation !== "publish"}
              tableSearchText={tableSearchText}
              regionURL={regionURL}
              selectedContentType={contentTypeValue}
              locale={localeValue}
              initialSelectedIds={initialSelectedIds}
              tableRef={tableRef}
              initialPageSize={
                constants.findTableConstants.tableInitState.limit
              }
              resetSearch={resetSearch}
            />
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default FindReplace;
