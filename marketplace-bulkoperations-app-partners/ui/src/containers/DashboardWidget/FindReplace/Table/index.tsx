import React, { useEffect, useState } from "react";
import { InfiniteScrollTable } from "@contentstack/venus-components";
import { TypeInfinteProps } from "common/types";
import findReplaceUtils from "common/utils/FindReplace";
import localeTexts from "../../../../common/locale/en-us";
import constants from "../../../../common/constants";

const InfinteTable: React.FC<TypeInfinteProps> = function ({
  data,
  fetchData,
  itemStatusMap,
  totalCounts,
  loading,
  getSelectedRow,
  operation,
  isTableSelect,
  tableSearchText,
  regionURL,
  selectedContentType,
  locale,
  initialSelectedIds,
  tableRef,
  initialPageSize,
  resetSearch,
}) {
  const [hiddenColumns, setHiddenColumns] = useState<any[]>();

  useEffect(() => {
    switch (operation) {
      case "find":
        setHiddenColumns(constants.findTableConstants.hiddenColumns.find);
        break;
      case "replace":
        setHiddenColumns(constants.findTableConstants.hiddenColumns.replace);
        break;
      case "publish":
        setHiddenColumns(constants.findTableConstants.hiddenColumns.publish);
        break;
      default:
    }
  }, [operation]);

  return (
    <InfiniteScrollTable
      data={data}
      columns={constants.FindReplaceColumns}
      columnSelector
      hiddenColumns={hiddenColumns}
      uniqueKey={constants.findTableConstants.uniqueKey}
      loading={loading}
      fetchTableData={fetchData}
      totalCounts={totalCounts}
      initialSelectedRowIds={initialSelectedIds}
      itemStatusMap={itemStatusMap}
      canSearch
      searchPlaceholder={localeTexts.FindReplace.Table.searchPlaceholder}
      searchValue={tableSearchText}
      resetSearch={resetSearch}
      canRefresh={operation === "find"}
      itemSize={constants.findTableConstants.itemSize}
      name={localeTexts.FindReplace.Table.name}
      showSelected={operation !== "find"}
      isRowSelect={isTableSelect}
      fullRowSelect
      emptyObj={localeTexts.FindReplace.Table.emptyObj}
      getSelectedRow={getSelectedRow}
      onHoverActionList={findReplaceUtils.getHoverActions({
        operation,
        regionURL,
        selectedContentType,
        locale,
      })}
      rowDisableProp={{
        key: "status",
        value: localeTexts.FindReplace.Message.operation.unsuccess.status,
      }}
      v2Features={{
        pagination: true,
        tableRowAction: true,
        canFreezeCheckbox: true,
        isNewEmptyState: true,
      }}
      rowPerPageOptions={constants.findTableConstants.rowPerPageOptions}
      maxSelect={constants.findTableConstants.maxSelect}
      initialPageSize={initialPageSize}
      tableInstanceRef={tableRef}
      testId="find-replace-table"
    />
  );
};

export default InfinteTable;
