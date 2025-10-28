import axios from "axios";
import localeTexts from "../common/locale/en-us";

const publishEntries = async ({
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
    .publish(queryObj, "3.2");
};

const makeApiCall = async (
  fnCall: Function,
  fnParams: any,
  operationType: string
) => {
  const status: any = { ...localeTexts.Message.status };
  try {
    const response = await fnCall(fnParams);
    return {
      status: response ? status[operationType] : status?.unsuccess,
      notice: response
        ? response?.notice
        : localeTexts.Message.unsuccess_notice,
    };
  } catch (error: any) {
    const e = JSON.parse(error?.message);
    if (e?.data?.error_message) {
      console.error("Error:", e?.data);
      return {
        status: status?.unsuccess,
        notice: e?.data?.error_message,
      };
    }
    return {
      status: status?.unsuccess,
      notice: localeTexts.Message.unsuccess_notice,
    };
  }
};

const makeCMAApiCall = async ({
  url,
  method,
  headers = undefined,
  data = undefined,
}: any) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers,
    });
    return { error: false, data: response?.data };
  } catch (e: any) {
    const { status, data: resData } = e?.response ?? {};
    console.error("Error:", resData);
    if (status === 500 || status === 429 || status === 401) {
      if (resData === "jwt expired")
        return {
          error: true,
          data: localeTexts.Warnings.sessionExpired,
        };
      if (typeof resData === "object")
        return {
          error: true,
          data: resData?.message ?? localeTexts.Warnings.somethingWentWrong,
        };
      return { error: true, data: resData };
    }
    return { error: true, data: localeTexts.Warnings.somethingWentWrong };
  }
};

const services = {
  publishEntries,
  makeApiCall,
  makeCMAApiCall,
};

export default services;
