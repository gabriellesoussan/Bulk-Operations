/* -------ENTRY UTILS------- */
import React from "react";
import { EmptyState, Icon } from "@contentstack/venus-components";
import localeTexts from "../../locale/en-us";
import utils from "..";

const chunkArrayInGroups = (arr: any, size: number) => {
  const result = [];
  let temp = [];
  for (let a = 0; a < arr?.length; a += 1) {
    temp?.push(arr?.[a]);
    if (a % size === size - 1) {
      result?.push(temp);
      temp = [];
    }
  }
  if (temp?.length > 0) result?.push(temp);
  return result;
};

const getHoverActions = ({
  operation,
  regionURL,
  selectedContentType,
  defaultLocale,
}: any) => {
  const hoverActions = [];

  switch (operation) {
    case "publish":
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
              `${regionURL}/content-type/${selectedContentType?.value}/${data?.locale}/entry/${data?.uid}/edit?branch=main`,
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
              <div>{localeTexts.Entry.table.actions.view.entry}</div>
            </div>
          ),
          // eslint-disable-nexxt-line
          action: (e: any, data: any) => {
            window.open(
              `${regionURL}/content-type/${selectedContentType?.value}/${data?.locale}/entry/${data?.uid}/edit?branch=main`,
              "_blank"
            );
          },
        },
        {
          label: (
            <div className="Table_ActionsOp ActionUnpublish--Queue">
              <Icon icon="PublishQueue" size="medium" />
              <div>{localeTexts.Entry.table.actions.view.publishQueue}</div>
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
                  {localeTexts.Entry.table.actions.view.trash}
                </div>
              }
            />
          </div>
        ),
        action: (e: any) => {
          e?.stopPropagation();
          window.open(
            `${regionURL}/settings/trash/entries?content_types=${selectedContentType?.value}&locales=${defaultLocale}`,
            "_blank"
          );
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
            `${regionURL}/content-type/${selectedContentType?.value}/${data?.locale}/entry/${data?.uid}/edit?branch=main`,
            "_blank"
          );
        },
      });
  }

  return hoverActions;
};

const entryTableEmptyHeading = (
  <EmptyState
    heading={localeTexts.Entry.emptyState.heading}
    moduleIcon={localeTexts.Entry.emptyState.moduleIcon}
    description={localeTexts.Entry.emptyState.description}
    headingType={localeTexts.Entry.emptyState.headingType}
  />
);

const EntryTableColumns = [
  {
    Header: localeTexts.Entry.table.header.title,
    id: "title",
    accessor: (data: any) =>
      utils.wrapWithDiv(
        data?.title ? data?.title : localeTexts.Entry.table.header.untitled,
        "tooltip",
        "entry-filename"
      ),
    default: true,
    addToColumnSelector: true,
    disableSortBy: false,
    cssClass: "TableCol--Title Table__body__column__resize",
  },
  {
    Header: localeTexts.Entry.table.header.language,
    accessor: (data: any) => utils.wrapWithDiv(data?.locale, "tooltip"),
    default: false,
    addToColumnSelector: true,
    id: "locale",
    disableSortBy: true,
    cssClass: "TableCol--Language Table__body__column__resize",
  },
  {
    Header: localeTexts.Entry.table.header.modified,
    accessor: (data: any) => utils.wrapWithDiv(data?.updated_at, "datetime"),
    default: false,
    addToColumnSelector: true,
    id: "updated_at",
    disableSortBy: false,
    cssClass: "TableCol--Updatedat Table__body__column__resize",
  },
  {
    Header: localeTexts.Entry.table.header.createdat,
    accessor: (data: any) => utils.wrapWithDiv(data?.created_at, "datetime"),
    default: false,
    addToColumnSelector: true,
    id: "created_at",
    disableSortBy: false,
    cssClass: "TableCol--Createdat Table__body__column__resize",
  },
];

const CombinedCols = [
  {
    Header: localeTexts.Entry.table.header.version,
    accessor: (data: any) => utils.wrapWithDiv(data?._version, "tooltip"),
    default: false,
    addToColumnSelector: true,
    id: "_version",
    disableSortBy: true,
    cssClass: "TableCol--Version Table__body__column__resize",
  },
  {
    Header: localeTexts.Entry.table.header.tags,
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
    Header: localeTexts.Entry.table.header.url,
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
    Header: localeTexts.Entry.table.header.title,
    id: "title",
    accessor: (data: any) =>
      utils.wrapWithDiv(
        data?.title ? data?.title : localeTexts.Entry.table.header.untitled,
        "tooltip",
        "entry-filename"
      ),
    default: true,
    addToColumnSelector: true,
    disableSortBy: true,
    cssClass: "TableCol--Title Table__body__column__resize",
  },
  {
    Header: localeTexts.Entry.table.header.status,
    id: "status",
    accessor: (obj: any) => utils.wrapWithDiv(obj?.status, "status"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Status Table__body__column__resize",
  },
  {
    Header: localeTexts.Entry.table.header.message,
    id: "message",
    accessor: (obj: any) =>
      utils.wrapWithDiv(
        obj?.message,
        "tooltip",
        obj?.status === localeTexts.Entry.Message.operation.unsuccess.status
          ? "message-failed"
          : undefined
      ),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--EntryMessage Table__body__column__resize",
  },
];

const ResultExtraColumns = [
  {
    Header: localeTexts.Entry.table.header.env,
    id: "op_env",
    accessor: (obj: any) =>
      utils.wrapWithDiv(obj?.op_env?.join(", "), "tooltip"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Env Table__body__column__resize",
  },
  {
    Header: localeTexts.Entry.table.header.languages,
    id: "op_locales",
    accessor: (obj: any) =>
      utils.wrapWithDiv(obj?.op_locales?.join(", "), "tooltip"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Language Table__body__column__resize",
  },
];

const localeDropdownData = (locales: any[], setDefaultLocale: Function) =>
  locales?.map((locale: any) => ({
    action: () => setDefaultLocale(locale?.code),
    default: locale?.fallback_locale === null,
    label: locale?.name,
    value: locale?.code,
  }));

const getLocaleName = (localeOptions: any[], defaultLocale: string) =>
  localeOptions?.find((item) => item?.value === defaultLocale)?.label;

const entryUtils = {
  chunkArrayInGroups,
  getHoverActions,
  entryTableEmptyHeading,
  EntryTableColumns,
  CombinedCols,
  ResultColumn,
  ResultExtraColumns,
  localeDropdownData,
  getLocaleName,
};

export default entryUtils;
