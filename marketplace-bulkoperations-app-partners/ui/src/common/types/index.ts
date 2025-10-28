import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}
declare global {
  interface Window {
    heap: any;
  }
}
export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}
export interface TypeSDKData {
  location: any;
  appSdkInitialized: boolean;
}
export interface TypeEntryData {
  title: string; // This is just example. You can remove this field or add any fields as per your requirement from the Entry data of CMS
}

export interface Menu {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  className: string;
}

export interface TypeActionButtons {
  unpublishEntry: Function;
  publishEntry: Function;
  deleteEntry: Function;
  isLoadingPublishButton: boolean;
  isLoadingUnpublishButton: boolean;
  isLoadingDeleteButton: boolean;
  selectedContentType: any;
  selectedEntries: any[];
  clearFields: Function;
}

export interface TypeInfinteProps {
  itemStatusMap: any;
  data: any;
  totalCounts: any;
  loading: boolean;
  fetchData: (data: any) => void;
  getSelectedRow: Function;
  operation: string;
  isTableSelect: boolean;
  tableSearchText: string;
  regionURL: string;
  selectedContentType: any;
  locale: string;
  initialSelectedIds: any;
  tableRef: any;
  initialPageSize: number;
  resetSearch: boolean;
}

export interface TypeScrollTable {
  columns: any[];
  columnSelector: boolean;
  searchPlaceholder: string;
  isRowSelect: boolean;
  fullRowSelect: boolean;
  equalWidthColumns: boolean;
  getSelectedRow: any;
  emptyHeading: any;
  uniqueKey: string;
  initialSortBy: Object;
  searchProperty: string;
  onRowSelectProp: any[];
  name: any;
  onHoverActionList: any[];
  getTableData: Function;
  selectedContentType: any;
  limit: number;
}

export interface SelectOptions {
  label: string;
  value: string;
}

export interface TypeSelectOption {
  values: SelectOptions[];
  handleSelection: Function;
  value: string;
  isSearchable: boolean;
  placeholder: string;
  hideSelectedOptions: boolean;
}

export type Props = {
  [key: string]: any;
};
