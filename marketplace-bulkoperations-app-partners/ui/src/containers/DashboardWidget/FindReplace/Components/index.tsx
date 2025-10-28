import React, { useEffect, useState } from "react";
import {
  AsyncSelect,
  Button,
  FieldLabel,
  Select,
} from "@contentstack/venus-components";
import localeTexts from "common/locale/en-us";
import { Link } from "react-router-dom";
import utils from "common/utils";
import InputBuider from "../InputBuilder";

export const DropDown: React.FC<any> = function ({
  value,
  onChange,
  options,
  fieldName,
  isError,
  checkFunc,
  getContentTypeOptions,
}: any) {
  const [placeHolderText, setPlaceHolderText] = useState("");
  const [labelText, setLabelText] = useState("");

  useEffect(() => {
    switch (fieldName) {
      case localeTexts.FindReplace.FieldName.contentType:
        setPlaceHolderText(
          localeTexts.FindReplace.SelectFields.contentType.placeholder
        );
        setLabelText(localeTexts.FindReplace.SelectFields.contentType.label);
        break;
      case localeTexts.FindReplace.FieldName.locale:
        setPlaceHolderText(
          localeTexts.FindReplace.SelectFields.locale.placeholder
        );
        setLabelText(localeTexts.FindReplace.SelectFields.locale.label);
        break;
      case localeTexts.FindReplace.FieldName.contentField:
        setPlaceHolderText(
          localeTexts.FindReplace.SelectFields.field.placeholder
        );
        setLabelText(localeTexts.FindReplace.SelectFields.field.label);
        break;
      default:
    }
  }, []);

  return fieldName === localeTexts.FindReplace.FieldName.contentType ? (
    <AsyncSelect
      debounceTimeout={300}
      isClearable
      isSearchable
      limit={20}
      loadMoreOptions={getContentTypeOptions}
      onChange={(data: any) => onChange(data, fieldName)}
      placeholder={placeHolderText}
      selectLabel={labelText}
      value={value}
      error={isError}
      version="v2"
    />
  ) : (
    <Select
      selectLabel={labelText}
      value={value}
      onChange={(data: any) => onChange(data, fieldName)}
      options={options}
      placeholder={placeHolderText}
      isSearchable
      error={isError}
      version="v2"
      onMenuOpen={checkFunc}
    />
  );
};

export const ButtonComponent: React.FC<any> = function ({
  onClick,
  type,
  isDisable,
}: any) {
  const [iconType, setIconType] = useState<string>();
  const [btnText, setBtnText] = useState<string>();
  const [btnType, setBtnType] = useState<string>(
    localeTexts.FindReplace.Button.btnType.primary
  );
  const [btnClass, setBtnClass] = useState<string>("");

  useEffect(() => {
    if (type) {
      switch (type) {
        case localeTexts.FindReplace.Button.type.search:
          setIconType(localeTexts.FindReplace.Button.icon.search);
          setBtnText(localeTexts.FindReplace.Button.text.search);
          break;
        case localeTexts.FindReplace.Button.type.reset:
          setIconType(localeTexts.FindReplace.Button.icon.reset);
          setBtnText(localeTexts.FindReplace.Button.text.reset);
          setBtnType(localeTexts.FindReplace.Button.btnType.secondary);
          break;
        case localeTexts.FindReplace.Button.type.publish:
          setIconType(localeTexts.FindReplace.Button.icon.publish);
          setBtnClass(localeTexts.FindReplace.Button.class.publish);
          setBtnText(localeTexts.FindReplace.Button.text.publish);
          break;
        case localeTexts.FindReplace.Button.type.replace:
          setIconType(localeTexts.FindReplace.Button.icon.replace);
          setBtnClass(localeTexts.FindReplace.Button.class.replace);
          setBtnText(localeTexts.FindReplace.Button.text.replace);
          break;
        default:
      }
    }
  }, []);

  return (
    <Button
      onClick={onClick}
      buttonType={btnType}
      iconAlignment="left"
      icon={iconType}
      className={`preview-button ${btnClass}`}
      disabled={isDisable}
      version="v2"
      size="small"
    >
      {btnText}
    </Button>
  );
};

export const HeaderContainer: React.FC<any> = function ({
  selectedCount,
  operation,
  authTokenFromUrl,
}: any) {
  return (
    <>
      <Link to={`/dashboard-widget?authToken=${authTokenFromUrl}`}>
        <Button
          buttonType="light"
          icon="BackArrow"
          className="back_button"
          version="v2"
          size="small"
        >
          {localeTexts.FindReplace.Header.btnText}
        </Button>
      </Link>
      <div
        className={`selected-entries-container ${
          operation === localeTexts.FindReplace.Operation.publish
            ? "no-display"
            : ""
        }`}
      >{`${localeTexts.FindReplace.Header.entryText} (${selectedCount})`}</div>
    </>
  );
};

