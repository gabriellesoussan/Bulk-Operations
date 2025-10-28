import React, { ReactElement, useEffect, useRef, useState } from "react";
import ContentstackAppSdk from "@contentstack/app-sdk";
import {
  Button,
  cbModal,
  Tooltip,
  Icon,
  openUploadAssetModal,
} from "@contentstack/venus-components";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import ScrollTable from "components/ScrollTable";
import { TypeSDKData } from "common/types";
import utils from "common/utils";
import constants from "common/constants";
import localeTexts from "common/locale/en-us";
import releaseUtils from "common/utils/Release";
import Skeleton from "components/Skeleton";
import ResetModal from "components/ResetModal";
import PublishUnpublishModal from "components/PublishUnpublishModal";
import DeleteModal from "components/DeleteModal";
import assetUtils from "common/utils/Asset";
import AssetService from "services/Asset";
import services from "services";
import AssetUploadingModal from "./AssetUploadingModal";
import BreadCrumb from "./BreadCrumb";
import "./style.scss";

function Assets({
  isRelease = false,
  maxSelectReleaseAssets,
  openReleaseModal,
}: any) {
  const ref = useRef(null);
  const [state, setState] = useState<TypeSDKData>({
    location: {},
    appSdkInitialized: false,
  });
  const [mockedSDK, setMockedSDK] = useState<any>();
  const [environments, setEnvironments] = useState<any>([]);
  const [stateEnvironments, setStateEnvironments] = useState<any>([]);
  const [selectedAssets, setSelectedAssets] = useState<any>([]);
  const [locales, setLocales] = useState<any>([]);
  const [isShowSelected, setIsShowSelected] = useState<boolean>(false);
  const [initialSelectedRowIds, setInitialSelectedRowIds] = useState<any>({});
  const [regionURL, setRegionURL] = useState("");
  const [displayTableData, setDisplayTableData] = useState<any>([]);
  const [isDisplayTable, setIsDisplayTable] = useState(false);
  const [operation, setOperation] = useState<string>("");
  const [resetDisabled, setResetDisabled] = useState<boolean>(false);
  const [currentFolder, setCurrentFolder] = useState<string>("cs_root");
  const [breadCrumbArr, setBreadCrumbArr] = useState<any[]>([
    {
      name: "All Assets",
      folderId: "cs_root",
      path: 1,
    },
  ]);
  const [uploadCompleted, setUploadCompleted] = useState<boolean>(false);
  const [storedAssets, setStoredAssets] = useState<any[]>([]);
  const [rejectedAssets, setRejectedAssets] = useState<any[]>([]);
  const [initPage, setInitPage] = useState<number>(1);

  useEffect(() => {
    ContentstackAppSdk.init()
      .then(async (appSDK) => {
        window.iframeRef = ref?.current;
        window.postRobot = appSDK?.postRobot;
        setRegionURL(
          utils.getRegionUrl(appSDK?.region, appSDK?.stack?._data?.api_key)
        );
        setMockedSDK(appSDK);
        appSDK?.location?.DashboardWidget?.frame?.updateHeight(680);
        const { environments: env } =
          (await appSDK?.stack?.getEnvironments()) || {};
        const mapEnvironments = env?.map(({ name }: any) =>
          utils.mapForSelectOption(name, name)
        );
        const { locales: locale } = (await appSDK?.stack?.getLocales()) || {};
        const sortedLocales = utils.sortLocales(locale);
        setStateEnvironments(env);
        setEnvironments(mapEnvironments);
        setLocales(sortedLocales);
        setState({
          location: appSDK?.location,
          appSdkInitialized: true,
        });
      })
      .catch((error: any) =>
        console.error("Error: AppSdk Initialization", error)
      );
  }, []);

  const handleOperation = async (
    batchAssets: any,
    operationObj: any,
    operationFunc: Function,
    action: string
  ) => {
    const tableData = await Promise.all(
      batchAssets?.map(async (asset: any) => {
        const response = await services.makeApiCall(
          operationFunc,
          {
            stack: mockedSDK?.stack,
            environments: operationObj?.environments,
            assetUid: asset?.uid,
            locales: operationObj?.locales,
            time: operationObj?.time,
          },
          action
        );
        return {
          ...asset,
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
          operationFunc = AssetService.publishAssets;
          break;
        case "unpublish":
          operationFunc = AssetService.unpublishAssets;
          break;
        case "delete":
          operationFunc = AssetService.deleteAssets;
          break;
        default:
      }
      setOperation(action);

      if (
        selectedAssets?.length &&
        (action === "delete" || (env?.length && loc?.length))
      ) {
        closeModal();
        setIsDisplayTable(true);
        const finalData = await handleOperation(
          selectedAssets,
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
      console.error("Error: Asset Publish Operation", error);
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
          defaultLocale={locales?.[0]?.code}
          componentType="Asset"
          noOfItems={selectedAssets?.length ?? 0}
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
          modalType="assets"
        />
      ),
      modalProps: {
        size: "xsmall",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscape: true,
      },
    });
  };

  const handleReset = async () => {
    await setCurrentFolder("");
    await setSelectedAssets([]);
    setInitialSelectedRowIds({});
    setInitPage(1);
    setOperation("");
    setBreadCrumbArr([
      {
        name: "All Assets",
        folderId: "cs_root",
        path: 1,
      },
    ]);
    setTimeout(() => {}, 300);
    setIsShowSelected(false);
    setIsDisplayTable(false);
    setDisplayTableData([]);
    setCurrentFolder("cs_root");
    setUploadCompleted(false);
    setStoredAssets([]);
  };

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

  const getTableData = async ({ sortBy, skip, limit, folderUid }: any) =>
    AssetService.getAllAssets({
      stack: mockedSDK?.stack,
      skip,
      limit,
      folderUid,
      sortBy,
    });

  const searchTableData = async ({
    searchText,
    folderUid,
    sortBy,
    skip,
    limit,
  }: any) =>
    AssetService.searchAssets({
      stack: mockedSDK?.stack,
      searchText,
      folderUid,
      sortBy,
      skip,
      limit,
    });

  const tableActions = [
    {
      cb: () => setIsShowSelected(!isShowSelected),
      label: isShowSelected
        ? localeTexts.Asset.table.actions.view.backToAssets
        : `${localeTexts.Asset.table.actions.selected.label} (${selectedAssets?.length})`,
      icon: isShowSelected ? "" : localeTexts.Asset.table.actions.selected.icon,
      showSelected: true,
    },
    {
      cb: () => openModal("publish"),
      ...localeTexts.Asset.table.actions.publish,
    },
    {
      cb: () => openModal("unpublish"),
      ...localeTexts.Asset.table.actions.unpublish,
    },
    {
      cb: openDeleteModal,
      ...localeTexts.Asset.table.actions.delete,
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
    Header: localeTexts.Asset.table.header.publish,
    // eslint-disable-next-line
    accessor: ({ publish_details, is_dir }: any) =>
      publish_details?.length ? (
        getPublishStatus(publish_details)
      ) : (
        <div className="status-wrap">
          {is_dir ? "-" : localeTexts.Asset.table.header.not_published}
        </div>
      ),
    default: false,
    addToColumnSelector: true,
    cssClass: "TableCol--PublishStatus Table__body__column__resize",
    id: "publish_details",
    disableSortBy: true,
  };

  const handleSelectedAssets = (selectedIds: string[], selectedData: any[]) => {
    if (!selectedData?.length) setIsShowSelected(false);
    setSelectedAssets(selectedData);
  };

  useEffect(() => {
    const initialIdObj: any = {};
    if (selectedAssets?.length) {
      selectedAssets?.forEach((asset: any) => {
        initialIdObj[asset?.uid] = true;
      });
    }
    setInitialSelectedRowIds(initialIdObj);
  }, [selectedAssets]);

  const breadCrumbAction = (item: any) => {
    const arrCopy = [...breadCrumbArr];
    if (item?.path >= 0) {
      setBreadCrumbArr(arrCopy?.slice(0, item?.path));
      setCurrentFolder(item?.folderId);
    }
  };

  const handleBreadCrum = (item: any) => {
    setBreadCrumbArr([
      ...breadCrumbArr,
      {
        name: item?.name,
        folderId: item?.uid,
        path: breadCrumbArr?.length + 1,
      },
    ]);
  };

  useEffect(() => {
    if (
      !selectedAssets?.length &&
      !isDisplayTable &&
      currentFolder === "cs_root"
    ) {
      setResetDisabled(true);
    } else {
      setResetDisabled(false);
    }
  }, [selectedAssets, isDisplayTable, currentFolder]);

  const handleUploadAsset = (uploadedAssets: any, failedAssets: any) => {
    setRejectedAssets([...rejectedAssets, ...failedAssets]);
    if (uploadedAssets?.length) {
      setUploadCompleted(true);
      const finalizedAssets: any[] = [];
      uploadedAssets?.forEach((asset: any) => {
        if (asset?.url) finalizedAssets?.push(asset);
      });
      setStoredAssets([...storedAssets, ...finalizedAssets]);
    }

    const folder = currentFolder;
    setCurrentFolder("");
    setCurrentFolder(folder);
  };

  const handleUploadModalCancel = () => {
    setUploadCompleted(false);
    setStoredAssets([]);
    setRejectedAssets([]);
  };

  const view = (
    <>
      <div className="container">
        <div className="menu-controller">
          <Link to="/dashboard-widget">
            <Button
              buttonType={localeTexts.backButton.buttonType}
              version="v2"
              icon="BackArrow"
              className="back_button"
              size="small"
            >
              {localeTexts.backButton.label}
            </Button>
          </Link>
          <BreadCrumb
            breadCrumbArr={breadCrumbArr}
            breadCrumbAction={breadCrumbAction}
            disabled={isDisplayTable}
          />
          {!isRelease && (
            <Button
              onClick={openResetModal}
              version="v2"
              disabled={resetDisabled}
              buttonType="secondary"
              iconAlignment="left"
              icon="Reset"
              size="small"
            >
              {localeTexts.Asset.button.reset.label}
            </Button>
          )}
        </div>
        {!isRelease && (
          <Button
            buttonType="primary"
            icon="AddPlus"
            className="upload-asset-btn"
            version="v2"
            size="small"
            disabled={isDisplayTable}
            onClick={() => {
              openUploadAssetModal({
                sdk: mockedSDK,
                multiple: { max: 10 },
                onSubmit: handleUploadAsset,
              });
            }}
          >
            {localeTexts.Asset.button.upload.label}
          </Button>
        )}
      </div>
      <div className="table-container">
        <ScrollTable
          tableType="assets"
          isDisplayTable={isDisplayTable}
          displayTableData={displayTableData}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          handleBreadCrum={handleBreadCrum}
          initialSelectedRowIds={initialSelectedRowIds}
          initPage={initPage}
          isShowSelected={isShowSelected}
          selectedEntries={selectedAssets}
          getTableData={getTableData}
          columns={
            // eslint-disable-next-line
            isDisplayTable
              ? operation === "delete"
                ? assetUtils.ResultColumn
                : [...assetUtils.ResultColumn, ...assetUtils.ResultExtraColumns]
              : [...assetUtils.AssetTableColumns, publishColumnObj]
          }
          uniqueKey="uid"
          searchPlaceholder={localeTexts.Asset.table.placeholder}
          isRowSelect
          fullRowSelect
          getSelectedRow={handleSelectedAssets}
          emptyHeading={
            isRelease
              ? releaseUtils.assetReleaseTableEmptyHeading
              : assetUtils.assetTableEmptyHeading
          }
          onHoverActionList={assetUtils.getHoverActions({
            operation,
            regionURL,
          })}
          name={localeTexts.Asset.table.name}
          searchTableData={searchTableData}
          maxSelect={
            isRelease
              ? maxSelectReleaseAssets
              : constants.scrollTableConstants.maxSelect.asset
          }
          onRowSelectProp={
            !isRelease
              ? tableActions
              : [
                  {
                    cb: () => setIsShowSelected(!isShowSelected),
                    label: isShowSelected
                      ? localeTexts.Entry.table.actions.view.backToEntries
                      : `${localeTexts.Entry.table.actions.selected.label} (${selectedAssets?.length})`,
                    icon: isShowSelected
                      ? ""
                      : localeTexts.Entry.table.actions.selected.icon,
                    showSelected: true,
                  },
                  {
                    cb: () =>
                      openReleaseModal(
                        handleReset,
                        localeTexts.Release.actionType.asset,
                        selectedAssets,
                        localeTexts.Release.assetContentType
                      ),
                    ...localeTexts.Release.tableAction,
                  },
                ]
          }
        />
      </div>
      {uploadCompleted && (
        <AssetUploadingModal
          storedAssets={storedAssets}
          rejectedAssets={rejectedAssets}
          handleModalCancel={handleUploadModalCancel}
        />
      )}
    </>
  );

  return (
    <div className="view-wrapper">
      {state?.appSdkInitialized ? view : <Skeleton />}
    </div>
  );
}

export default Assets;
