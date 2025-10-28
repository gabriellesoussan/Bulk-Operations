import React, { ReactElement, useEffect, useRef, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  Button,
  cbModal,
  Dropdown,
  Icon,
  Tooltip,
  AsyncSelect,
} from "@contentstack/venus-components";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import utils from "common/utils";
import constants from "common/constants";
import localeTexts from "common/locale/en-us";
import { SelectOptions, TypeSDKData } from "common/types";
import entryUtils from "common/utils/Entry";
import releaseUtils from "common/utils/Release";
import ResetModal from "components/ResetModal";
import Skeleton from "components/Skeleton";
import ScrollTable from "components/ScrollTable";
import PublishUnpublishModal from "components/PublishUnpublishModal";
import DeleteModal from "components/DeleteModal";
import services from "services";
import EntryService from "services/Entry";
import "./style.scss";

declare global {
  interface Window {
    iframeRef: any;
    postRobot: any;
  }
}

function Entry({
  isRelease = false,
  maxSelectReleaseEntries,
  openReleaseModal,
}: any) {
  const ref = useRef(null);
  const [state, setState] = useState<TypeSDKData>({
    location: {},
    appSdkInitialized: false,
  });
  const [stack, setStack] = useState<any>();
  const [selectedContentType, setSelectedContentType] = useState<any>(null);
  const [environments, setEnvironments] = useState<any>([]);
  const [stateEnvironments, setStateEnvironments] = useState<any>([]);
  const [locales, setLocales] = useState<any>([]);
  const [selectedEntries, setSelectedEntries] = useState<any>([]);
  const [regionURL, setRegionURL] = useState("");
  const [displayTableData, setDisplayTableData] = useState<any>([]);
  const [isDisplayTable, setIsDisplayTable] = useState(false);
  const [operation, setOperation] = useState<string>("");
  const [defaultLocale, setDefaultLocale] = useState<string>("");
  const [localeOptions, setLocaleOptions] = useState<any[]>([]);
  const [isShowSelected, setIsShowSelected] = useState<boolean>(false);
  const [initialSelectedRowIds, setInitialSelectedRowIds] = useState<any>({});
  const [initPage, setInitPage] = useState<number>(1);

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSDK) => {
        window.iframeRef = ref?.current;
        window.postRobot = appSDK?.postRobot;
        setRegionURL(
          utils.getRegionUrl(appSDK?.region, appSDK?.stack?._data?.api_key)
        );
        appSDK?.location?.DashboardWidget?.frame?.updateHeight(680);
        const { environments: env } =
          (await appSDK?.stack?.getEnvironments()) || {};
        setStateEnvironments(env);
        const mappedEnvironments = env?.map(({ name }: any) =>
          utils.mapForSelectOption(name, name)
        );
        const { locales: locale } = (await appSDK?.stack?.getLocales()) || {};
        setStack(appSDK?.stack);
        setState({
          location: appSDK?.location,
          appSdkInitialized: true,
        });
        setEnvironments(mappedEnvironments);
        const sortedLocales = utils.sortLocales(locale);
        setDefaultLocale(sortedLocales?.[0]?.code);
        setLocales(sortedLocales);
        setLocaleOptions(
          entryUtils.localeDropdownData(sortedLocales, setDefaultLocale)
        );
      })
      .catch((error: any) =>
        console.error("Error: AppSdk Initialization", error)
      );
  }, []);

  useEffect(() => {
    const initialIdObj: any = {};
    if (selectedEntries?.length) {
      selectedEntries?.forEach((entry: any) => {
        initialIdObj[entry?.uid] = true;
      });
    }
    setInitialSelectedRowIds(initialIdObj);
  }, [selectedEntries]);

  const clearFields = () => {
    setInitialSelectedRowIds({});
    setSelectedEntries([]);
    setIsShowSelected(false);
    setOperation("");
    setInitPage(1);
    setIsDisplayTable(false);
    setDisplayTableData([]);
  };

  const handleReset = async () => {
    await setSelectedContentType(null);
    await clearFields();
    setLocaleOptions([...localeOptions]);
    setDefaultLocale(localeOptions?.[0]?.value);
  };

  useEffect(() => {
    if (selectedContentType?.value && defaultLocale) {
      const reloadTable = async () => {
        const contentType = { ...selectedContentType };
        clearFields();
        await setSelectedContentType(null);
        setSelectedContentType(contentType);
      };
      reloadTable();
    }
  }, [defaultLocale]);

  const openResetModal = () =>
    cbModal({
      // eslint-disable-next-line
      component: (props: any) => (
        <ResetModal {...props} resetValues={handleReset} />
      ),
      modalProps: {
        size: "customSize",
      },
    });

  const handleOperation = async (
    batchEntries: any,
    operationObj: any,
    operationFunc: Function,
    action: string
  ) => {
    const tableData = await Promise.all(
      batchEntries?.map(async (entry: any) => {
        if (entry?.title === "" && action !== "delete") {
          return {
            ...entry,
            op_env: operationObj?.environments,
            op_locales: operationObj?.locales,
            status: localeTexts.Message.status.unsuccess,
            message: `${localeTexts.Message.untitled_notice_s} ${action} ${localeTexts.Message.untitled_notice_e}`,
          };
        }
        const response = await services.makeApiCall(
          operationFunc,
          {
            stack,
            contentTypeValue: selectedContentType?.value,
            environments: operationObj?.environments,
            entryUid: entry?.uid,
            locales: operationObj?.locales,
            defaultLocale,
            time: operationObj?.time,
          },
          action
        );
        return {
          ...entry,
          status: response?.status,
          message: response?.notice,
          op_env: operationObj?.environments,
          op_locales: operationObj?.locales,
        };
      })
    );
    return tableData;
  };

  const handleActions = async ({
    action,
    environments: env,
    locales: loc,
    time,
    closeModal,
  }: any) => {
    try {
      setIsShowSelected(false);
      let operationFunc: Function = () => {
        /* */
      };
      switch (action) {
        case "publish":
          operationFunc = services.publishEntries;
          break;
        case "unpublish":
          operationFunc = EntryService.unpublishEntries;
          break;
        case "delete":
          operationFunc = EntryService.deleteEntries;
          break;
        default:
      }
      setOperation(action);

      if (
        selectedEntries?.length &&
        (action === "delete" || (env?.length && loc?.length))
      ) {
        closeModal();
        setIsDisplayTable(true);
        const finalData = await handleOperation(
          selectedEntries,
          {
            environments: env,
            locales: loc,
            time,
          },
          operationFunc,
          action
        );
        setDisplayTableData(finalData);
      }
    } catch (error: any) {
      closeModal();
      console.error("Error: Entry Publish Operation", error);
    }
  };

  const openModal = (action: string) => {
    cbModal({
      // eslint-disable-next-line
      component: (props: any) => (
        <PublishUnpublishModal
          action={action}
          incomingLocales={locales}
          incomingEnvironments={environments}
          closeModal={props?.closeModal}
          handleActions={handleActions}
          defaultLocale={defaultLocale}
          componentType="Entry"
          noOfItems={selectedEntries?.length ?? 0}
        />
      ),
      modalProps: {
        size: "max",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscape: true,
      },
    });
  };

  const openDeleteModal = () => {
    cbModal({
      // eslint-disable-next-line
      component: (props: any) => (
        <DeleteModal
          handleActions={handleActions}
          closeModal={props?.closeModal}
          modalType="entries"
          defaultLocale={entryUtils.getLocaleName(localeOptions, defaultLocale)}
        />
      ),
      modalProps: {
        size: "xsmall",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscape: true,
      },
    });
  };

  const handleSelectedEntries = (
    selectedIds: string[],
    selectedData: any[]
  ) => {
    if (!selectedData?.length) setIsShowSelected(false);
    setSelectedEntries(selectedData);
  };

  const handleSelectedContentType = (e: SelectOptions) => {
    clearFields();
    setDefaultLocale(localeOptions?.[0]?.value);
    setLocaleOptions([...localeOptions]);
    setSelectedContentType(e);
  };

  const getTableData = async ({ contenttype, sortBy, skip, limit }: any) => {
    if (contenttype) {
      return EntryService.getEntries({
        stack,
        contentTypeValue: contenttype,
        sortBy,
        skip,
        limit,
        defaultLocale,
      });
    }
    return {};
  };

  const searchTableData = async ({
    contenttype,
    searchText,
    skip,
    limit,
    sortBy,
  }: any) => {
    if (contenttype) {
      return EntryService.searchEntries({
        stack,
        contentTypeValue: contenttype,
        defaultLocale,
        searchText,
        skip,
        limit,
        sortBy,
      });
    }
    return [];
  };

  const tableActions = [
    {
      cb: () => setIsShowSelected(!isShowSelected),
      label: isShowSelected
        ? localeTexts.Entry.table.actions.view.backToEntries
        : `${localeTexts.Entry.table.actions.selected.label} (${selectedEntries?.length})`,
      icon: isShowSelected ? "" : localeTexts.Entry.table.actions.selected.icon,
      showSelected: true,
    },
    {
      cb: () => openModal("publish"),
      ...localeTexts.Entry.table.actions.publish,
    },
    {
      cb: () => openModal("unpublish"),
      ...localeTexts.Entry.table.actions.unpublish,
    },
    {
      cb: openDeleteModal,
      ...localeTexts.Entry.table.actions.delete,
    },
  ];

  const getPublishStatus = (publish_details: any[]) => {
    const cellContent: ReactElement[] = [];
    const hoverContent: ReactElement[] = [];

    publish_details?.forEach(
      ({ environment, locale, time }: any, index: number) => {
        let envDiv = (
          <div>{utils.getPublishStatusEnv(environment, stateEnvironments)}</div>
        );
        if (publish_details?.length > 2 && index === 1) {
          envDiv = (
            <div>
              {utils.getPublishStatusEnv(
                environment,
                stateEnvironments,
                publish_details?.length - 2
              )}
            </div>
          );
        }
        if (index < 2) cellContent?.push(envDiv);

        hoverContent?.push(
          <div className="publish-status-row" key={`${environment}-${locale}`}>
            <div className="status-wrap">
              {utils.getPublishStatusEnv(environment, stateEnvironments)}
            </div>
            <div className="status-wrap">
              <Icon className="table-icon" icon="LanguageDark" />
              {locale}
            </div>
            <div className="publish-status-time status-wrap">
              <Icon className="table-icon" icon="PublishDark" />
              <Moment format="LLL">{time}</Moment>
            </div>
          </div>
        );
      }
    );
    return (
      <Tooltip
        content={hoverContent}
        position="left"
        type="primary"
        variantType="light"
      >
        <div>{cellContent}</div>
      </Tooltip>
    );
  };

  const publishColumnObj = {
    Header: localeTexts.Entry.table.header.publish,
    // eslint-disable-next-line
    accessor: ({ publish_details }: any) =>
      publish_details?.length ? (
        getPublishStatus(publish_details)
      ) : (
        <div>{localeTexts.Entry.table.header.not_published}</div>
      ),
    default: false,
    addToColumnSelector: true,
    cssClass: "TableCol--PublishStatus Table__body__column__resize",
    id: "publish_details",
    disableSortBy: true,
  };

  const getContentTypeOptions = async ({
    search,
    skip: optionSkip,
    limit: optionLimit,
  }: {
    search?: string;
    skip: number;
    limit: number;
  }) => {
    const contenttypes = await stack?.getContentTypes("", {
      include_count: true,
      include_global_field_schema: true,
      skip: optionSkip,
      limit: optionLimit,
      asc: "title",
      typeahead: search,
    });

    const options: any = utils.optionsCreate({
      data: contenttypes?.content_types,
      label: localeTexts.Entry.SelectOptions.contentType.label,
      value: localeTexts.Entry.SelectOptions.contentType.value,
    });

    return {
      options,
      hasMore: contenttypes.count > optionSkip + optionLimit,
    };
  };

  const view = (
    <>
      <div className="container">
        <div className="menu-controller">
          <Link to="/dashboard-widget">
            <Button
              buttonType={localeTexts.backButton.buttonType}
              icon="BackArrow"
              className="back_button"
              version="v2"
              size="small"
            >
              {localeTexts.backButton.label}
            </Button>
          </Link>
          <AsyncSelect
            debounceTimeout={300}
            isClearable
            isSearchable
            limit={20}
            loadMoreOptions={getContentTypeOptions}
            onChange={handleSelectedContentType}
            placeholder={localeTexts.Entry.selectOption.placeholder}
            value={selectedContentType}
            version="v2"
          />
          {!isRelease && (
            <Button
              onClick={openResetModal}
              buttonType="secondary"
              iconAlignment="left"
              icon="Reset"
              version="v2"
              size="small"
            >
              {localeTexts.Entry.button.reset.label}
            </Button>
          )}
        </div>
        <Dropdown
          isDisabled={isDisplayTable}
          closeAfterSelect
          highlightActive
          list={localeOptions}
          type="select"
          withArrow
          version="v2"
        >
          <Icon icon="Settings" />
        </Dropdown>
      </div>
      <div className="table-container">
        <ScrollTable
          isDisplayTable={isDisplayTable}
          displayTableData={displayTableData}
          tableType="entries"
          initialSelectedRowIds={initialSelectedRowIds}
          initPage={initPage}
          isShowSelected={isShowSelected}
          selectedEntries={selectedEntries}
          selectedContentType={selectedContentType?.value}
          getTableData={getTableData}
          columns={
            // eslint-disable-next-line
            isDisplayTable
              ? operation === "delete"
                ? [...entryUtils.CombinedCols, ...entryUtils.ResultColumn]
                : [
                    ...entryUtils.CombinedCols,
                    ...entryUtils.ResultColumn,
                    ...entryUtils.ResultExtraColumns,
                  ]
              : [
                  ...entryUtils.EntryTableColumns,
                  ...entryUtils.CombinedCols,
                  publishColumnObj,
                ]
          }
          columnsOrder={[
            "title",
            "locale",
            "_version",
            "created_at",
            "updated_at",
            "url",
            "publish_details",
            "tags",
            "op_env",
            "op_locales",
            "status",
            "message",
          ]}
          uniqueKey="uid"
          searchPlaceholder={localeTexts.Entry.table.placeholder}
          isRowSelect
          fullRowSelect
          getSelectedRow={handleSelectedEntries}
          emptyHeading={
            isRelease
              ? releaseUtils.entryReleaseTableEmptyHeading
              : entryUtils.entryTableEmptyHeading
          }
          onHoverActionList={entryUtils.getHoverActions({
            operation,
            regionURL,
            selectedContentType,
            defaultLocale,
          })}
          name={localeTexts.Entry.table.name}
          searchTableData={searchTableData}
          maxSelect={
            isRelease
              ? maxSelectReleaseEntries
              : constants.scrollTableConstants.maxSelect.entry
          }
          rowDisable={
            isRelease
              ? {
                  key: "title",
                  value: "",
                }
              : false
          }
          onRowSelectProp={
            !isRelease
              ? tableActions
              : [
                  {
                    cb: () => setIsShowSelected(!isShowSelected),
                    label: isShowSelected
                      ? localeTexts.Entry.table.actions.view.backToEntries
                      : `${localeTexts.Entry.table.actions.selected.label} (${selectedEntries?.length})`,
                    icon: isShowSelected
                      ? ""
                      : localeTexts.Entry.table.actions.selected.icon,
                    showSelected: true,
                  },
                  {
                    cb: () =>
                      openReleaseModal(
                        handleReset,
                        localeTexts.Release.actionType.entry,
                        selectedEntries,
                        selectedContentType?.value,
                        defaultLocale
                      ),
                    ...localeTexts.Release.tableAction,
                  },
                ]
          }
        />
      </div>
    </>
  );

  return (
    <div className="view-wrapper">
      {state?.appSdkInitialized ? view : <Skeleton />}
    </div>
  );
}

export default Entry;