export const DropDownContainer: React.FC<any> = function ({
  contentTypeValue,
  handleOptionsUpdate,
  errorObj,
  localeValue,
  localeOptions,
  contentFieldValue,
  contentFieldOptions,
  setErrorObj,
  getContentTypeOptions,
}: any) {
  return (
    <>
      <DropDown
        value={contentTypeValue}
        onChange={handleOptionsUpdate}
        getContentTypeOptions={getContentTypeOptions}
        fieldName={localeTexts.FindReplace.FieldName.contentType}
        isError={errorObj?.contentType_error}
      />
      <div className="select-break">-</div>
      <DropDown
        value={localeValue}
        onChange={handleOptionsUpdate}
        options={localeOptions}
        fieldName={localeTexts.FindReplace.FieldName.locale}
        isError={errorObj?.locale_error}
      />
      <div className="select-break">-</div>
      <DropDown
        value={contentFieldValue}
        onChange={handleOptionsUpdate}
        options={contentFieldOptions}
        fieldName={localeTexts.FindReplace.FieldName.contentField}
        isError={errorObj?.contentField_error}
        checkFunc={() => {
          if (!contentTypeValue) {
            setErrorObj({
              ...errorObj,
              contentType_error: true,
            });
            utils.toastMessage({
              type: localeTexts.FindReplace.ToastMsg.Error.type,
              text: localeTexts.FindReplace.ToastMsg.Error.contentType,
            });
          }
        }}
      />
    </>
  );
};

export const FindValueContainer: React.FC<any> = function ({
  stack,
  findInputValue,
  refContentType,
  handleInputValue,
  contentFieldValue,
  localeValue,
  errorObj,
  handleContentType,
}: any) {
  return (
    <>
      <div className="select-break">-</div>
      <div className="input-conatiner">
        <FieldLabel htmlFor="InputBuilder" version="v2">
          {localeTexts.FindReplace.InputBuilder.findLabel}
        </FieldLabel>
        <InputBuider
          isReplace={false}
          stack={stack}
          fieldValue={contentFieldValue}
          inputValue={findInputValue}
          refContentType={refContentType}
          localeValue={localeValue}
          handleNewSelect={handleInputValue}
          updateValue={(data: any) => handleInputValue(data, "textValueUpdate")}
          handleContentType={handleContentType}
          isFieldError={errorObj?.findValue_error}
        />
      </div>
    </>
  );
};

export const ReplaceValueContainer: React.FC<any> = function ({
  stack,
  handleInputValue,
  replaceFieldDisabled,
  replaceValue,
  refReplaceContentType,
  contentFieldValue,
  localeValue,
  errorObj,
  handleContentType,
}: any) {
  return (
    <>
      <div className="select-break">-</div>
      <div className="next-input-conatiner">
        <FieldLabel
          htmlFor="ReplaceInputBuilder"
          disabled={replaceFieldDisabled}
          version="v2"
        >
          {localeTexts.FindReplace.InputBuilder.replaceLabel}
        </FieldLabel>
        <InputBuider
          isDisabled={replaceFieldDisabled}
          isReplace
          stack={stack}
          replace={replaceValue}
          fieldValue={contentFieldValue}
          localeValue={localeValue}
          refReplaceContentType={
            refReplaceContentType ||
            contentFieldValue?.data?.reference_to?.length > 1
              ? refReplaceContentType
              : {
                  label: "",
                  value: "",
                }
          }
          handleReplaceSelect={(data: any) =>
            handleInputValue(data, "", "replace")
          }
          replaceFunction={(data: any) =>
            handleInputValue(data, "textValueUpdate", "replace")
          }
          handleContentType={handleContentType}
          isFieldError={errorObj?.replaceValue_error}
        />
      </div>
    </>
  );
};

export const ButtonContainer: React.FC<any> = function ({
  handleModal,
  handleFindOperation,
  isSearchDisabled,
  isReplaceDisabled,
  isPublishDisabled,
}: any) {
  return (
    <>
      <ButtonComponent
        onClick={() => handleModal(localeTexts.FindReplace.Button.type.reset)}
        type={localeTexts.FindReplace.Button.type.reset}
      />
      <ButtonComponent
        onClick={handleFindOperation}
        type={localeTexts.FindReplace.Button.type.search}
        isDisable={isSearchDisabled}
      />
      <ButtonComponent
        onClick={() => handleModal(localeTexts.FindReplace.Button.type.replace)}
        type={localeTexts.FindReplace.Button.type.replace}
        isDisable={isReplaceDisabled}
      />
      {}
      <ButtonComponent
        onClick={() => handleModal(localeTexts.FindReplace.Button.type.publish)}
        type={localeTexts.FindReplace.Button.type.publish}
        isDisable={isPublishDisabled}
      />
    </>
  );
};
