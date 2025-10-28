import localeTexts from "../../common/locale/en-us";

const getEntries = async ({
  fieldValue,
  findQuery,
  stack,
  contentTypeValue,
  localeValue,
  sortBy,
  skip,
  limit,
  searchText,
}: any) => {
  let query: any = { [fieldValue?.label]: findQuery };
  if (fieldValue?.type === "reference") {
    query = findQuery;
  } else if (fieldValue?.type === "number") {
    query = { [fieldValue?.label]: parseInt(findQuery, 10) };
  }

  if (searchText) {
    const searchRegEx = {
      $regex: searchText?.replace(/[\\+*()]/g, "\\$&"),
      $options: "i",
    };
    if (query?.title) {
      query = {
        $and: [
          query,
          {
            title: searchRegEx,
          },
        ],
      };
    } else {
      query.title = searchRegEx;
    }
  }

  const entryQuery = stack
    .ContentType(contentTypeValue?.value)
    .Entry.Query()
    .language(localeValue?.value)
    .addQuery(`query`, { ...query })
    .addQuery("include_count", "true")
    .skip(skip)
    .limit(limit);

  if (sortBy?.sortingDirection && sortBy?.id)
    entryQuery.addQuery(`${sortBy?.sortingDirection}`, `${sortBy?.id}`);

  return entryQuery.find();
};

const getJsonEntries = ({
  stack,
  contentTypeValue,
  localeValue,
  findQuery,
}: any) =>
  stack?.search(
    {
      type: "entries",
      include_fields: true,
      query: {
        $and: [{ locale: { $eq: `${localeValue?.value}` } }],
        _content_type_uid: { $in: [`${contentTypeValue?.value}`] },
      },
      search: findQuery,
    },
    // eslint-disable-next-line
    stack?._data?.api_key
  );

const getEntriesWithUids = ({
  stack,
  contentTypeValue,
  localeValue,
  jsonEntryUid,
  skip,
  limit,
  searchText,
}: any) => {
  const Query: any = {
    locale: { $eq: `${localeValue?.value}` },
    uid: { $in: jsonEntryUid },
  };
  if (searchText) {
    Query.title = { $regex: searchText?.replace(/[\\+*()]/g, "\\$&") };
  }

  return stack
    .ContentType(contentTypeValue?.value)
    .Entry.Query()
    .language(localeValue?.value)
    .addQuery(`query`, Query)
    .addQuery("include_count", "true")
    .skip(skip)
    .limit(limit)
    .find();
};

const updateEntryData = async ({
  stack,
  contentTypeValue,
  entry,
  localeValue,
}: any) => {
  try {
    const response = await stack
      .ContentType(contentTypeValue?.value)
      .Entry(entry?.uid)
      .update(
        {
          entry,
        },
        localeValue?.value
      );
    return {
      status: response
        ? localeTexts.FindReplace.Message.operation.update.status
        : localeTexts.FindReplace.Message.operation.unsuccess.status,
      notice: response
        ? response?.notice
        : localeTexts.FindReplace.Message.operation.unsuccess.notice,
    };
  } catch (error: any) {
    const e = JSON.parse(error?.message);
    if (e?.data?.error_message) {
      console.error("Error: Update Entries", e?.data);
      let errorKeys: string[] = [];
      if (e?.data?.errors) {
        errorKeys = Object.keys(e?.data?.errors);
      }
      return {
        status: localeTexts.FindReplace.Message.operation.unsuccess.status,
        notice: errorKeys?.length
          ? `${e?.data?.error_message} ${errorKeys?.join(",")}.`
          : e?.data?.error_message,
      };
    }
    return localeTexts.FindReplace.Message.operation.unsuccess;
  }
};

const FindReplaceServices = {
  getEntries,
  getJsonEntries,
  getEntriesWithUids,
  updateEntryData,
};

export default FindReplaceServices;
