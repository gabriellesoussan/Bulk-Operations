import constants from "common/constants";

const getEntries = async ({
  stack,
  contentTypeValue,
  sortBy,
  skip,
  limit,
  defaultLocale,
}: any) => {
  const entryQuery = stack
    .ContentType(contentTypeValue)
    .Entry.Query()
    .language(defaultLocale)
    .addQuery("only[BASE]", constants.BASE_KEYS.ENTRY)
    .addQuery("include_publish_details", "true")
    .addQuery("include_count", "true")
    .skip(skip)
    .limit(limit);

  if (sortBy?.sortingDirection && sortBy?.id)
    entryQuery.addQuery(`${sortBy?.sortingDirection}`, `${sortBy?.id}`);

  return entryQuery.find();
};

const searchEntries = async ({
  stack,
  contentTypeValue,
  defaultLocale,
  searchText,
  skip,
  limit,
  sortBy,
}: any) => {
  const entryQuery = stack
    .ContentType(contentTypeValue)
    .Entry.Query()
    .language(defaultLocale)
    .regex("title", searchText?.replace(/[\\+*()]/g, "\\$&"), "i")
    .addQuery("only[BASE]", constants.BASE_KEYS.ENTRY)
    .addQuery("include_publish_details", "true")
    .addQuery("include_count", "true")
    .skip(skip)
    .limit(limit);

  if (sortBy?.sortingDirection && sortBy?.id)
    entryQuery.addQuery(`${sortBy?.sortingDirection}`, `${sortBy?.id}`);

  return entryQuery.find();
};

const unpublishEntries = async ({
  stack,
  contentTypeValue,
  environments,
  entryUid,
  locales,
  time,
  defaultLocale,
}: any) => {
  const queryObj: any = {
    entry: {
      environments,
      locales,
    },
    locale: defaultLocale,
    publish_all_localized: true,
  };
  if (time) queryObj.scheduled_at = time;
  return stack
    .ContentType(contentTypeValue)
    .Entry(entryUid)
    .unpublish(queryObj, "3.2");
};

const deleteEntries = async ({
  stack,
  contentTypeValue,
  entryUid,
  defaultLocale,
}: any) =>
  stack
    .ContentType(contentTypeValue)
    .Entry(entryUid)
    .language(defaultLocale)
    .delete();

const EntryService = {
  getEntries,
  unpublishEntries,
  deleteEntries,
  searchEntries,
};

export default EntryService;
