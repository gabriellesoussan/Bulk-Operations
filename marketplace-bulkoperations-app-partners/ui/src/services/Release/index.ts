import services from "services";

const generateResponse = ({ error, data }: any) => {
  let messageType = "";
  let messageText = "";
  if (!error) {
    messageType = "success";
    messageText = data?.message;
  } else {
    messageType = "error";
    messageText = data;
  }
  return {
    type: messageType,
    text: messageText,
    data: data?.data ?? {},
  };
};

const addItemsToRelease = async (
  items: any,
  releaseId: string[],
  action: string,
  locales: string[],
  version: number = 1,
  ref: boolean = false
) => {
  const response = await services.makeCMAApiCall({
    url: `${
      process.env.REACT_APP_API_URL ?? ""
    }?type=AddToRelease&releaseId=${releaseId}&action=${action}&locales=${JSON.stringify(
      locales
    )}&version=${version}&reference=${ref}`,
    method: "post",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: JSON.stringify({
      items,
    }),
  });

  return generateResponse(response);
};

const createRelease = async ({ releaseName, releaseDescription }: any) => {
  const response = await services.makeCMAApiCall({
    url: `${process.env.REACT_APP_API_URL ?? ""}?type=CreateRelease`,
    method: "post",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: JSON.stringify({
      release: {
        name: releaseName,
        description: releaseDescription,
        locked: false,
        archived: false,
      },
    }),
  });

  return generateResponse(response);
};

const checkReleaseVersion = async () => {
  const response = await services.makeCMAApiCall({
    url: `${process.env.REACT_APP_API_URL ?? ""}?type=ReleaseVersion`,
    method: "post",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  return generateResponse(response);
};

const ReleaseService = {
  addItemsToRelease,
  createRelease,
  checkReleaseVersion,
};

export default ReleaseService;
