const localeTexts = {
  FindReplace: {
    SelectFields: {
      contentType: {
        placeholder: "Select Content Type",
        label: "Content Type",
      },
      locale: {
        placeholder: "Select Locale",
        label: "Locale",
      },
      field: {
        placeholder: "Select Field",
        label: "Field Name/Path",
      },
    },
    InputBuilder: {
      findLabel: "Search Value",
      replaceLabel: "Replace Value",
      boolean: {
        true: "True",
        false: "False",
        placeholder: "Select Value",
      },
      isodate: {
        dateLabel: "Date",
        timeLabel: "Time",
        findPlaceholder: "Select a Date",
        replacePlaceholder: "Add Replace Date",
      },
      textInput: {
        findPlaceholder: "Add Search Value",
        replacePlaceholder: "Add Replace Value",
      },
      reference: {
        findPlaceholder: "Select Content Type",
        replacePlaceholder: "Select Reference Entry",
        secondLevel: {
          findLabel: "Reference Value",
          replaceLabel: "Reference Value",
        },
      },
    },
    Modal: {
      replace: {
        title: "Replace Entry Fields",
        body: {
          text1: "Are you sure you want to replace",
          text2: "with",
          text3: "in",
          text4: {
            singular: "field?",
            plural: "fields?",
          },
        },
        size: "xsmall",
      },
      publish: {
        title: "Publish Entry",
        body: {
          envLabel: "Select Environment(s)",
          languageLabel: "Selected Language",
          publishLabel: "Publish",
        },
        size: "max",
      },
      unpublish: {
        body: {
          unpublishLabel: "Unpublish",
        },
      },
      reset: {
        title: "Confirm Reset",
        body: "Are you sure that you want to reset all the values ?",
        size: "customSize",
      },
    },
    Button: {
      text: {
        search: "Search",
        reset: "Reset",
        publish: "Publish",
        replace: "Replace",
        cancel: "Cancel",
        send: "Send",
      },
      type: {
        search: "search",
        reset: "reset",
        publish: "publish",
        replace: "replace",
      },
      icon: {
        search: "Search",
        reset: "Reset",
        publish: "PublishWhite",
        replace: "ChangeVersion",
      },
      class: {
        publish: "publish_btn",
        replace: "replace_btn",
      },
      btnType: {
        primary: "primary",
        secondary: "secondary",
      },
    },
    SelectOptions: {
      contentType: {
        label: "title",
        value: "uid",
      },
      locale: {
        label: "name",
        value: "code",
      },
    },
    FieldName: {
      contentType: "contentType",
      locale: "locale",
      contentField: "contentField",
      replaceField: "replaceField",
    },
    ModalType: {
      replace: "replace",
      publish: "publish",
      reset: "reset",
    },
    Operation: {
      search: "find",
      publish: "publish",
      replace: "replace",
    },
    Message: {
      replaceFailure: {
        type: "error",
        text: "Error: Failed to update entries.",
      },
      operation: {
        publish: {
          status: "Published",
        },
        update: {
          status: "Updated",
        },
        unsuccess: {
          status: "Failed",
          notice: "Failed to perform the requested action.",
        },
      },
    },
    Table: {
      selectedEntryLabel: "Table entries selection",
      searchPlaceholder: "Search by entry title",
      untitled: "Untitled",
      name: {
        singular: "item",
        plural: "items",
      },
      emptyObj: {
        heading: "Start your search with find & replace",
        description: "Find, Replace, Publish Actions",
        moduleIcon: "Search",
      },
    },
    Header: {
      btnText: "Back",
      entryText: "Selected Items",
    },
    ToastMsg: {
      Error: {
        type: "error",
        contentType: "Error: No content type selected",
        sameValue: "Error: Search and Replace value cannot be same",
        noEnv:
          "Error: You do not have the permissions to access the publish environment(s)",
        error_start: "Error:",
        error_end: "missing",
      },
      Default: {
        type: "default",
        no_search_msg: "No Search Result Found",
      },
    },
  },
  Entry: {
    SelectOptions: {
      contentType: {
        label: "title",
        value: "uid",
      },
    },
    emptyState: {
      heading: "Entries",
      moduleIcon: "EntryModuleLarge",
      description:
        "Choose a content type with entries to perform publish, unpublish, delete actions.",
      headingType: "large",
    },
    emptySearchState: {
      type: "primary",
      heading: "No matching results found!",
      moduleIcon: "NoSearchResult",
      description:
        "Try changing the search query or filters to find what you are looking for.",
    },
    selectOption: {
      placeholder: "Content types",
    },
    Message: {
      operation: {
        publish: {
          status: "Published",
        },
        unpublish: {
          status: "Unpublished",
        },
        delete: {
          status: "Deleted",
        },
        unsuccess: {
          status: "Failed",
          notice: "Failed to perform the requested action.",
        },
      },
    },
    table: {
      placeholder: "Search for Entry",
      name: {
        singular: "entry",
        plural: "entries",
      },
      actions: {
        selected: {
          label: "Show Selected",
          icon: "ViewWhite",
        },
        publish: {
          label: "Publish",
          icon: "PublishWhite",
        },
        unpublish: {
          label: "Unpublish",
          icon: "Unpublish",
        },
        delete: {
          label: "Delete",
          icon: "Delete",
          type: "bulk-delete",
        },
        view: {
          publishQueue: "View In Publish Queue",
          entry: "View Entry",
          trash: "View in Trash",
          backToEntries: "Back to All Entries",
        },
      },
      header: {
        publish: "Publish Status",
        title: "Title",
        untitled: "Untitled",
        language: "Language",
        version: "Version",
        modified: "Modified At",
        createdat: "Created At",
        tags: "Tags",
        url: "URL",
        env: "Environments",
        languages: "Languages",
        status: "Status",
        message: "Message",
        not_published: "Not Published",
      },
    },
    modal: {
      allLanguageLabel: "Select all languages",
      uncheckLanguageLabel: "Unselect all languages",
      allEnvLabel: "Select all environments",
      uncheckEnvLabel: "Unselect all environments",
      infoMessage:
        "Note: At a time, you can publish 10 languages on 10 environments.",
      localeValidationMessage: "You have reached the limit of 10 locales.",
      localeMasterLabel: "Master",
      localeLocalizedLabel: "Localized",
    },
    deleteModal: {
      title: "Delete Entries",
      confirmMessageS: "The selected entries of",
      confirmMessageE:
        "locale will be deleted and moved to the Trash. Do you want to proceed?",
      cancelButton: {
        label: "Cancel",
      },
      deleteButton: {
        label: "Delete",
      },
    },
    publishModal: {
      title: "Publish Entries",
      environmentsLabel: "Select Environment(s)",
      localeLabel: "Select Language(s)",
      checkBoxLabel: "All Languages",
      cancelButton: {
        label: "Cancel",
      },
      publishButton: {
        label: "Publish",
      },
      localeQtyMessage: "Send for Publishing:",
    },
    unpublishModal: {
      title: "Unpublish Entries",
      environmentsLabel: "Select Environment(s)",
      localeLabel: "Select Language(s)",
      cancelButton: {
        label: "Cancel",
      },
      unpublishButton: {
        label: "Unpublish",
      },
      localeQtyMessage: "Send for Unpublishing:",
    },
    button: {
      reset: {
        label: "Reset",
      },
    },
  },
  Asset: {
    Message: {
      operation: {
        publish: {
          status: "Published",
        },
        unpublish: {
          status: "Unpublished",
        },
        delete: {
          status: "Deleted",
        },
        unsuccess: {
          status: "Failed",
          notice: "Failed to perform the requested action.",
        },
      },
    },
    selectOption: {
      placeholder: "Folders",
    },
    table: {
      header: {
        publish: "Publish Status",
        title: "Title",
        untitled: "Untitled",
        filename: "Filename",
        description: "Description",
        createdat: "Created At",
        tags: "Tags",
        url: "URL",
        version: "Version",
        env: "Environments",
        language: "Languages",
        uid: "Unique ID",
        modified: "Last Modified",
        type: "Type",
        status: "Status",
        message: "Message",
        not_published: "Not Published",
      },
      placeholder: "Search for Asset",
      emptyState: {
        heading: "Assets",
        moduleIcon: "AssetModuleLarge",
        description:
          "Choose an Assets folder to perform Publish, Unpublish, or Delete actions.",
        headingType: "large",
      },
      emptyState2: {
        heading: "No assets available",
        moduleIcon: "NoDataEmptyState",
        description:
          "Start creating assets! Click on the New Asset button on the top-right corner to get started.",
        headingType: "large",
      },
      name: {
        singular: "asset",
        plural: "assets",
      },
      actions: {
        selected: {
          label: "Show Selected",
          icon: "ViewWhite",
        },
        publish: {
          label: "Publish",
          icon: "PublishWhite",
        },
        unpublish: {
          label: "Unpublish",
          icon: "Unpublish",
        },
        delete: {
          label: "Delete",
          icon: "Delete",
          type: "bulk-delete",
        },
        view: {
          publishQueue: "View In Publish Queue",
          asset: "View Asset",
          trash: "View in Trash",
          backToAssets: "Back to All Assets",
        },
      },
    },
    deleteModal: {
      title: "Delete Assets",
      confirmMessage:
        "The selected asset(s) will be deleted and moved to the Trash. All the instances will also be removed from the published environments.",
      cancelButton: {
        label: "Cancel",
      },
      deleteButton: {
        label: "Delete",
      },
    },
    publishModal: {
      title: "Publish Asset(s)",
      environmentsLabel: "Select Environment(s)",
      cancelButton: {
        label: "Cancel",
      },
      publishButton: {
        label: "Send",
      },
    },
    unpublishModal: {
      title: "Unpublish Asset(s)",
      environmentsLabel: "Select Environment(s)",
      cancelButton: {
        label: "Cancel",
      },
      unpublishButton: {
        label: "Send",
      },
    },
    button: {
      reset: {
        label: "Reset",
      },
      upload: {
        label: "New Asset",
      },
    },
    uploadModal: {
      header_label: "{{successNum}} Asset(s) uploaded successfully",
      failed_label: ", {{failedNum}} failed",
      uploading_failed_label: "Uploading {{failedNum}} asset(s) failed",
    },
  },
  backButton: {
    label: "Back",
    buttonType: "light",
  },
  asyncLoader: {
    backgroundColor: "#6C5CE7",
  },
  actionMenu: {
    selectedLabel: "Selected",
    addedLabel: "Added",
    buttonType: "primary",
    cancelButton: {
      label: "Cancel",
    },
    unpublishButton: {
      label: "Unpublish",
    },
    publishButton: {
      label: "publish",
    },
    addToReleaseButton: {
      label: "Add to Release",
    },
    deleteButton: {
      label: "Delete",
    },
    uploadButton: {
      label: "Upload",
    },
  },
  Message: {
    status: {
      publish: "Published",
      unpublish: "Unpublished",
      update: "Updated",
      delete: "Deleted",
      unsuccess: "Failed",
    },
    untitled_notice_s: "Failed to",
    untitled_notice_e: "the entry since some required fields are missing.",
    unsuccess_notice: "Failed to perform the requested action.",
    unsuccess_upload: "Failed to upload one or more assets.",
    replaceFailure: {
      type: "error",
      text: "Error: Failed to update entries.",
    },
    unsafe_regex:
      "Error: Unsafe regex pattern detected. Please modify your input.",
  },
  Warnings: {
    cookiesBlocked:
      "Third-party cookies are blocked. To use this app, please disable this setting in your browser.",
    somethingWentWrong: "Something went wrong, please try again.",
    sessionExpired: "Session Timeout. Please refresh your screen.",
    regexWarn: {
      inputNotStr: "Error: Entered value must be a string.",
      notLength: "Error: Entered value cannot be empty.",
      largeStr: "Error: Entered value is too large, cannot be processed.",
      invalidRegex: "Error: Invalid search pattern.",
    },
  },
  Release: {
    modalHeader: "Add To Release",
    versionInfo: {
      v1: "<b>Note:</b> Any references linked to the selected items will be excluded from the release.",
      v2: "Release version 2.0 automatically includes up to 10 levels of references when you select <b>Add with References</b>.",
    },
    releaseVersionText: "Release Version: v{releaseVersion}.0",
    emptyState: {
      heading: "Releases",
      moduleIcon: "ReleaseModuleLarge",
      entryDescription:
        "Choose a content type with entries to perform <b>Add to Release</b> and <b>Create Release</b> actions.",
      assetDescription:
        "Choose an Assets folder to perform <b>Add to Release</b> and <b>Create Release</b> actions.",
      headingType: "large",
    },
    view: {
      entryTab: "Entries",
      assetTab: "Assets",
    },
    tableAction: {
      label: "Add To Release",
      icon: "ReleasesFilled",
    },
    actionType: {
      entry: "entryRelease",
      asset: "assetRelease",
    },
    maxError: "Maximum {{itemCount}} items can be added to a release at a time",
    entriesAdding: "Entries to be added to a release: ",
    assetsAdding: "Assets to be added to a release: ",
    assetContentType: "sys_assets",
    createRelease: {
      addOption: "Create Release",
      modal: {
        title: "Create A New Release",
        nameLabel: "Name",
        requiredLabel: "(required)",
        namePlaceholder: "Enter the name",
        descLabel: "Description",
        descPlaceholder: "Enter a description",
        cancelBtn: "Cancel",
        createBtn: "Create",
      },
    },
    addRelease: {
      select: {
        label: "Select Release",
        placeholder: "Select release",
        instruction: "Select a release or create a new one",
      },
      language: {
        label: "Select Languages",
        help: "Select Languages",
        all: "All languages",
      },
      publish: {
        label: "Select Action",
        help: "Select Action",
      },
      action: {
        publish: "Publish",
        unpublish: "Unpublish",
      },
      btn: {
        cancel: "Cancel",
        add: "Add to Release",
        addWithRef: "Add with References",
        addWithoutRef: "Add without References",
      },
    },
  },
  Configscreen: {
    Info: "Click <b>Check Release Version</b> to detect the stack's version. Save your configuration to apply it. If skipped, the app defaults to <b>v1.0</b>. Contact Contentstack Support to enable <b>v2.0</b>.",
    VersionInfo: "Current Release Version: v{releaseVersion}.0",
    ButtonText: "Check Release Version",
  },
  GetBatchFailure:
    "Oops! We couldn’t load some content. Please click the refresh icon to try again.",
};

export default localeTexts;
