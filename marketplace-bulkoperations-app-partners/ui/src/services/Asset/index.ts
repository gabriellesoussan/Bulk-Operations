import constants from "common/constants";

const getAllAssets = ({
  stack,
  sortBy,
  skip,
  limit,
  folderUid = "cs_root",
}: any) => {
  const assetQuery = stack.Asset.Query()
    .addParam("folder", folderUid)
    .addParam("include_count", "true")
    .addParam("include_folders", "true")
    .addParam("include_publish_details", "true")
    .addQuery("only[BASE]", constants.BASE_KEYS.ASSET)
    .skip(skip)
    .limit(limit);

  if (sortBy?.sortingDirection && sortBy?.id)
    assetQuery.addQuery(`${sortBy?.sortingDirection}`, `${sortBy?.id}`);

  return assetQuery.find();
};

const searchAssets = async ({
  stack,
  searchText,
  folderUid = "cs_root",
  sortBy,
  skip,
  limit,
}: any) => {
  const assetQuery = stack.Asset.Query()
    .addParam("folder", folderUid)
    .regex("title", searchText?.replace(/[\\+*()]/g, "\\$&"), "i")
    .addParam("include_count", "true")
    .addParam("include_publish_details", "true")
    .addParam("include_folders", "false")
    .addQuery("only[BASE]", constants.BASE_KEYS.ASSET)
    .skip(skip)
    .limit(limit);

  if (sortBy?.sortingDirection && sortBy?.id)
    assetQuery.addQuery(`${sortBy?.sortingDirection}`, `${sortBy?.id}`);

  return assetQuery.find();
};

const publishAssets = async ({
  stack,
  environments,
  assetUid,
  locales,
  time,
}: any) => {
  const queryObj: any = {
    asset: {
      environments,
      locales,
    },
  };
  if (time) queryObj.scheduled_at = time;
  return stack.Asset(assetUid).publish(queryObj);
};

const unpublishAssets = async ({
  stack,
  environments,
  assetUid,
  locales,
  time,
}: any) => {
  const queryObj: any = {
    asset: {
      environments,
      locales,
    },
  };
  if (time) queryObj.scheduled_at = time;
  return stack.Asset(assetUid).unpublish(queryObj);
};

const deleteAssets = async ({ stack, assetUid }: any) =>
  stack.Asset(assetUid).delete();

const AssetService = {
  getAllAssets,
  searchAssets,
  publishAssets,
  unpublishAssets,
  deleteAssets,
};

export default AssetService;
