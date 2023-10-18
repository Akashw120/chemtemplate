const addStructure = () => {
  const buttons = `
        <div class="button-bar">
            <div>
                <button id="add-main-part">Add Main Question</button>
                <button id="add-gs-part">Add Guided Solution</button>
            </div>
            <div class="checkbox-bar">
                <input type=checkbox id="add-intermediate-inst" name="intermediateInst"/><label for="add-intermediate-inst">Intermediate Inst</label>
                <input type=checkbox id="add-intermediate-val" name="intermediateVal"/><label for="add-intermediate-inst">Intermediate Value</label>
                <input type=checkbox id="generate-num-list" name="generateNumList"/><label for="generate-num-list">Generate Num List</label>
                <input type=checkbox id="add-strike-math" name="strikeMath"/><label for="add-strike-math">Strike Math</label>
            </div>
            <div>
                <label for="ada_label">Choose a .xlsx file:</label>
                <input type="file" id="ada-input" accept=".xlsx" name="ada_label"/>
                <button id="add-ada-part">Convert to ADA</button>
            </div>
            <div>
                <button id="convert-to-chem">Convert to Chem</button>
            </div>
        </div>`;

  const checkboxs = `
        `;

  const mainTable = `
        <div class="eqn-bar">
          <div>
            <table class="main-question-table" border=1 cellspacing=0>
                <caption><b>Main Question</b></caption>
                <thead>
                  <tr>
                  </tr>
                </thead>
                <tbody></tbody>
            </table>
            <table class="gs-question-table" border=1 cellspacing=0>
              <caption><b>Guided Solution</b></caption>
              <thead>
                  <tr>
                  </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <div class="chem-data-container">
            <textarea id="chem-data"></textarea>
            <textarea id="chemCode-data" rows=10 cols=56>${chemCode}</textarea>
          </div>
        </div>
        `;
  const gsTable = `
        `;
  const isl = `
        <div id="text_area"><textarea id="isl-data" rows=35 cols=180>${islCode}</textarea> <textarea id="eng-data" rows=35 cols=85>${engCode}</textarea> <textarea id="ada-data" rows=35 cols=85>${adaCode}</textarea></div>`;

  $("#main-body").append(buttons);
  $("#main-body").append(checkboxs);
  $("#main-body").append(mainTable);
  $("#main-body").append(gsTable);
  $("#main-body").append(isl);
  console.log("Buttons Added");
};

const addFormButtonListener = () => {
  $("#submitMainForm").click(() => {
    let editorData = {};
    let type = $("#mainEditorSelector").val();
    let tries = Number($("#mainTriesCount").val());
    let editbox = Number($("#mainEditboxCount").val());
    let ddm = Number($("#mainDropdownCount").val());
    let extraFeature = $("#mainExtraFeature").prop("checked");
    $("#add-main-part").removeClass("hide");
    $("#add-gs-part").removeClass("hide");
    $("#mainPopupForm").remove();
    editorData.type = type;
    if (type == "ansed" || type == "formed" || type == "tabed") {
      editorData.tries = tries;
      editorData.editbox = editbox;
      editorData.ddm = ddm;
      editorData.extraFeature = extraFeature;
      // if (type == "ansed" || type == "tabed") {
      //     editorData.extraFeature = extraFeature;
      // }
    }
    mainQuestions.push(editorData);
    updateISL();
  });
  $("#cancelMainForm").click(() => {
    noMainQue = noMainQue - 1;
    $("#add-main-part").removeClass("hide");
    $("#add-gs-part").removeClass("hide");
    $("#mainPopupForm").remove();
  });
  $("#submitGsForm").click(() => {
    let editorData = {};
    let static = $("#isStaticGS").prop("checked");
    let type = $("#gsEditorSelector").val();
    let editbox = Number($("#gsEditboxCount").val());
    let ddm = Number($("#gsDropdownCount").val());
    let extraFeature = $("#gsExtraFeature").prop("checked");
    $("#add-gs-part").removeClass("hide");
    $("#add-main-part").removeClass("hide");
    $("#gsPopupForm").remove();
    editorData.static = static;
    if (!static) {
      editorData.type = type;
      if (type == "ansed" || type == "formed" || type == "tabed") {
        editorData.editbox = editbox;
        editorData.ddm = ddm;
        editorData.extraFeature = extraFeature;
        // if (type == "ansed" || type == "tabed") {
        //     editorData.extraFeature = extraFeature;
        // }
      }
    }
    gsQuestions.push(editorData);
    updateISL();
  });
  $("#cancelGsForm").click(() => {
    noGsQue = noGsQue - 1;
    $("#add-gs-part").removeClass("hide");
    $("#add-main-part").removeClass("hide");
    $("#gsPopupForm").remove();
  });
};

const addButtonsListener = () => {
  $("#add-main-part").click(() => {
    noMainQue = noMainQue + 1;
    let form1 = mainQueForm();
    $("#main-body").append(form1);
    $("#add-main-part").addClass("hide");
    $("#add-gs-part").addClass("hide");
    $("#mainPopupForm").removeClass("hide");
    addFormButtonListener();
    onSelectEditorMain();
  });
  $("#add-gs-part").click(() => {
    noGsQue = noGsQue + 1;
    let form2 = gsQueForm();
    $("#main-body").append(form2);
    $("#add-main-part").addClass("hide");
    $("#add-gs-part").addClass("hide");
    $("#gsPopupForm").removeClass("hide");
    addFormButtonListener();
    onSelectEditorGs();
  });
};

