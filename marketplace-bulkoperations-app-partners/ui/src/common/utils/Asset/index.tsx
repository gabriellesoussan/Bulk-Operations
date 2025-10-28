/* -------ASSET UTILS------- */
/* eslint-disable no-nested-ternary */
import React from "react";
import { EmptyState, Icon } from "@contentstack/venus-components";
import localeTexts from "common/locale/en-us";
import utils from "../index";

const assetTableEmptyHeading = (
  <EmptyState
    heading={localeTexts.Asset.table.emptyState.heading}
    moduleIcon={localeTexts.Asset.table.emptyState.moduleIcon}
    description={localeTexts.Asset.table.emptyState.description}
    headingType={localeTexts.Asset.table.emptyState.headingType}
  />
);

const assetEmptyHeading = () => (
  <EmptyState
    heading={localeTexts.Asset.table.emptyState2.heading}
    moduleIcon={localeTexts.Asset.table.emptyState2.moduleIcon}
    description={localeTexts.Asset.table.emptyState2.description}
    headingType={localeTexts.Asset.table.emptyState2.headingType}
  />
);

const getHoverActions = ({ operation, regionURL }: any) => {
  const hoverActions = [];

  switch (operation) {
    case "publish":
      hoverActions?.push(
        {
          label: (
            <div className="Table_ActionsOp ActionPublish--View">
              <Icon icon="NewTab" />
              <div>{localeTexts.Asset.table.actions.view.asset}</div>
            </div>
          ),
          // eslint-disable-nexxt-line
          action: (e: any, data: any) => {
            window.open(`${regionURL}/assets/${data?.uid}`, "_blank");
          },
        },
        {
          label: (
            <div className="Table_ActionsOp ActionPublish--Queue">
              <Icon icon="PublishQueue" size="medium" />
              <div>{localeTexts.Asset.table.actions.view.publishQueue}</div>
            </div>
          ),
          action: () => {
            window.open(
              `${regionURL}/publish-queue?category=single&status=published`,
              "_blank"
            );
          },
          canDisplay: ({ status }: any) => status !== "Failed",
        }
      );
      break;
    case "unpublish":
      hoverActions?.push(
        {
          label: (
            <div className="Table_ActionsOp ActionUnpublish--View">
              <Icon icon="NewTab" />
              <div>{localeTexts.Asset.table.actions.view.asset}</div>
            </div>
          ),
          // eslint-disable-nexxt-line
          action: (e: any, data: any) => {
            window.open(`${regionURL}/assets/${data?.uid}`, "_blank");
          },
        },
        {
          label: (
            <div className="Table_ActionsOp ActionUnpublish--Queue">
              <Icon icon="PublishQueue" size="medium" />
              <div>{localeTexts.Asset.table.actions.view.publishQueue}</div>
            </div>
          ),
          action: () => {
            window.open(
              `${regionURL}/publish-queue?category=single&status=unpublished`,
              "_blank"
            );
          },
          canDisplay: ({ status }: any) => status !== "Failed",
        }
      );
      break;
    case "delete":
      hoverActions?.push({
        label: (
          <div className="Table_hoverActions ActionDelete--View">
            <Icon
              icon="NewTab"
              data={
                <div>
                  &ensp;
                  {localeTexts.Asset.table.actions.view.trash}
                </div>
              }
            />
          </div>
        ),
        action: (e: any) => {
          e?.stopPropagation();
          window.open(`${regionURL}/settings/trash/assets`, "_blank");
        },
        canDisplay: ({ status }: any) => status !== "Failed",
      });
      break;
    default:
      hoverActions?.push({
        label: (
          <div className="Table_hoverActions ActionDefault--View">
            <Icon
              icon="NewTab"
              data={
                <div>
                  &ensp;
                  {localeTexts.Asset.table.actions.view.asset}
                </div>
              }
            />
          </div>
        ),
        // eslint-disable-nexxt-line
        action: (e: any, data: any) => {
          e?.stopPropagation();
          window.open(`${regionURL}/assets/${data?.uid}`, "_blank");
        },
        canDisplay: (e: any) => !e?.is_dir,
      });
  }
  return hoverActions;
};

