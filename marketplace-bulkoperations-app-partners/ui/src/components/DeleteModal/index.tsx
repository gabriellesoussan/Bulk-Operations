import React from "react";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Button,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";

function DeleteModal({
  handleActions,
  closeModal,
  modalType,
  defaultLocale,
}: any) {
  return (
    <>
      <ModalHeader
        title={
          modalType === "entries"
            ? localeTexts.Entry.deleteModal.title
            : localeTexts.Asset.deleteModal.title
        }
        closeModal={closeModal}
      />
      <ModalBody className="deleteModalBody">
        {modalType === "entries"
          ? `${localeTexts.Entry.deleteModal.confirmMessageS} "${defaultLocale}" ${localeTexts.Entry.deleteModal.confirmMessageE}`
          : localeTexts.Asset.deleteModal.confirmMessage}
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" version="v2" onClick={() => closeModal()}>
            {localeTexts.Entry.deleteModal.cancelButton.label}
          </Button>
          <Button
            icon="Delete"
            version="v2"
            loadingColor="#d62400"
            buttonType="delete"
            onClick={() => handleActions({ action: "delete", closeModal })}
          >
            {localeTexts.Entry.deleteModal.deleteButton.label}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
}

export default DeleteModal;
