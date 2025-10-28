const axios = require("axios");
const constants = require("../constants");
const utils = require("../utils");

const BULK_CHECK_VERSION_DATA = {
  releaseId: "123456789",
  action: "publish",
  locales: "en-us",
  data: {
    items: [
      {
        uid: "123456789",
        version: 1,
        entry_locale: "en-us",
        locale: "en-us",
        content_type_uid: "release_v2_check",
        action: "publish",
      },
    ],
  },
};

const _makeThirdPartyApiCall = async (axiosReqObj) => {
  const response = await axios(axiosReqObj);
  return response?.data;
};

const _getHeaders = ({ stack_apiKey, oauth_data: { access_token } }) => {
  return {
    "Content-Type": "application/json",
    api_key: stack_apiKey,
    authorization: access_token,
  };
};

const createRelease = async (data, authData) => {
  if (!authData)
    throw Object.assign(new Error(constants.HTTP_TEXTS.AUTHDATA_MISSING), {
      statusCode: constants.HTTP_CODES.BAD_REQ,
    });
  const response = await _makeThirdPartyApiCall({
    url: `${authData?.baseUrl ?? ""}/v3/releases`,
    method: "POST",
    data,
    headers: _getHeaders(authData),
  });
  console.info(constants.LOGS.CREATE_RELEASE, response);
  return { releaseMessage: response?.notice, releaseData: response?.release };
};

const addItemsInBatches = async (items, authData, releaseId) => {
  const response = await _makeThirdPartyApiCall({
    url: `${authData?.baseUrl ?? ""}${constants.RELEASES.V1.URL.replace(
      "{releaseId}",
      releaseId
    )}`,
    method: constants.API_METHODS.POST,
    data: items,
    headers: _getHeaders(authData),
  });
  console.info(constants.LOGS.ADD_RELEASE, response);
  return response?.notice;
};

