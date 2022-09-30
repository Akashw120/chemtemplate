const generateStatementSteps = () => {
  let steps = [];
  for (i = 0; i < mainQuestions.length; i++) {
    let stepName = "I" + (i + 1);
    steps.push(stepName);
  }
  return '<return value={"' + steps.join('","') + '"}>';
};

const generateResolutionSteps = () => {
  let steps = [];
  for (i = 0; i < gsQuestions.length; i++) {
    let stepName = "GS" + (i + 1);
    steps.push(stepName);
  }
  return '<return value={"' + steps.join('","') + '"}>';
};

const getStatementSteps = () => {
  let statementModuleArr = [];
  let i = 1;
  mainQuestions.forEach((question) => {
    let stepName = "I" + i;
    let editorType = question.type;
    let editbox = 0;
    let ddm = 0;
    let extraFeature = false;
    if (
      editorType == "ansed" ||
      editorType == "formed" ||
      editorType == "tabed"
    ) {
      editbox = question.editbox;
      ddm = question.ddm;
      if (editorType == "ansed" || editorType == "tabed") {
        extraFeature = question.extraFeature;
      }
    }
    const comment =
      `<!-- *************************************** I` +
      i +
      ` *************************************** --> `;
    let editor = ` `;
    switch (editorType) {
      case "ansed":
        editor = ansedGenerator(i, 1, editbox, ddm, extraFeature);
        break;
      case "formed":
        editor = formedGenerator(i, 1, editbox, ddm);
        break;
      case "tabed":
        editor = tabedGenerator(i, 1, editbox, ddm, extraFeature);
        break;
      case "moleced":
        editor = molecedGenerator(i, 1);
        break;
      case "eleced":
        editor = elecedGenerator(i, 1);
        break;
      case "lewised":
        editor = lewisedGenerator(i, 1);
        break;
    }
    let completeEditor = `
        ${comment}
        <function name=StatementModule_${stepName} list={modeRequested}>
        ${editor}
        </function>
                `;
    statementModuleArr.push(completeEditor);
    i++;
  });
  return statementModuleArr.join("");
};

const getResolutionSteps = () => {
  let resolutionModuleArr = [];
  let i = 1;
  gsQuestions.forEach((question) => {
    let stepName = "GS" + i;
    let editorType;
    if (!question.static) {
      editorType = question.type;
    } else {
      editorType = "NA";
    }
    let editbox = 0;
    let ddm = 0;
    let extraFeature = false;
    if (
      editorType == "ansed" ||
      editorType == "formed" ||
      editorType == "tabed"
    ) {
      editbox = question.editbox;
      ddm = question.ddm;
      if (editorType == "ansed" || editorType == "tabed") {
        extraFeature = question.extraFeature;
      }
    }
    const comment =
      `<!-- *************************************** GS` +
      i +
      ` *************************************** --> `;
    let editor = ` `;
    switch (editorType) {
      case "ansed":
        editor = ansedGenerator(i, 2, editbox, ddm, extraFeature);
        break;
      case "formed":
        editor = formedGenerator(i, 2, editbox, ddm);
        break;
      case "tabed":
        editor = tabedGenerator(i, 2, editbox, ddm, extraFeature);
        break;
      case "moleced":
        editor = molecedGenerator(i, 2);
        break;
      case "eleced":
        editor = elecedGenerator(i, 2);
        break;
      case "lewised":
        editor = lewisedGenerator(i, 2);
        break;
      default:
        editor = staticGS();
    }
    let completeEditor = `
        ${comment}
        <function name=ResolutionModule_${stepName} list={modeRequested}>
        ${editor}
        </function>
                `;
    resolutionModuleArr.push(completeEditor);
    i++;
  });
  return resolutionModuleArr.join("");
};

const calculateTries = () => {
  let triesArr = [];
  let isActive = false;
  let i = 1;
  mainQuestions.forEach((question) => {
    let stepName = "I" + i;
    let editorType = question.type;
    let tries = 3;
    if (
      editorType == "ansed" ||
      editorType == "formed" ||
      editorType == "tabed"
    ) {
      tries = question.tries;
    }
    if (tries > 0 && tries < 3) {
      let triesStatement = `"${stepName}":${tries}`;
      triesArr.push(triesStatement);
      isActive = true;
    }
    i++;
  });
  if (isActive) {
    return `
    <function name=StatementStepsTries list={}>
        <return value=#{${triesArr.join(",")}}>
    </function>
    `;
  } else {
    return ``;
  }
};

