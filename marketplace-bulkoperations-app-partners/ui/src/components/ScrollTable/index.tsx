import React, { useEffect, useRef, useState } from "react";
import { InfiniteScrollTable } from "@contentstack/venus-components";
import utils from "common/utils";
import constants from "common/constants";
import assetUtils from "common/utils/Asset";
import entryUtils from "common/utils/Entry";

const ScrollTable = React.memo(
  ({
    isShowSelected,
    selectedEntries = [],
    selectedContentType,
    getTableData,
    columns,
    searchPlaceholder,
    isRowSelect,
    fullRowSelect,
    getSelectedRow,
    emptyHeading,
    uniqueKey,
    onRowSelectProp,
    name,
    onHoverActionList,
    initialSelectedRowIds,
    tableType,
    handleBreadCrum,
    currentFolder,
    setCurrentFolder,
    searchTableData,
    rowDisable,
    maxSelect,
    initPage,
    isDisplayTable,
    displayTableData,
    columnsOrder,
  }: any) => {
    const [currentData, setCurrentData] = useState<any>([]);
    const [itemStatusMap, setItemStatusMap] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCounts, setTotalCounts] = useState<number>(0);
    const [tableSearchText, setTableSearchText] = useState<string>("");
    const [resetSearch, setResetSearch] = useState<boolean>(false);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [searchData, setSearchData] = useState<any[]>([]);
    const [emptyTableHeading, setEmptyTableHeading] =
      useState<any>(emptyHeading);
    const [refreshEnabled, setRefreshEnabled] = useState<boolean>(false);
    const tableRef: any = useRef(null);

    useEffect(() => {
      if (tableRef?.current?.pageSize)
        tableRef?.current?.setTablePageSize(tableRef?.current?.pageSize);
    }, [initPage]);

    useEffect(() => {
      if (!isDisplayTable && (selectedContentType || tableType === "assets"))
        setRefreshEnabled(true);
      else setRefreshEnabled(false);
    }, [selectedContentType, isDisplayTable]);

    const fetchData = async (
      { skip, limit, sortBy, fetchCalledByTable, searchText }: any,
      folderUid?: string
    ) => {
      try {
        if (!fetchCalledByTable) tableRef?.current?.setTablePage(1);
        setLoading(true);
        setTotalCounts(limit);
        let response: any = { count: 0, [tableType]: [] };
        if (searchText) {
          setTableSearchText(searchText);
          response = await utils.handleBatches({
            skip,
            limit,
            tableType,
            batchApiCall: searchTableData,
            params: {
              contenttype: selectedContentType,
              searchText,
              sortBy,
              folderUid: currentFolder,
            },
          });
        } else {
          setTableSearchText("");
          response = await utils.handleBatches({
            skip,
            limit,
            tableType,
            batchApiCall: getTableData,
            params: {
              contenttype: selectedContentType,
              sortBy,
              folderUid: folderUid ?? currentFolder,
            },
          });
        }
        setCurrentData(response?.[tableType] ?? []);
        setTotalCounts(response?.count ?? 0);
        if (!response?.count) {
          if (tableType === "assets")
            setEmptyTableHeading(assetUtils.assetEmptyHeading);
          else if (tableType === "entries")
            setEmptyTableHeading(entryUtils.entryTableEmptyHeading);
          else if (searchText) setEmptyTableHeading(utils.searchEmptyHeading);
        }
        setItemStatusMap(utils.createLoadedObject(response?.count));
        setLoading(false);
      } catch (error) {
        console.error("Error: ScrollTable FetchData", error);
      }
    };

    const resetSearchFn = async () => {
      await setTableSearchText("");
      setIsSearch(false);
      setSearchData([]);
      setResetSearch(true);
      setTimeout(() => {
        setResetSearch(false);
      }, 1000);
    };

    useEffect(() => {
      if (!selectedContentType) {
        setEmptyTableHeading(emptyHeading);
        setCurrentData([]);
      }
      resetSearchFn();
      if (isDisplayTable) {
        setLoading(true);
        if (displayTableData?.length) {
          setTotalCounts(displayTableData?.length);
          setCurrentData(displayTableData);
          setLoading(false);
        }
      } else {
        if (selectedContentType || (tableType === "assets" && currentFolder)) {
          setCurrentData([]);
          fetchData(
            {
              ...constants.scrollTableConstants.tableInitState,
              limit:
                tableRef.current.pageSize ??
                constants.scrollTableConstants.tableInitState.limit,
            },
            currentFolder
          );
          return;
        }
        setCurrentData([]);
        setTotalCounts(0);
        setItemStatusMap({});
        setLoading(false);
      }
    }, [
      selectedContentType,
      tableType,
      currentFolder,
      isDisplayTable,
      displayTableData,
    ]);

    const onRowClick = (item: any) => {
      if (item?.is_dir) {
        handleBreadCrum(item);
        setCurrentFolder(item?.uid);
      }
    };

    const emptySearch = () => {
      setIsSearch(false);
      setSearchData([]);
      setTotalCounts(0);
      setItemStatusMap({});
    };

    const handleSearch = ({ searchText }: any) => {
      if (searchText) {
        setLoading(true);
        const regex: any = utils.createSafeRegex(searchText, "gi");
        if (!regex) {
          emptySearch();
          setLoading(false);
          return;
        }
        const searchDataArr = displayTableData?.filter((data: any) =>
          data?.title?.match(regex)
        );
        if (searchDataArr?.length) {
          const itemStatus = utils.createLoadedObject(searchDataArr?.length);
          setIsSearch(true);
          setSearchData(searchDataArr);
          setTotalCounts(searchDataArr?.length);
          setItemStatusMap(itemStatus);
        } else {
          emptySearch();
        }
        setLoading(false);
      }
    };

    return (
      <InfiniteScrollTable
        data={
          // eslint-disable-next-line
          isSearch ? searchData : isShowSelected ? selectedEntries : currentData
        }
        columns={columns}
        columnsOrder={columnsOrder}
        columnSelector
        hiddenColumns={constants.scrollTableConstants.hiddenColumns}
        uniqueKey={uniqueKey}
        loading={loading}
        fetchTableData={
          isShowSelected || isDisplayTable ? handleSearch : fetchData
        }
        totalCounts={
          // eslint-disable-next-line
          isShowSelected
            ? isSearch
              ? searchData?.length
              : selectedEntries?.length
            : totalCounts
        }
        initialSelectedRowIds={isDisplayTable ? {} : initialSelectedRowIds}
        itemStatusMap={itemStatusMap}
        canSearch
        searchValue={tableSearchText}
        resetSearch={resetSearch}
        searchPlaceholder={searchPlaceholder}
        canRefresh={refreshEnabled}
        itemSize={constants.scrollTableConstants.itemSize}
        showSelected={isShowSelected || isDisplayTable}
        isRowSelect={isRowSelect && !isDisplayTable}
        fullRowSelect={fullRowSelect && !isDisplayTable}
        emptyHeading={emptyTableHeading}
        getSelectedRow={getSelectedRow}
        onRowSelectProp={isDisplayTable ? {} : onRowSelectProp}
        name={name}
        onHoverActionList={onHoverActionList}
        rowSelectCheckboxProp={
          tableType === "assets"
            ? {
                key: "is_dir",
                value: false,
              }
            : {}
        }
        rowDisableProp={rowDisable}
        onRowClick={onRowClick}
        maxSelect={maxSelect}
        v2Features={{
          pagination: true,
          tableRowAction: true,
          canFreezeCheckbox: true,
          isNewEmptyState: true,
        }}
        rowPerPageOptions={constants.scrollTableConstants.rowPerPageOptions}
        initialPage={initPage}
        initialPageSize={constants.scrollTableConstants.tableInitState.limit}
        tableInstanceRef={tableRef}
      />
    );
  }
);

export default ScrollTable;
