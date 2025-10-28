import React from "react";
import { OutlineTag } from "@contentstack/venus-components";
import localeTexts from "common/locale/en-us";
import utils from "common/utils";
import { Menu } from "../types";

const MENU: Menu[] = [
  {
    id: "entries",
    title: "Entries",
    description: "Publish, Unpublish and Delete entries",
    icon: "EntryModuleLarge",
    path: "/entry",
    className: "icon_entries",
  },
  {
    id: "assets",
    title: "Assets",
    description: "Upload, Publish, Unpublish and Delete assets",
    icon: "AssetModuleLarge",
    path: "/asset",
    className: "icon_assets",
  },
  {
    id: "findreplace",
    title: "Find & Replace",
    description: "Find & Replace in entries and publish",
    icon: "Search",
    path: "/find-replace",
    className: "icon_search",
  },
];

const FindReplaceColumns: any = [
  {
    Header: "id",
    id: "id",
    accessor: "id",
  },
  {
    Header: "Uid",
    id: "uid",
    accessor: "uid",
  },
  {
    Header: "Title",
    id: "title",
    accessor: (obj: any) =>
      utils.wrapWithDiv(
        obj?.title ? obj?.title : localeTexts.Entry.table.header.untitled,
        "tooltip",
        "entry-filename"
      ),
    addToColumnSelector: true,
    default: true,
    cssClass: "TableCol--Title Table__body__column__resize",
    disableSortBy: true,
  },
  {
    Header: "Field Name/Path",
    id: "fieldName",
    accessor: (obj: any) =>
      utils.wrapWithDiv(obj?.fieldName, "tooltip", "entry-filename"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--FieldName Table__body__column__resize",
  },
  {
    Header: "Value",
    id: "value",
    accessor: (obj: any) =>
      utils.wrapWithDiv(obj?.value, "tooltip", "entry-filename"),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--FieldValue Table__body__column__resize",
  },
  {
    Header: "Version",
    id: "version",
    accessor: "version",
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Version Table__body__column__resize",
  },
  {
    Header: "Locale",
    id: "locale",
    accessor: "locale",
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Language Table__body__column__resize",
  },
  {
    Header: "Status",
    id: "status",
    accessor: (obj: any) => (
      <OutlineTag
        content={<div className="outline-content">{obj?.status}</div>}
        type="positive"
        className={
          obj?.status ===
          localeTexts.FindReplace.Message.operation.unsuccess.status
            ? "status-failed"
            : "status-success"
        }
      />
    ),
    addToColumnSelector: true,
    default: true,
    disableSortBy: true,
    cssClass: "TableCol--Status Table__body__column__resize",
  },
  {
    Header: "Message",
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
    cssClass: "TableCol--Message Table__body__column__resize",
  },
];

const scrollTableConstants = {
  hiddenColumns: ["tags", "url", "created_at", "description", "filename"],
  itemSize: 60,
  rowPerPageOptions: [30, 50, 100, 500, 1000],
  tableInitState: {
    skip: 0,
    limit: 100,
    fetchCalledByTable: false,
  },
  maxSelect: {
    entry: 1000,
    asset: 1000,
    release_v1: 500,
    release_v2: 1000,
  },
};

const findTableConstants = {
  uniqueKey: "id",
  itemSize: 60,
  rowPerPageOptions: [30, 50, 100],
  maxSelect: 300,
  hiddenColumns: {
    find: ["id", "uid", "version", "locale", "status", "message"],
    replace: ["id", "uid", "version", "locale"],
    publish: ["id", "uid", "fieldName", "value"],
  },
  tableInitState: {
    skip: 0,
    limit: 30,
  },
};

const findreplaceDataTypes = {
  allowed: [
    "text",
    "json",
    "reference",
    "number",
    "isodate",
    "boolean",
    "link",
  ],
  notAllowed: ["file", "group", "global_field", "blocks", "taxonomy"],
};

const BASE_KEYS = {
  ENTRY: [
    "uid",
    "_version",
    "tags",
    "url",
    "title",
    "locale",
    "updated_at",
    "created_at",
  ],
  ASSET: [
    "content_type",
    "created_at",
    "is_dir",
    "name",
    "tags",
    "uid",
    "updated_at",
    "_version",
    "url",
    "title",
    "filename",
    "file_size",
    "description",
  ],
};

const constants = {
  MENU,
  FindReplaceColumns,
  scrollTableConstants,
  findTableConstants,
  findreplaceDataTypes,
  BASE_KEYS,
};

export default constants;
