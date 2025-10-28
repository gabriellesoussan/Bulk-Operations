import React, { useState } from "react";
import { Icon, Tooltip } from "@contentstack/venus-components";
import assetUtils from "common/utils/Asset";
import localeTexts from "common/locale/en-us";
import "./style.scss";

function AssetUploadingModal({
  storedAssets,
  rejectedAssets,
  handleModalCancel,
}: any) {
  const [minimize, setMinimize] = useState<boolean>(false);

  const handleMaxMin = () => setMinimize(!minimize);

  return (
    <div className={`upload-modal ${minimize ? "display-none" : ""}`}>
      <div
        className={`upload-modal-header ${
          rejectedAssets?.length
            ? "Warning-modal-header"
            : "Success-modal-header"
        }`}
      >
        <div className="flex-v">
          <Icon
            icon={rejectedAssets?.length ? "Warning" : "Success"}
            size="original"
          />
          <p>
            {!storedAssets?.length && rejectedAssets?.length
              ? localeTexts.Asset.uploadModal.uploading_failed_label.replace(
                  "{{failedNum}}",
                  rejectedAssets?.length
                )
              : `${localeTexts.Asset.uploadModal.header_label.replace(
                  "{{successNum}}",
                  storedAssets?.length
                )}${
                  rejectedAssets?.length
                    ? localeTexts.Asset.uploadModal.failed_label.replace(
                        "{{failedNum}}",
                        rejectedAssets?.length
                      )
                    : ""
                }`}
          </p>
        </div>
        <div className="flex-v">
          <div className="icon-chevron" onClick={handleMaxMin}>
            <Icon
              icon={
                minimize ? "ChevronUpTransparent" : "ChevronDownTransparent"
              }
            />
          </div>
          <div className="icon-cancel" onClick={handleModalCancel}>
            <Icon icon="CancelTransparent" />
          </div>
        </div>
      </div>
      <ul className="upload-modal-body">
        {storedAssets?.map((asset: any) => (
          <li className="upload-asset-element" key={asset?.uid}>
            <Tooltip
              content={asset?.filename ?? asset?.fileName}
              position="top"
            >
              <p className="upload-asset-name">
                {asset?.filename ?? asset?.fileName}
              </p>
            </Tooltip>

            <p className="upload-asset-details">
              <span>
                {assetUtils.bytesToSize(asset?.fileSize)}/
                <b>{assetUtils.bytesToSize(asset?.fileSize)}</b>
              </span>
              <Icon icon="Success" size="original" />
            </p>
          </li>
        ))}
        {rejectedAssets?.map((asset: any) => (
          <li className="upload-asset-element" key={asset?.uid}>
            <Tooltip content={asset?.file?.name ?? "--"} position="top">
              <p className="upload-asset-name">{asset?.file?.name ?? "--"}</p>
            </Tooltip>
            <p className="upload-asset-details">
              <span className="failed-upload-message">
                {asset?.message ?? "--"}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AssetUploadingModal;
