import React from "react";
import { Select } from "@contentstack/venus-components";
import { TypeSelectOption } from "common/types";

const SelectOption = React.memo(
  ({
    handleSelection,
    values,
    value,
    isSearchable,
    placeholder,
    hideSelectedOptions,
  }: TypeSelectOption) => (
    <Select
      onChange={(e: any) => handleSelection(e)}
      options={values}
      value={value}
      version="v2"
      isSearchable={isSearchable}
      placeholder={placeholder}
      hideSelectedOptions={hideSelectedOptions}
      width="370px"
    />
  )
);

export default SelectOption;
