import React, { useState } from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Button,
  FieldLabel,
  TextInput,
  Textarea,
} from "@contentstack/venus-components";
import ReleaseService from "services/Release";
import utils from "common/utils";
import localeTexts from "common/locale/en-us";
import { debounce } from "lodash";

function CreateReleaseModal({ closeModal, updateReleaseOptions }: any) {
  const [releaseName, setReleaseName] = useState<string>();
  const [releaseDesc, setReleaseDesc] = useState<string>();
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);

  const handleTextInput = debounce((e: any) => {
    const { name, value } = e?.target ?? {};
    if (name === "releaseName") {
      setReleaseName(value);
    } else {
      setReleaseDesc(value);
    }
  }, 500);

  const handleCreateRelease = async () => {
    setIsBtnLoading(true);
    const { type, text, data } = await ReleaseService.createRelease({
      releaseName,
      releaseDescription: releaseDesc ?? "",
    });
    setIsBtnLoading(false);
    closeModal();
    if (type === "success") {
      updateReleaseOptions(data);
    }
    utils.toastMessage({ type, text });
  };

  return (
    <div className="modal-wrapper">
      <ModalHeader
        title={localeTexts.Release.createRelease.modal.title}
        closeModal={closeModal}
      />
      <ModalBody className="create-release">
        <div>
          <FieldLabel
            htmlFor="relase-name"
            required
            requiredText={localeTexts.Release.createRelease.modal.requiredLabel}
            version="v2"
          >
            {localeTexts.Release.createRelease.modal.nameLabel}
          </FieldLabel>
          <TextInput
            onChange={handleTextInput}
            placeholder={
              localeTexts.Release.createRelease.modal.namePlaceholder
            }
            value={releaseName}
            name="releaseName"
            type="text"
            version="v2"
            width="full"
          />
        </div>
        <div>
          <FieldLabel htmlFor="relase-description" version="v2">
            {localeTexts.Release.createRelease.modal.descLabel}
          </FieldLabel>
          <Textarea
            id="release-description"
            name="releaseDescription"
            value={releaseDesc}
            onChange={handleTextInput}
            placeholder={
              localeTexts.Release.createRelease.modal.descPlaceholder
            }
            rows={2}
            version="v2"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="secondary" onClick={closeModal} version="v2">
            {localeTexts.Release.createRelease.modal.cancelBtn}
          </Button>
          <Button
            buttonType="primary"
            icon="SaveWhite"
            disabled={!releaseName?.length}
            onClick={handleCreateRelease}
            isLoading={isBtnLoading}
            version="v2"
          >
            {localeTexts.Release.createRelease.modal.createBtn}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </div>
  );
}

export default CreateReleaseModal;
