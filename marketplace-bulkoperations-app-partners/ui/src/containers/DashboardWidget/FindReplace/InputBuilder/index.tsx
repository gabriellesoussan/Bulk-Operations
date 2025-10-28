/* eslint-disable no-case-declarations */
import React, { useState, useEffect } from "react";
import {
  Select,
  TextInput,
  DatePicker,
  AsyncSelect,
  FieldLabel,
} from "@contentstack/venus-components";
import FindReplaceServices from "services/FindReplace";
import localeTexts from "../../../../common/locale/en-us";

const SelectAsync: React.FC<any> = function ({
  refContentType,
  isReplace,
  refReplaceContentType,
  fieldValue,
  stack,
  localeValue,
  inputFieldValue,
  handleValueUpdate,
  isDisabled,
  isFieldError,
}: any) {
  const loadMoreOptions: any = async ({ search, skip, limit }: any) => {
    try {
      let refrenceContentType = refContentType;
      if (isReplace) {
        refrenceContentType = refReplaceContentType;
      }
      if (refrenceContentType?.value) {
        const entry: any = await FindReplaceServices.getEntries({
          fieldValue,
          findQuery: {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          stack,
          contentTypeValue: refrenceContentType,
          localeValue,
          sortBy: {},
          skip,
          limit,
        });
        return {
          options:
            entry?.entries?.map((item: any) => ({
              label:
                item?.title === ""
                  ? localeTexts.FindReplace.Table.untitled
                  : item?.title,
              value: item?.uid,
            })) ?? [],
          hasMore: entry?.count > skip + limit,
        };
      }
      return { options: [], hasMore: false };
    } catch (error) {
      console.error("Error: Async loadMoreOptions", error);
    }
    return { options: [], hasMore: false };
  };

  return (
    <AsyncSelect
      value={inputFieldValue}
      onChange={handleValueUpdate}
      placeholder={
        localeTexts.FindReplace.InputBuilder.reference.replacePlaceholder
      }
      loadMoreOptions={loadMoreOptions}
      isSearchable
      limit={100}
      width="500"
      version="v2"
      isDisabled={isDisabled}
      defaultOptions={false}
      debounceTimeout={300}
      error={isFieldError}
    />
  );
};

const RefComponent: React.FC<any> = function ({
  inputFieldValue,
  refContentType,
  isReplace,
  refReplaceContentType,
  fieldValue,
  handleContentType,
  isDisabled,
  isFieldError,
  stack,
  localeValue,
  handleNewSelect,
  handleReplaceSelect,
}: any) {
  const [dropdown, setDropdown] = useState(false);
  let refContent = refContentType;
  if (isReplace) refContent = refReplaceContentType;
  const newOptions: any = fieldValue?.data?.reference_to?.map((item: any) => ({
    label: item,
    value: item,
  }));

  useEffect(() => {
    const resetAsyncSelect = async () => {
      await setDropdown(false);
      await setDropdown(true);
    };
    resetAsyncSelect();
  }, [refContent]);

  const handleValueUpdate = (data: any) => {
    let contentTypeRef = refContentType;
    let updateFn = handleNewSelect;
    if (isReplace) {
      contentTypeRef = refReplaceContentType;
      updateFn = handleReplaceSelect;
    }
    const newData = {
      contentType: contentTypeRef?.value,
      ...data,
    };
    updateFn(newData);
  };

  return (
    <>
      {fieldValue?.data?.reference_to?.length > 1 && (
        <Select
          value={refContent}
          onChange={handleContentType}
          options={newOptions ?? []}
          placeholder={
            localeTexts.FindReplace.InputBuilder.reference.findPlaceholder
          }
          isSearchable
          isDisabled={isDisabled}
          isMulti={false}
          error={isFieldError}
          version="v2"
        />
      )}
      {refContent && (
        <div
          className={
            fieldValue?.data?.reference_to?.length > 1
              ? "reference-select-container"
              : ""
          }
        >
          {fieldValue?.data?.reference_to?.length > 1 && (
            <FieldLabel htmlFor="ref-async-select" version="v2">
              {
                localeTexts.FindReplace.InputBuilder.reference.secondLevel
                  .findLabel
              }
            </FieldLabel>
          )}
          {dropdown ? (
            <SelectAsync
              refContentType={refContentType}
              isReplace={isReplace}
              refReplaceContentType={refReplaceContentType}
              fieldValue={fieldValue}
              stack={stack}
              localeValue={localeValue}
              inputFieldValue={inputFieldValue}
              handleValueUpdate={handleValueUpdate}
              isDisabled={isDisabled}
              isFieldError={isFieldError}
            />
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

const BooleanComp: React.FC<any> = function ({
  inputFieldValue,
  fieldOnChange,
  isDisabled,
  isFieldError,
}: any) {
  return (
    <Select
      value={inputFieldValue}
      onChange={fieldOnChange}
      options={[
        {
          label: localeTexts.FindReplace.InputBuilder.boolean.true,
          value: true,
        },
        {
          label: localeTexts.FindReplace.InputBuilder.boolean.false,
          value: false,
        },
      ]}
      placeholder={localeTexts.FindReplace.InputBuilder.boolean.placeholder}
      isSearchable
      isDisabled={isDisabled}
      error={isFieldError}
      version="v2"
    />
  );
};

const IsoDateComp: React.FC<any> = function ({
  inputFieldValue,
  fieldOnChange,
  isDisabled,
  isReplace,
  isFieldError,
}: any) {
  const [isDateHide, setIsDateHide] = useState<boolean>(true);
  const ms = new Date().getTime() + 1689884260000;
  const endDate = new Date(ms);
  return (
    <div className="date-time-text-input">
      <TextInput
        id={isDisabled ? "disabled-text" : "date-input-value"}
        className={`date-value ${inputFieldValue ? "" : "input-value"}`}
        value={inputFieldValue ?? ""}
        type="string"
        version="v2"
        placeholder={
          isReplace
            ? localeTexts.FindReplace.InputBuilder.isodate.replacePlaceholder
            : localeTexts.FindReplace.InputBuilder.isodate.findPlaceholder
        }
        name="date-value"
        isReadOnly
        disabled={isDisabled}
        onClick={() => setIsDateHide(!isDateHide)}
        error={isFieldError}
      />
      {!isDateHide && (
        <DatePicker
          initialDate={inputFieldValue ?? new Date().toISOString()}
          formatType="yyyy-MM-dd"
          version="v2"
          onChange={(data: any) => {
            fieldOnChange(data);
            setIsDateHide(!isDateHide);
          }}
          startDate={new Date("2000-10-05")}
          endDate={endDate}
          viewType="date"
        />
      )}
    </div>
  );
};

const TextComp: React.FC<any> = function ({
  inputFieldValue,
  isDisabled,
  fieldValue,
  isReplace,
  isFieldError,
  replaceFunction,
  updateValue,
}: any) {
  return (
    <TextInput
      id={isDisabled ? "disabled-text" : "text-input-value search--input"}
      required
      className={`${inputFieldValue ? "" : "input-value"}`}
      value={inputFieldValue ?? ""}
      type={fieldValue?.type}
      placeholder={
        isReplace
          ? localeTexts.FindReplace.InputBuilder.textInput.replacePlaceholder
          : localeTexts.FindReplace.InputBuilder.textInput.findPlaceholder
      }
      disabled={isDisabled}
      name="value"
      onChange={isReplace ? replaceFunction : updateValue}
      error={isFieldError}
      version="v2"
    />
  );
};

const InputBuider: React.FC<any> = function ({
  isReplace,
  fieldValue,
  replace,
  handleReplaceSelect,
  replaceFunction,
  inputValue,
  handleNewSelect,
  updateValue,
  stack,
  handleContentType,
  refContentType,
  refReplaceContentType,
  localeValue,
  isDisabled,
  isFieldError,
}: any) {
  const componentRender = () => {
    let inputFieldValue = inputValue;
    let fieldOnChange = handleNewSelect;
    if (isReplace) {
      inputFieldValue = replace;
      fieldOnChange = handleReplaceSelect;
    }
    switch (fieldValue?.type) {
      case "boolean":
        return (
          <BooleanComp
            inputFieldValue={inputFieldValue}
            fieldOnChange={fieldOnChange}
            isDisabled={isDisabled}
            isFieldError={isFieldError}
          />
        );
      case "isodate":
        return (
          <IsoDateComp
            inputFieldValue={inputFieldValue}
            fieldOnChange={fieldOnChange}
            isDisabled={isDisabled}
            isReplace={isReplace}
            isFieldError={isFieldError}
          />
        );
      case "reference":
        return (
          <RefComponent
            inputValue={inputValue}
            refContentType={refContentType}
            isReplace={isReplace}
            fieldValue={fieldValue}
            handleContentType={handleContentType}
            isFieldError={isFieldError}
            stack={stack}
            localeValue={localeValue}
            handleNewSelect={handleNewSelect}
            inputFieldValue={inputFieldValue}
            refReplaceContentType={refReplaceContentType}
            isDisabled={isDisabled}
            handleReplaceSelect={handleReplaceSelect}
          />
        );
      default:
        return (
          <TextComp
            inputFieldValue={inputFieldValue}
            isDisabled={isDisabled}
            fieldValue={fieldValue}
            isReplace={isReplace}
            isFieldError={isFieldError}
            replaceFunction={replaceFunction}
            updateValue={updateValue}
          />
        );
    }
  };
  return <>{componentRender()}</>;
};

export default InputBuider;
