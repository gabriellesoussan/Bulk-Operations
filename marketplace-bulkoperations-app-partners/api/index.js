require("dotenv").config({ path: "./.env" });
const constants = require("./constants");
const utils = require("./utils");
const {
  addToRelease,
  createRelease,
  checkReleaseVersion,
  bulkAddToRelease,
} = require("./handler");

exports.handler = async ({ queryStringParameters: query, body }) => {
  let message;
  let responseData = {};
  let statusCode = constants.HTTP_CODES.OK;
  console.info(constants.LOGS.QUERY_PARAMS, query);
  console.info(constants.LOGS.REQ_BODY, body);
  try {
    if (typeof body === "string") body = JSON.parse(body);
    if (utils.isEmpty(query)) {
      throw Object.assign(new Error(constants.HTTP_TEXTS.QUERY_MISSING), {
        statusCode: constants.HTTP_CODES.BAD_REQ,
      });
    }
    const regionMapping = JSON.parse(process.env.REGION_MAPPING ?? "");
    const authserviceData = {
      stack_apiKey: process.env.STACK_API_KEY,
      baseUrl: regionMapping?.[query?.region ?? "NA"]?.API_URL,
      oauth_data: { access_token: process.env.STACK_MANAGEMENT_TOKEN },
    };

    switch (query?.type) {
      case constants.QUERY.ADD_RELEASE:
        if (query?.version === "1") {
          message = await addToRelease(body, authserviceData, query?.releaseId);
        } else {
          message = await bulkAddToRelease(
            body,
            authserviceData,
            query?.releaseId,
            query?.action,
            JSON.parse(query?.locales),
            query?.reference?.toLowerCase() === "true" ?? false
          );
        }
        break;
      case constants.QUERY.CREATE_RELEASE:
        const { releaseMessage, releaseData } = await createRelease(
          body,
          authserviceData
        );
        message = releaseMessage;
        responseData = releaseData;
        break;
      case constants.QUERY.RELEASE_VERSION:
        const { message: resMessage, version } = await checkReleaseVersion(
          authserviceData
        );
        message = resMessage;
        responseData = {
          release_version: version,
        };
        break;
      default:
        throw Object.assign(new Error(constants.HTTP_TEXTS.BAD_REQUEST), {
          statusCode: constants.HTTP_CODES.BAD_REQ,
        });
    }
  } catch (e) {
    statusCode = e?.statusCode ?? constants.HTTP_CODES.SOMETHING_WRONG;
    const data = e?.response?.data;
    message = data
      ? `${data?.error_message} ${utils.getStringifiedError(data?.errors)}`
      : e?.message ?? constants.HTTP_TEXTS.SOMETHING_WENT_WRONG;
    console.error("ERROR: ", e?.response?.data);
    console.error(
      `ERROR: stack_api_key: ${authserviceData?.stack_apiKey}, status_code: ${statusCode}, error_message: ${message}`
    );
    responseData = {
      error_details: e?.details,
    };
  }
  return utils.getResponseObject(statusCode, query, {
    message,
    data: responseData,
  });
};
