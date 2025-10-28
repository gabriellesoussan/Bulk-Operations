import React from "react";
import { SkeletonTile } from "@contentstack/venus-components";
import entryUtils from "common/utils/Entry";
import ScrollTable from "components/ScrollTable";
import "./style.scss";

const Skeleton: React.FC = function () {
  return (
    <div className="bulkop-skeleton">
      <div className="skeleton-tile-flex">
        <SkeletonTile
          numberOfTiles={1}
          tileBottomSpace={10}
          tileHeight={15}
          tileRadius={5}
          tileTopSpace={10}
          tileWidth={500}
          tileleftSpace={10}
        />
      </div>
      <ScrollTable
        isDisplayTable
        displayTableData={[]}
        loading
        totalCounts={10}
        columns={[
          {
            Header: "",
            id: "column1",
            accessor: "column1",
            columnWidthMultiplier: 2,
          },
          {
            Header: "",
            id: "column2",
            accessor: "column2",
            columnWidthMultiplier: 2,
          },
          {
            Header: "",
            id: "column3",
            accessor: "column3",
            columnWidthMultiplier: 2,
          },
          {
            Header: "",
            id: "column4",
            accessor: "column4",
            columnWidthMultiplier: 2,
          },
        ]}
        emptyHeading={entryUtils.entryTableEmptyHeading}
        uniqueKey="id"
      />
    </div>
  );
};

export default Skeleton;
