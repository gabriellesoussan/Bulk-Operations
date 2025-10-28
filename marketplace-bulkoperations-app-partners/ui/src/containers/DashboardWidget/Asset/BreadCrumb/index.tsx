/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Icon, Link } from "@contentstack/venus-components";

function BreadCrumb({ breadCrumbArr, breadCrumbAction, disabled }: any) {
  return (
    <div
      className={`breadcrumb-wrapper ${disabled ? "breadcrumb-disabled" : ""}`}
    >
      {breadCrumbArr?.map((element: any) => (
        <>
          <Link
            cbOnClick={() => {
              if (!disabled) breadCrumbAction(element);
            }}
            className="breadcrumb-item"
            style={{
              cursor: "text",
            }}
            key={`link-${element?.name}`}
          >
            {element?.name}
          </Link>
          {element?.path !== breadCrumbArr?.length && (
            <Icon icon="CaretRight" version="v2" size="tiny" />
          )}
        </>
      ))}
    </div>
  );
}

export default BreadCrumb;
