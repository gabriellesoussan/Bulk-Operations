import React, { useEffect, useState } from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Button,
  FieldLabel,
  Checkbox,
  Radio,
  Help,
  Select,
  Icon,
  cbModal,
  InstructionText,
} from "@contentstack/venus-components";
import parse from "html-react-parser";
import ReleaseService from "services/Release";
import releaseUtils from "common/utils/Release";
import utils from "common/utils";
import localeTexts from "common/locale/en-us";
import InfoMessage from "components/InfoMessage";
import constants from "common/constants";
import CreateReleaseModal from "../CreateReleaseModal";

function ReleaseModal({
  actionType,
  closeModal,
  incomingLocales,
  defaultLocale,
  selectedData,
  contentTypeUid,
  handleReset,
  getReleases,
  releaseVersion,
}: any) {
  const [locales, setLocales] = useState<any>([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [radioChecked, setRadioChecked] = useState("publish");
  const [selectedRelease, setSelectedRelease] = useState<any>();
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const [isSecBtnLoading, setIsSecBtnLoading] = useState<boolean>(false);
  const [relOptions, setRelOptions] = useState<any[]>([]);
  const [addRelDisable, setAddRelDisable] = useState<boolean>(true);
  const [itemCount, setItemCount] = useState<number>(selectedData?.length);

  useEffect(() => {
    if (defaultLocale && !locales?.includes(defaultLocale))
      setLocales([...locales, defaultLocale]);
  }, [defaultLocale]);

  const fetchLatestReleases = () =>
    getReleases()
      .then((releases: any[]) => setRelOptions(releases))
      .catch((error: any) =>
        console.error("Error: Release could not be fetched", error)
      );

  useEffect(() => {
    fetchLatestReleases();
  }, []);

  useEffect(() => {
    if (selectedRelease?.value && locales?.length) {
      setAddRelDisable(false);
    } else {
      setAddRelDisable(true);
    }
  }, [selectedRelease, locales]);

  const setLocale = ({ target }: any) => {
    if (actionType === localeTexts.Release.actionType.asset) {
      const reducedArr = [...locales];
      let finalLocales = [];
      const localeLength = target?.checked
        ? reducedArr?.length + 1
        : reducedArr?.length - 1;
      const checkLength =
        releaseVersion === 1
          ? constants.scrollTableConstants.maxSelect.release_v1
          : constants.scrollTableConstants.maxSelect.release_v2;
      if (selectedData?.length * localeLength <= checkLength) {
        setItemCount(selectedData?.length * localeLength);
        if (target?.checked && !locales?.includes(target?.value)) {
          finalLocales = [...locales, target?.value];
          setLocales(finalLocales);
          if (finalLocales?.length === incomingLocales?.length)
            setIsCheckedAll(true);
        } else {
          const index = reducedArr?.indexOf(target?.value);
          reducedArr?.splice(index, 1);
          setLocales(reducedArr);
          setIsCheckedAll(false);
        }
      } else
        utils.toastMessage({
          type: "error",
          text: localeTexts.Release.maxError.replace(
            "{{itemCount}}",
            `${checkLength}`
          ),
        });
    }
  };

  const setAllLanguage = () => {
    const checkLength =
      releaseVersion === 1
        ? constants.scrollTableConstants.maxSelect.release_v1
        : constants.scrollTableConstants.maxSelect.release_v2;
    if (selectedData?.length * incomingLocales?.length <= checkLength) {
      if (!isCheckedAll) {
        setItemCount(selectedData?.length * incomingLocales?.length);
        setLocales(incomingLocales?.map((l: any) => l?.code));
      } else {
        setItemCount(0);
        setLocales([]);
      }
      setIsCheckedAll(!isCheckedAll);
    } else
      utils.toastMessage({
        type: "error",
        text: localeTexts.Release.maxError.replace(
          "{{itemCount}}",
          `${checkLength}`
        ),
      });
  };

  const handleReleaseAction = (e: any) => {
    setRadioChecked(e?.target?.id);
  };

  const handleRelease = async ({ ref }: { ref: boolean }) => {
    if (!ref) setIsSecBtnLoading(true);
    else setIsBtnLoading(true);
    const releaseItems = releaseUtils.transformReleaseItems(
      selectedData,
      contentTypeUid,
      radioChecked,
      locales
    );
    const { type, text } = await ReleaseService.addItemsToRelease(
      releaseItems,
      selectedRelease?.value,
      radioChecked,
      locales,
      releaseVersion,
      ref
    );
    if (!ref) setIsSecBtnLoading(false);
    else setIsBtnLoading(false);
    closeModal();
    utils.toastMessage({ type, text });
    handleReset();
  };

  const updateReleaseOptions = (data: any) => {
    const createdRelease = releaseUtils.getReleaseOptions([data]);
    setSelectedRelease(createdRelease?.[0]);
    setRelOptions([...relOptions, ...createdRelease]);
  };

  const openCreateReleaseModal = () =>
    cbModal({
      // eslint-disable-next-line
      component: (props: any) => (
        <CreateReleaseModal
          closeModal={props?.closeModal}
          updateReleaseOptions={updateReleaseOptions}
        />
      ),
      modalProps: {
        size: "small",
        shouldCloseOnOverlayClick: true,
        shouldCloseOnEscape: true,
      },
    });

  return (
    <div className="modal-wrapper">
      <ModalHeader
        title={localeTexts.Release.modalHeader}
        closeModal={closeModal}
      />
      <ModalBody className="add-release-modal-body">
        {actionType === localeTexts.Release.actionType.entry && (
          <InfoMessage
            content={
              releaseVersion === 1
                ? parse(localeTexts.Release.versionInfo.v1)
                : parse(localeTexts.Release.versionInfo.v2)
            }
            type="light"
            className="version-info"
          />
        )}
        <div>
          <FieldLabel htmlFor="Publish" required version="v2">
            {localeTexts.Release.addRelease.select.label}
          </FieldLabel>
          <Select
            onChange={(relOp: any) => setSelectedRelease(relOp)}
            options={relOptions}
            placeholder={localeTexts.Release.addRelease.select.placeholder}
            value={selectedRelease}
            version="v2"
            hasAddOption
            addOptionText={
              <>
                <Icon icon="Plus" className="plusIcon" />
                {localeTexts.Release.createRelease.addOption}
              </>
            }
            addOption={openCreateReleaseModal}
            onMenuOpen={() => fetchLatestReleases()}
          />
          <InstructionText>
            {localeTexts.Release.addRelease.select.instruction}
          </InstructionText>
        </div>
        <div>
          <FieldLabel htmlFor="locales" required version="v2">
            {localeTexts.Release.addRelease.language.label}
          </FieldLabel>
          <Help
            text={localeTexts.Release.addRelease.language.help}
            type="primary"
          />
          <div className="all-locale-wrapper">
            <Checkbox
              onClick={setAllLanguage}
              label={localeTexts.Release.addRelease.language.all}
              checked={isCheckedAll}
              disabled={actionType === localeTexts.Release.actionType.entry}
            />
          </div>
          <div className="checkbox-container">
            {incomingLocales?.map((res: any) => (
              <div key={res?.code} className="Checkbox-wrapper">
                <Checkbox
                  checked={locales?.includes(res?.code)}
                  onClick={setLocale}
                  label={res?.name}
                  value={res?.code}
                  disabled={
                    actionType === localeTexts.Release.actionType.entry &&
                    !locales?.includes(res?.code)
                  }
                />{" "}
                {!res?.fallback_locale && (
                  <span className="master-language">(M)</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="Publish" required version="v2">
            {localeTexts.Release.addRelease.publish.label}
          </FieldLabel>
          <Help
            text={localeTexts.Release.addRelease.publish.help}
            type="primary"
          />
          <div className="radio-container">
            <Radio
              name="option"
              checked={radioChecked === "publish"}
              onChange={handleReleaseAction}
              id="publish"
              label={localeTexts.Release.addRelease.action.publish}
              className="checkBox"
            />
            <Radio
              name="option"
              checked={radioChecked === "unpublish"}
              onChange={handleReleaseAction}
              id="unpublish"
              label={localeTexts.Release.addRelease.action.unpublish}
              className="checkBox"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="tertiary" onClick={closeModal} version="v2">
            {localeTexts.Release.addRelease.btn.cancel}
          </Button>
          {releaseVersion === 1 ||
          actionType === localeTexts.Release.actionType.asset ? (
            <Button
              buttonType="primary"
              version="v2"
              onClick={() => handleRelease({ ref: true })}
              isLoading={isBtnLoading}
              disabled={addRelDisable}
            >
              {localeTexts.Release.addRelease.btn.add}
            </Button>
          ) : (
            <>
              <Button
                buttonType="secondary"
                version="v2"
                onClick={() => handleRelease({ ref: false })}
                isLoading={isSecBtnLoading}
                disabled={addRelDisable}
                loadingColor="#6c5ce7"
              >
                {localeTexts.Release.addRelease.btn.addWithoutRef}
              </Button>
              <Button
                buttonType="primary"
                version="v2"
                onClick={() => handleRelease({ ref: true })}
                isLoading={isBtnLoading}
                disabled={addRelDisable}
              >
                {localeTexts.Release.addRelease.btn.addWithRef}
              </Button>
            </>
          )}
        </ButtonGroup>
        <div>
          <span className="footer-stats">
            {actionType === localeTexts.Release.actionType.entry
              ? localeTexts.Release.entriesAdding
              : localeTexts.Release.assetsAdding}
            <span className="qty-bubble">{itemCount}</span>
          </span>
        </div>
      </ModalFooter>
    </div>
  );
}

export default ReleaseModal;
