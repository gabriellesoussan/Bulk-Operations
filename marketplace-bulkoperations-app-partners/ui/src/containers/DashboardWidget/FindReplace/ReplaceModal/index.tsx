import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";
import localeTexts from "../../../../common/locale/en-us";

const ReplaceModal: React.FC<any> = function (props: any) {
  const [replace, setReplace] = useState<any>();

  useEffect(() => {
    if (
      props?.contentField?.type === "boolean" ||
      props?.contentField?.type === "reference"
    ) {
      setReplace({
        to: props?.findValue?.label,
        with: props?.replaceValue?.label,
      });
    } else {
      setReplace({
        to: props?.findValue,
        with: props?.replaceValue,
      });
    }
  }, []);

  return (
    <div className="replaceModal">
      <ModalHeader
        title={localeTexts.FindReplace.Modal.replace.title}
        closeModal={props?.closeModal}
      />
      <ModalBody className="modalBodyCustomClass replaceModalBody">
        {replace && (
          <p>
            {localeTexts.FindReplace.Modal.replace.body.text1}
            <b>
              {" "}
              &quot;
              {replace?.to}
              &quot;
            </b>{" "}
            {localeTexts.FindReplace.Modal.replace.body.text2}
            <b>
              {" "}
              &quot;
              {replace?.with}
              &quot;
            </b>{" "}
            {localeTexts.FindReplace.Modal.replace.body.text3}
            <b> &quot;{props?.selectedUids?.length ?? 0}&quot;</b>{" "}
            {props?.selectedUids?.length === 1
              ? localeTexts.FindReplace.Modal.replace.body.text4.singular
              : localeTexts.FindReplace.Modal.replace.body.text4.plural}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button
            buttonType="light"
            onClick={() => props?.closeModal()}
            version="v2"
          >
            {localeTexts.FindReplace.Button.text.cancel}
          </Button>
          <Button
            onClick={() => {
              props?.handleReplaceClick(props);
            }}
            buttonType="primary"
            iconAlignment="left"
            icon="ChangeVersion"
            version="v2"
          >
            {localeTexts.FindReplace.Button.text.replace}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </div>
  );
};

export default ReplaceModal;