const handleBatches = async ({
  items,
  batchSize,
  concurrencyLimit,
  batchApiCall,
}) => {
  const batches = [];
  const successBatches = [];

  for (let i = 0; i < items?.length; i += batchSize) {
    batches?.push(items?.slice(i, i + batchSize));
  }

  for (let i = 0; i < batches?.length; i += concurrencyLimit) {
    const batchGroup = batches?.slice(i, i + concurrencyLimit);

    const response = await Promise.all(
      batchGroup?.map((batch) => batchApiCall(batch))
    );
    successBatches?.push(...response);

    if (i + concurrencyLimit < batches?.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  console.info(constants.LOGS.BATCH_SUCCESS, successBatches);
  return constants.HTTP_TEXTS.ADD_RELEASE_SUCCESS;
};

const addToRelease = async (data, authData, releaseId) => {
  const items = data?.items ?? [];

  try {
    const response = await handleBatches({
      items,
      batchSize: constants.RELEASES.V1.BATCH_SIZE,
      concurrencyLimit: constants.API_METHODS.CONCURRENCY_LIMIT,
      batchApiCall: (batch) =>
        addItemsInBatches({ items: batch }, authData, releaseId),
    });
    return response;
  } catch (error) {
    console.error(constants.LOGS.BATCH_UNSUCCESS, error?.response);
    const data = error?.response?.data;
    throw Object.assign(
      new Error(
        `${constants.HTTP_TEXTS.ADD_RELEASE_ERROR} ${
          data?.errors ? Object.values(data?.errors)?.[0] : ""
        }`.trim()
      ),
      {
        statusCode: constants.HTTP_CODES.SOMETHING_WRONG,
        details: data?.errors
          ? utils.getStringifiedError(data?.errors)
          : constants.HTTP_TEXTS.ADD_RELEASE_ERROR,
      }
    );
  }
};

const bulkBatches = async (
  items,
  authData,
  releaseId,
  reference,
  action,
  locales
) => {
  try {
    console.info("Bulk v2 sent data :: ", {
      url: `${authData?.baseUrl ?? ""}${constants.RELEASES.V2.URL}`,
      method: constants.API_METHODS.POST,
      data: {
        release: releaseId,
        reference,
        action,
        locale: locales,
        ...items,
      },
      headers: {
        ..._getHeaders(authData),
        bulk_version: constants.RELEASES.V2.BULK_VERSION,
      },
    });
    const response = await _makeThirdPartyApiCall({
      url: `${authData?.baseUrl ?? ""}${constants.RELEASES.V2.URL}`,
      method: constants.API_METHODS.POST,
      data: {
        release: releaseId,
        reference,
        action,
        locale: locales,
        ...items,
      },
      headers: {
        ..._getHeaders(authData),
        bulk_version: constants.RELEASES.V2.BULK_VERSION,
      },
    });
    console.info(constants.LOGS.ADD_RELEASE, response);
    console.info(constants.LOGS.BULK_SUCCESS, response?.notice);
    return response?.notice;
  } catch (error) {
    console.error("Error: in bulk batch", error?.response);
    throw error;
  }
};

const bulkAddToRelease = async (
  data,
  authData,
  releaseId,
  action,
  locales,
  reference,
  releaseVersionCheck = false
) => {
  if (!authData)
    throw Object.assign(new Error(constants.HTTP_TEXTS.AUTHDATA_MISSING), {
      statusCode: constants.HTTP_CODES.BAD_REQ,
    });
  const items = data?.items ?? [];

  try {
    console.info("Params ::", {
      authData,
      releaseId,
      reference,
      action,
      locales,
    });
    const response = await handleBatches({
      items,
      batchSize: constants.RELEASES.V2.BATCH_SIZE,
      concurrencyLimit: constants.API_METHODS.CONCURRENCY_LIMIT,
      batchApiCall: (batch) =>
        bulkBatches(
          { items: batch },
          authData,
          releaseId,
          reference,
          action,
          locales
        ),
    });
    return response;
  } catch (error) {
    console.error(constants.LOGS.BULK_UNSUCCESS, error?.response);
    const data = error?.response?.data;
    if (releaseVersionCheck) {
      const statusCode = error?.response?.status;
      let version;
      if (statusCode === 403 && data?.errors?.releases_v2) {
        version = 1;
        console.info(constants.LOGS.RELEASE_VERSION_1);
      } else if (statusCode === 422) {
        version = 2;
        console.info(constants.LOGS.RELEASE_VERSION_2);
      } else throw error;

      return { message: constants.HTTP_TEXTS.CHECK_RELEASE_SUCCESS, version };
    }
    throw Object.assign(
      new Error(
        `${constants.HTTP_TEXTS.ADD_RELEASE_ERROR} ${
          data?.errors ? Object.values(data?.errors)?.[0] : ""
        }`.trim()
      ),
      {
        statusCode: constants.HTTP_CODES.SOMETHING_WRONG,
        details: data?.errors
          ? utils.getStringifiedError(data?.errors)
          : constants.HTTP_TEXTS.ADD_RELEASE_ERROR,
      }
    );
  }
};

const checkReleaseVersion = async (authData) => {
  try {
    const response = await bulkAddToRelease(
      BULK_CHECK_VERSION_DATA.data,
      authData,
      BULK_CHECK_VERSION_DATA.releaseId,
      BULK_CHECK_VERSION_DATA.action,
      BULK_CHECK_VERSION_DATA.locales,
      false,
      true
    );
    return response;
  } catch (error) {
    console.error(constants.LOGS.RELEASE_CHECK_UNSUCCESS, error?.response);
    if (error?.response?.data?.errors) {
      const { errors: catchError } = error?.response?.data;
      throw Object.assign(
        new Error(constants.HTTP_TEXTS.SOMETHING_WENT_WRONG),
        {
          statusCode: constants.HTTP_CODES.SOMETHING_WRONG,
          details: catchError
            ? utils.getStringifiedError(catchError)
            : constants.HTTP_TEXTS.SOMETHING_WENT_WRONG,
        }
      );
    }
    throw error;
  }
};

module.exports = {
  addToRelease,
  bulkAddToRelease,
  createRelease,
  checkReleaseVersion,
};
