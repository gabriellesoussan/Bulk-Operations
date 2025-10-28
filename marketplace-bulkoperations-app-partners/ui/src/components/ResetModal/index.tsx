import React from "react";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";

const ResetModal: React.FC<any> = function ({ closeModal, resetValues }: any) {
  return (
    <div className="ResetModal">
      <ModalHeader
        title={localeTexts.FindReplace.Modal.reset.title}
        closeModal={closeModal}
      />
      <ModalBody className="modalBodyCustomClass resetModalBody">
        {localeTexts.FindReplace.Modal.reset.body}
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" version="v2" onClick={() => closeModal()}>
            {localeTexts.FindReplace.Button.text.cancel}
          </Button>
          <Button
            iconAlignment="left"
            icon="ResetWhite"
            version="v2"
            onClick={() => {
              resetValues();
              closeModal();
            }}
          >
            {" "}
            {localeTexts.FindReplace.Button.text.reset}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </div>
  );
};

export default ResetModal;
