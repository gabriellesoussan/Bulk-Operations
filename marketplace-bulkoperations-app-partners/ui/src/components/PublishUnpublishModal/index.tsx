/* eslint-disable no-nested-ternary */
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
  TextInput,
  DatePicker,
  TimePicker,
  Search,
} from "@contentstack/venus-components";
import localeTexts from "../../common/locale/en-us";

const TimeComponent = function ({ timeInput, handleTime }: any) {
  const [isTimeHide, setIsTimeHide] = useState<boolean>(true);

  return (
    <div className="time-text-input">
      <FieldLabel htmlFor="time-value" version="v2">
        {localeTexts.FindReplace.InputBuilder.isodate.timeLabel}
      </FieldLabel>
      <TextInput
        id="publish-time"
        className="publish-time-value"
        version="v2"
        value={timeInput}
        type="string"
        placeholder={
          localeTexts.FindReplace.InputBuilder.isodate.findPlaceholder
        }
        name="time-value"
        isReadOnly
        onClick={() => setIsTimeHide(!isTimeHide)}
      />
      {!isTimeHide && (
        <TimePicker
          initialDate={timeInput}
          onDone={(data?: any) => {
            setIsTimeHide(!isTimeHide);
            handleTime(data);
          }}
          version="v2"
          onCancel={() => setIsTimeHide(!isTimeHide)}
          placeholder="Select time"
          viewType="time"
        />
      )}
    </div>
  );
};

const DateComponent: React.FC<any> = function ({
  inputFieldValue,
  fieldOnChange,
}: any) {
  const [isDateHide, setIsDateHide] = useState<boolean>(true);

  return (
    <div className="date-time-text-input">
      <FieldLabel htmlFor="date-value" version="v2">
        {localeTexts.FindReplace.InputBuilder.isodate.dateLabel}
      </FieldLabel>
      <TextInput
        id="publish-date"
        version="v2"
        className="publish-date-value"
        value={new Date(
          inputFieldValue?.substring(0, 4),
          // eslint-disable-next-line
          inputFieldValue?.substring(5, 7) - 1,
          inputFieldValue?.substring(8, 10)
        )
          .toDateString()
          .substring(4)}
        type="string"
        placeholder={
          localeTexts.FindReplace.InputBuilder.isodate.findPlaceholder
        }
        name="date-value"
        isReadOnly
        onClick={() => setIsDateHide(!isDateHide)}
      />
      {!isDateHide && (
        <DatePicker
          initialDate={inputFieldValue}
          formatType="yyyy-MM-dd"
          onChange={(data: any) => {
            fieldOnChange(data);
            setIsDateHide(!isDateHide);
          }}
          startDate={new Date()}
          viewType="date"
        />
      )}
    </div>
  );
};