const addCheckListner = () => {
  $("#add-intermediate-inst").on("click", () => {
    intermediateInst = $("#add-intermediate-inst").prop("checked");
    updateISL();
  });

  $("#add-intermediate-val").on("click", () => {
    intermediateVal = $("#add-intermediate-val").prop("checked");
    updateISL();
  });

  $("#generate-num-list").on("click", () => {
    generateNumList = $("#generate-num-list").prop("checked");
    updateISL();
  });

  $("#add-strike-math").on("click", () => {
    stikeMath = $("#add-strike-math").prop("checked");
    updateISL();
  });
};

const addTableHeaders = () => {
  $.getJSON("../DATA/table-data.json", (hdata) => {
    let mth = $(".main-question-table thead tr");
    let gth = $(".gs-question-table thead tr");
    let mthlist = hdata.mainPartHeaders;
    let gthlist = hdata.gsPartHeaders;
    mthlist.forEach((header) => {
      let thData = '<th class="header-data">' + header + "</th>";
      mth.append(thData);
    });
    gthlist.forEach((header) => {
      let thData = '<th class="header-data">' + header + "</th>";
      gth.append(thData);
    });
    console.log(hdata);
  });
};

const fetchEditors = () => {
  $.getJSON("../DATA/editor.json", (editors) => {
    let options = [];
    editors.types.forEach((editor) => {
      let option = `<option value='${editor}'>${editor}</option>`;
      options.push(option);
    });
    editorsList = options.join(" ");
  });
};

const disableAllFieldsMain = () => {
  $("#mainTriesCount").attr("disabled", "disabled");
  $("#mainEditboxCount").attr("disabled", "disabled");
  $("#mainDropdownCount").attr("disabled", "disabled");
  $("#submitMainForm").attr("disabled", "disabled");
  disabledExtraFeaturesMain();
};

const enableForAnsedFormedTabedMain = () => {
  $("#mainTriesCount").removeAttr("disabled");
  $("#mainEditboxCount").removeAttr("disabled");
  $("#mainDropdownCount").removeAttr("disabled");

  enabledExtraFeaturesMain();
  $("#submitMainForm").removeAttr("disabled");
};

const enabledExtraFeaturesMain = () => {
  clearExtraFeatureMain();
  $("#mainExtraFeature").removeAttr("disabled");
};

const disabledExtraFeaturesMain = () => {
  clearExtraFeatureMain();
  $("#mainExtraFeature").attr("disabled", "disabled");
};

const clearExtraFeatureMain = () => {
  $("#mainExtraFeature").removeAttr("checked");
};

const enabledExtraFeaturesGS = () => {
  clearExtraFeatureGS();
  $("#gsExtraFeature").removeAttr("disabled");
};

const disabledExtraFeaturesGS = () => {
  clearExtraFeatureGS();
  $("#gsExtraFeature").attr("disabled", "disabled");
};

const clearExtraFeatureGS = () => {
  $("#gsExtraFeature").removeAttr("checked");
};

const onSelectEditorMain = () => {
  $("#mainEditorSelector").change(() => {
    let editorVal = $("#mainEditorSelector").val();
    disableAllFieldsMain();
    switch (editorVal) {
      case "tabed":
        enabledExtraFeaturesMain();
      case "formed":
        enableForAnsedFormedTabedMain();
        break;
      case "ansed":
        $("#mainEditboxCount").val("1");
        enabledExtraFeaturesMain();
      case "moleced":
      case "eleced":
      case "lewised":
        $("#submitMainForm").removeAttr("disabled");
        break;
      default:
    }
  });
};

const disableAllFieldsGs = () => {
  $("#gsTriesCount").attr("disabled", "disabled");
  $("#gsEditboxCount").attr("disabled", "disabled");
  $("#gsDropdownCount").attr("disabled", "disabled");
  $("#submitGsForm").attr("disabled", "disabled");
  disabledExtraFeaturesGS();
};

const enableForAnsedFormedTabedGs = () => {
  $("#gsTriesCount").removeAttr("disabled");
  $("#gsEditboxCount").removeAttr("disabled");
  $("#gsDropdownCount").removeAttr("disabled");
  enabledExtraFeaturesGS();
  $("#submitGsForm").removeAttr("disabled");
};

const onSelectEditorGs = () => {
  $("#isStaticGS").change((ele) => {
    if (ele.target.checked) {
      $("#gsEditorSelector").attr("disabled", "disabled");
      disableAllFieldsGs();
      $("#submitGsForm").removeAttr("disabled");
    } else {
      $("#gsEditorSelector").removeAttr("disabled");
      $("#submitGsForm").attr("disabled", "disabled");
      $("#gsEditorSelector").trigger("change");
    }
  });
  $("#gsEditorSelector").change(() => {
    let editorVal = $("#gsEditorSelector").val();
    disableAllFieldsGs();
    switch (editorVal) {
      case "tabed":
        enabledExtraFeaturesGS();
      case "formed":
        enableForAnsedFormedTabedGs();
        break;
      case "ansed":
        $("#gsEditboxCount").val("1");
        enabledExtraFeaturesGS();
      case "moleced":
      case "eleced":
      case "lewised":
        $("#submitGsForm").removeAttr("disabled");
        break;
      default:
    }
  });
};