const getDetails = (content_type: string) => {
  const iconObj: any = {
    audio: "MP3",
    video: "MP4",
    html: "HTML2",
    javascript: "JS",
    js: "JS",
    pdf: "PDF2",
    json: "JSON",
    zip: "ZIP",
    exe: "EXE",
    xml: "XML",
    csv: "CSV",
    xls: "XLS",
    doc: "DOC2",
    msword: "DOC2",
    word: "DOC2",
    ".md": "DOC2",
    txt: "TXT",
    text: "TXT",
    css: "CSS",
    ppt: "PPT",
    pptx: "PPT",
    presentation: "PPT",
    avi: "AVI",
    psd: "PSD",
    rtf: "RTF",
  };
  const typeObj: any = {
    image: "Image",
    audio: "Audio",
    video: "Video",
    html: "Code",
    javascript: "Code",
    js: "Code",
    pdf: "Pdf",
    json: "JSON",
    zip: "Archive",
    exe: "Exec",
    xml: "Sheet",
    csv: "Sheet",
    xls: "Sheet",
    msword: "Text",
    word: "Text",
    text: "Text",
    txt: "Text",
    doc: "Text",
    ".md": "Text",
    css: "Web",
    ppt: "File",
    pptx: "File",
    presentation: "File",
    application: "File",
    avi: "File",
    psd: "File",
    rtf: "File",
  };
  const iconKey = Object.keys(typeObj)?.find((key) =>
    content_type?.includes(key)
  );

  return {
    icon: iconObj?.[iconKey ?? ""] ?? "DOC2",
    type: typeObj?.[iconKey ?? ""] ?? "File",
  };
};

const AssetTitle = {
  Header: localeTexts.Asset.table.header.title,
  accessor: ({ content_type, url, title, is_dir, name }: any) => {
    if (is_dir) {
      return (
        <div className="asset-title-block">
          <div className="picture-container folder--row">
            <Icon icon="Folder" size="medium" />
          </div>
          {utils.tooltipWrapper(name, "asset-title")}
        </div>
      );
    }
    if (content_type?.includes("image")) {
      return (
        <div className="asset-title-block">
          <div className="picture-container">
            <img src={`${url}?width=100&format=webply`} alt={title} />
          </div>
          {utils.tooltipWrapper(title, "asset-title")}
        </div>
      );
    }
    return (
      <div className="asset-title-block">
        <div className="picture-container">
          <Icon
            icon={getDetails(content_type)?.icon}
            version="v2"
            size="medium"
          />
        </div>
        {utils.tooltipWrapper(title, "asset-title")}
      </div>
    );
  },
  default: true,
  cssClass: "TableCol--Title Table__body__column__resize",
  addToColumnSelector: true,
  id: "title",
};