function PublishUnpublishModal({
  action,
  closeModal,
  incomingLocales,
  incomingEnvironments,
  handleActions,
  defaultLocale,
  componentType,
}: any) {
  const [environments, setEnvironments] = useState<any>([]);
  const [locales, setLocales] = useState<any>([]);
  const [isAllLocaleChecked, setIsAllLocaleChecked] = useState<any>(false);
  const [isAllEnvChecked, setIsAllEnvChecked] = useState<any>(false);
  const [radioChecked, setRadioChecked] = useState("now");
  const [publishDate, setPublishDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [publishTime, setPublishTime] = useState<string>("00:00:00+0530");
  const [searchValue, setSearchValue] = useState<string>("");

  // set environment
  const handleEnvironment = ({ target }: any) => {
    const reducedArr = [...environments];
    if (target?.checked && !environments?.includes(target?.value)) {
      setEnvironments((arr: any[]) => [...arr, target?.value]);
    } else {
      const index = reducedArr?.indexOf(target?.value);
      reducedArr?.splice(index, 1);
      setEnvironments(reducedArr);
    }
  };

  useEffect(() => {
    if (defaultLocale && !locales?.includes(defaultLocale))
      setLocales([...locales, defaultLocale]);
  }, [defaultLocale]);

  // set locale
  const handleLocale = ({ target }: any) => {
    const reducedArr = [...locales];
    let finalLocales = [];
    if (target?.checked && !locales?.includes(target?.value)) {
      finalLocales = [...locales, target?.value];
      setLocales(finalLocales);
      if (finalLocales?.length === incomingLocales?.length)
        setIsAllLocaleChecked(true);
    } else {
      const index = reducedArr?.indexOf(target?.value);
      reducedArr?.splice(index, 1);
      setLocales(reducedArr);
      setIsAllLocaleChecked(false);
    }
  };

  // set all locale
  const setAllLanguage = () => {
    setIsAllLocaleChecked(!isAllLocaleChecked);
    if (!isAllLocaleChecked)
      setLocales(incomingLocales?.map((l: any) => l?.code));
    else setLocales([]);
  };

  // set all environment
  const setAllEnv = () => {
    setIsAllEnvChecked(!isAllEnvChecked);
    if (!isAllEnvChecked)
      setEnvironments(incomingEnvironments?.map((env: any) => env?.value));
    else setEnvironments([]);
  };

  const handlePublish = (e: any) => setRadioChecked(e?.target?.id);
  // Handle search input change
  const handleSearchChange = (value: string) => setSearchValue(value ?? "");

  // Handle search clear
  const handleSearchClear = () => setSearchValue("");

  // Filter locales based on search value
  const filteredLocales =
    incomingLocales?.filter(
      (locale: any) =>
        locale?.name?.toLowerCase().includes(searchValue.toLowerCase()) ??
        locale?.code?.toLowerCase().includes(searchValue.toLowerCase())
    ) ?? [];

  const getHeaderTitle = () => {
    if (componentType === "Asset") {
      if (action === "publish") return localeTexts.Asset.publishModal.title;
      return localeTexts.Asset.unpublishModal.title;
    }
    if (action === "publish") return localeTexts.Entry.publishModal.title;
    return localeTexts.Entry.unpublishModal.title;
  };

  return (
    <div className="modal-wrapper">
      <ModalHeader title={getHeaderTitle()} closeModal={closeModal} />
      <ModalBody className="modal-body-wrapper">
        <div>
          <FieldLabel htmlFor="environments" version="v2" required>
            {action === "publish"
              ? localeTexts.Entry.publishModal.environmentsLabel
              : localeTexts.Entry.unpublishModal.environmentsLabel}
          </FieldLabel>
          {componentType !== "FindReplace" && (
            <div className="all-env-wrapper">
              <Button onClick={setAllEnv} buttonType="link" version="v2">
                {isAllEnvChecked
                  ? localeTexts.Entry.modal.uncheckEnvLabel
                  : localeTexts.Entry.modal.allEnvLabel}
              </Button>
            </div>
          )}
          <div className="checkbox-container">
            {incomingEnvironments?.map((res: any) => (
              <div key={res?.value} className="Checkbox-wrapper">
                <Checkbox
                  onClick={handleEnvironment}
                  label={res?.label}
                  value={res?.value}
                  checked={environments?.includes(res?.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="locales" version="v2" required>
            {action === "publish"
              ? localeTexts.Entry.publishModal.localeLabel
              : localeTexts.Entry.unpublishModal.localeLabel}
          </FieldLabel>
          {componentType !== "FindReplace" && (
            <div className="all-locale-wrapper">
              <div className="locale-search-container">
                <Search
                  placeholder="Search"
                  version="v2"
                  onChange={handleSearchChange}
                  onClear={handleSearchClear}
                  value={searchValue}
                  className="localeSearch"
                  searchButtonVisibility={false}
                />
                <Button
                  onClick={setAllLanguage}
                  buttonType="link"
                  version="v2"
                  disabled={defaultLocale !== incomingLocales?.[0]?.code}
                >
                  {isAllLocaleChecked
                    ? localeTexts.Entry.modal.uncheckLanguageLabel
                    : localeTexts.Entry.modal.allLanguageLabel}
                </Button>
              </div>
              <div className="legends">
                <div className="legend">
                  <b>(M)</b>: {localeTexts.Entry.modal.localeMasterLabel}
                </div>
                <div className="legend">
                  <b>(L)</b>: {localeTexts.Entry.modal.localeLocalizedLabel}
                </div>
              </div>
            </div>
          )}
          <div className="checkbox-container">
            {filteredLocales?.map((res: any) => (
              <div key={res?.code} className="Checkbox-wrapper">
                <Checkbox
                  checked={locales?.includes(res?.code)}
                  onClick={handleLocale}
                  label={
                    <div className="language--wrapper">
                      <div className="language--label">{res?.name}</div>
                      {componentType !== "FindReplace" &&
                        !res?.fallback_locale && (
                          <>
                            &ensp;<b>(M)</b>
                          </>
                        )}
                    </div>
                  }
                  value={res?.code}
                  disabled={
                    defaultLocale !== incomingLocales?.[0]?.code &&
                    defaultLocale !== res?.code
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="Publish" version="v2" required>
            {action === "publish"
              ? localeTexts.FindReplace.Modal.publish.body.publishLabel
              : localeTexts.FindReplace.Modal.unpublish.body.unpublishLabel}
          </FieldLabel>
          <div className="radio-container">
            <Radio
              name="option"
              checked={radioChecked === "now"}
              onChange={handlePublish}
              id="now"
              label="Now"
              className="checkBox"
            />
            <Radio
              name="option"
              checked={radioChecked === "later"}
              onChange={handlePublish}
              id="later"
              label="Later"
              className="checkBox"
            />
          </div>
          {radioChecked === "later" && (
            <div className="publish-later">
              <DateComponent
                inputFieldValue={publishDate}
                fieldOnChange={(data: string) => setPublishDate(data)}
              />
              <TimeComponent
                timeInput={publishTime}
                handleTime={(data: string) => setPublishTime(data)}
              />
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" version="v2" onClick={closeModal}>
            {action === "publish"
              ? localeTexts.Entry.publishModal.cancelButton.label
              : localeTexts.Entry.unpublishModal.cancelButton.label}
          </Button>
          <Button
            disabled={!environments?.length || !locales?.length}
            version="v2"
            onClick={() =>
              handleActions({
                action,
                environments,
                locales,
                time:
                  radioChecked !== "now" ? `${publishDate}T${publishTime}` : "",
                closeModal,
              })
            }
          >
            {action === "publish"
              ? localeTexts.Entry.publishModal.publishButton.label
              : localeTexts.Entry.unpublishModal.unpublishButton.label}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </div>
  );
}

export default PublishUnpublishModal;