const generateIntermidiateInst = () => {
  if (intermediateInst) {
    return `
  <var name=IntermediateCalculations value="<i>Note</i>: For all intermediate calculations make sure to carry two extra digits when applicable and only round your final answer to the correct number of significant digits.">
  <function name=show_int_calc_instructions list={mode}>
    <if cond=("@mode;"=="static")>
     <var name=return_text value="">
    <else>
     <var name=return_text value="@IntermediateCalculations;<br/>">
    </if>
    <return value="@test;@return_text;">
  </function>
        `;
  } else {
    return ``;
  }
};

const generateNumListDef = () => {
  if (generateNumList) {
    return `
  <function name=generate_num_list list={start_num, end_num, step, exclude_lst}>
    <var name=num_list value={}>
    <for name=start value=@start_num cond=(@start;<=@end_num;) next=(@start;+@step;)>
      <if cond=(hasElem(@exclude_lst;,@start;)==0)>
      &(addElem(num_list,@start;));
      </if>
    </for>
    <return value=@num_list;>
  </function>
        `;
  } else {
    return ``;
  }
};

const stikeMathDef = () => {
  if (stikeMath) {
    return `
  <function name=strike_math list={val1,mode}>
    <if cond=("@mode;"=="editor")>
      <return value="@val1;">  	
    <else>
      <return value="<font color=@userf.red;><strike><font color=@userf.black;>@val1;</font></strike></font>">  	
    </if>
  </function>
        `;
  } else {
    return ``;
  }
};

const staticSourceAnsListGenerate = () => {
  let teacherAnswerArr = [];
  let i = 1,
    j = 1;
  mainQuestions.forEach((question) => {
    let stepName = "I" + i;
    let editorType = question.type;
    let editbox = 0;
    let ddm = 0;
    if (
      editorType == "ansed" ||
      editorType == "formed" ||
      editorType == "tabed"
    ) {
      editbox = question.editbox;
      ddm = question.ddm;
    }
    let teacherAnswer = generateTeacherAnswerSource(
      stepName,
      editorType,
      editbox,
      ddm
    );
    teacherAnswerArr.push(teacherAnswer);
    i++;
  });
  gsQuestions.forEach((question) => {
    let stepName = "GS" + j;
    let editorType;
    if (!question.static) {
      editorType = question.type;
      let editbox = 0;
      let ddm = 0;
      if (
        editorType == "ansed" ||
        editorType == "formed" ||
        editorType == "tabed"
      ) {
        editbox = question.editbox;
        ddm = question.ddm;
      }
      let teacherAnswer = generateTeacherAnswerSource(
        stepName,
        editorType,
        editbox,
        ddm
      );
      teacherAnswerArr.push(teacherAnswer);
    }
    j++;
  });
  return `${teacherAnswerArr.join("")}`;
};

const generateISL = () => {
  const statementStepsList = generateStatementSteps();
  const resolutionStepsList = generateResolutionSteps();
  const statementSteps = getStatementSteps();
  const resolutionSteps = getResolutionSteps();
  const staticSourceList = statObjectReference();
  const staticSourceAnsList = staticSourceAnsListGenerate();
  const triesModule = calculateTries();
  const apModuleList = ansproModuleList();
  const extraTeacher = extraTA();
  const teacherAnswer = teacherAnswerModule();
  const teacherHTML = htmlTeacherModule();
  const finalAP = generateAnswerProcessing();
  const intermidiateFunction = generateIntermidiateInst();
  const generateNumListFunction = generateNumListDef();
  const stikeMathFunction = stikeMathDef();
  const islCode = getISLCode(
    statementStepsList,
    staticSourceAnsList,
    resolutionStepsList,
    statementSteps,
    resolutionSteps,
    staticSourceList,
    triesModule,
    apModuleList,
    extraTeacher,
    teacherAnswer,
    teacherHTML,
    finalAP,
    intermidiateFunction,
    generateNumListFunction,
    stikeMathFunction
  );
  $("#isl-data").val(islCode);
};