const AssetTableColumns = [
  {
    ...AssetTitle,
    disableSortBy: false,
  },
  {
    Header: localeTexts.Asset.table.header.filename,
    accessor: ({ filename }: any) =>
      utils.wrapWithDiv(filename, "tooltip", "asset-filename"),
    cssClass: "TableCol--Filename Table__body__column__resize",
    addToColumnSelector: true,
    disableSortBy: true,
    id: "filename",
  },
  {
    Header: localeTexts.Asset.table.header.description,
    accessor: ({ description }: any) =>
      utils.wrapWithDiv(description, "tooltip", "asset-filename"),
    default: false,
    cssClass: "TableCol--Description Table__body__column__resize",
    addToColumnSelector: true,
    id: "description",
    disableSortBy: true,
  },
  {
    Header: localeTexts.Asset.table.header.uid,
    accessor: "uid",
    default: false,
    cssClass: "TableCol--Uid Table__body__column__resize",
    addToColumnSelector: true,
    id: "uid",
    disableSortBy: true,
  },
  {
    Header: localeTexts.Asset.table.header.createdat,
    accessor: (data: any) => utils.wrapWithDiv(data?.created_at, "datetime"),
    default: false,
    cssClass: "TableCol--Createdat Table__body__column__resize",
    addToColumnSelector: true,
    id: "created_at",
    disableSortBy: false,
  },
  {
    Header: localeTexts.Asset.table.header.modified,
    accessor: (data: any) => utils.wrapWithDiv(data?.updated_at, "datetime"),
    default: false,
    cssClass: "TableCol--Updatedat Table__body__column__resize",
    addToColumnSelector: true,
    id: "updated_at",
    disableSortBy: false,
  },
  {
    Header: localeTexts.Asset.table.header.type,
    accessor: ({ content_type, is_dir }: any) => {
      const type = is_dir ? "Folder" : getDetails(content_type)?.type;
      return utils.wrapWithDiv(type, "tooltip", "asset-filename");
    },
    default: false,
    cssClass: "TableCol--Type Table__body__column__resize",
    addToColumnSelector: true,
    id: "content_type",
    disableSortBy: true,
  },
  {
    Header: localeTexts.Asset.table.header.tags,
    accessor: (data: any) =>
      utils.wrapWithDiv(
        Array.isArray(data?.tags) ? data?.tags?.join(", ") : data?.tags,
        "tooltip"
      ),
    default: false,
    addToColumnSelector: true,
    id: "tags",
    disableSortBy: true,
    cssClass: "TableCol--Tags Table__body__column__resize",
  },
  {
    Header: localeTexts.Asset.table.header.url,
    accessor: (data: any) => utils.wrapWithDiv(data?.url, "tooltip"),
    default: false,
    addToColumnSelector: true,
    id: "url",
    disableSortBy: true,
    cssClass: "TableCol--Url Table__body__column__resize",
  },
];

const ResultColumn = [
  {
    ...AssetTitle,
    disableSortBy: true,
  },
  {
    Header: localeTexts.Asset.table.header.version,
    accessor: (data: any) => utils.wrapWithDiv(data?._version, "tooltip"),
    default: false,
    addToColumnSelector: true,
    id: "_version",
    disableSortBy: true,
    cssClass: "TableCol--Version Table__body__column__resize",
  },
  {
    Header: localeTexts.Asset.table.header.status,
    id: "status",
    accessor: (obj: any) => utils.wrapWithDiv(obj?.status, "status"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Status Table__body__column__resize",
  },
  {
    Header: localeTexts.Asset.table.header.message,
    id: "message",
    accessor: (obj: any) =>
      utils.wrapWithDiv(
        obj?.message,
        "tooltip",
        obj?.status === localeTexts.Asset.Message.operation.unsuccess.status
          ? "message-failed"
          : undefined
      ),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Message Table__body__column__resize",
  },
];

const ResultExtraColumns = [
  {
    Header: localeTexts.Asset.table.header.env,
    id: "op_env",
    accessor: (obj: any) =>
      utils.wrapWithDiv(obj?.op_env?.join(", "), "tooltip"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Env Table__body__column__resize",
  },
  {
    Header: localeTexts.Asset.table.header.language,
    id: "op_locales",
    accessor: (obj: any) =>
      utils.wrapWithDiv(obj?.op_locales?.join(", "), "tooltip"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Language Table__body__column__resize",
  },
];

const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i: number = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes} ${sizes?.[i]}`;
  return `${(bytes / 1024 ** i)?.toFixed(1)} ${sizes?.[i]}`;
};

const assetUtils = {
  assetTableEmptyHeading,
  assetEmptyHeading,
  getHoverActions,
  AssetTableColumns,
  ResultColumn,
  ResultExtraColumns,
  bytesToSize,
};

export default assetUtils;
