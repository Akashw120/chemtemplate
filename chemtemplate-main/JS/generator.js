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
      extraFeature = question.extraFeature;
      // if (editorType == "ansed" || editorType == "tabed") {
      //   extraFeature = question.extraFeature;
      // }
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
        editor = formedGenerator(i, 1, editbox, ddm, extraFeature);
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
      extraFeature = question.extraFeature;
      // if (editorType == "ansed" || editorType == "tabed") {
      //   extraFeature = question.extraFeature;
      // }
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
        editor = formedGenerator(i, 2, editbox, ddm, extraFeature);
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

const generateIntermidiateValue = () => {
  if (intermediateVal) {
    return `
    <function name=extra_digit_intermediate list={num,sigfig,max_extra_digit}>
    <var name=max_extra_digit value=((@max_extra_digit;)?@max_extra_digit;:2)>
    
    <var name=count value=0>
    <var name=hdot_flag value=0>
    <for name=i value=0 cond=(@i;<=@max_extra_digit;) next=(@i; + 1)>
  		<var name=num_val value=@userf.ansSigFig(@num;,(@sigfig;+@i;))>
      <if cond=(@num_val;==@num;)>
      	<var name=i value=(@max_extra_digit;+1)>
      <else>
    		<var name=count value=@count;+1>
      </if>
		</for>
    
    <var name=hdot_flag cond=(@count;>@max_extra_digit;) value=1>
    <var name=sigfig value=(@sigfig;+@count;-@hdot_flag;)>
    <return value={@num_val;,@sigfig;,@hdot_flag;}>
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
    <!-- strike function -->
    <!-- val1: Number or unit -->
    <!-- mt_ap: 0 or "" for math font, other number for Anspro -->
    <!-- mode: create variable in trunck module with any value and in TA/SM with 0 -->
    <function name=strike_function list={val1,mt_ap,mode,sp}>
      <var name=space_val value=(@sp;==1?"&sp;":"")>
      <if cond=(!@mt_ap; && !@mode;)>
        <return value="@space_val;<font color=@userf.red;><strike><font color=@userf.black;>@val1;</font></strike></font>">  	
      <else cond=(@mt_ap; && !@mode;)>
        <return value="\\\\style<'color:@userf.red;;'>;[\\\\enclose<'notation:updiagonalstrike;'>;[\\\\style<'color:;;'>;[@val1;]]]">  
      <else>
        <return value="@val1;">
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

const staticVarsEPGenerate = () => {
  let staticVarsArr = [];
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
    let staticVar = generateStaticVar(stepName, editorType, editbox, ddm);
    staticVarsArr.push(staticVar);
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
      let staticVar = generateStaticVar(stepName, editorType, editbox, ddm);
      staticVarsArr.push(staticVar);
    }
    j++;
  });
  return `${staticVarsArr.join("")}`;
};

const generateISL = () => {
  const statementStepsList = generateStatementSteps();
  const resolutionStepsList = generateResolutionSteps();
  const statementSteps = getStatementSteps();
  const resolutionSteps = getResolutionSteps();
  const staticSourceList = statObjectReference();
  const staticSourceAnsList = staticSourceAnsListGenerate();
  const staticVarsList = staticVarsEPGenerate();
  const triesModule = calculateTries();
  const apModuleList = ansproModuleList();
  const extraTeacher = extraTA();
  const teacherAnswer = teacherAnswerModule();
  const teacherHTML = htmlTeacherModule();
  const finalAP = generateAnswerProcessing();
  const intermidiateFunction = generateIntermidiateInst();
  const intermidiateFunctionValue = generateIntermidiateValue();
  const generateNumListFunction = generateNumListDef();
  const stikeMathFunction = stikeMathDef();
  const islCode = getISLCode(
    statementStepsList,
    staticSourceAnsList,
    staticVarsList,
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
    intermidiateFunctionValue,
    generateNumListFunction,
    stikeMathFunction
  );
  $("#isl-data").val(islCode);
};

// ENGlish File generator
const getEngtext = () => {
  let eng_var = [];
  let eng_text = [];
  let i = 1,
    j = 1;
  mainQuestions.forEach((question) => {
    let stepName = "I" + i;
    let editorType = question.type;
    let editbox = 0;
    let ddm = 0;
    let option_var = [];
    let main_text = ``;
    if (
      editorType == "ansed" ||
      editorType == "formed" ||
      editorType == "tabed"
    ) {
      editbox = question.editbox;
      ddm = question.ddm;
    }
    if (ddm != 0) {
      for (let a = 0; a < ddm; a++) {
        option_var.push(
          "\r\n    " + `<var name=DDM_${stepName}_${a + 1} value={}>`
        );
      }
      main_text = `<text ref=${stepName}_text></text>`;
    } else {
    }
    let varEng = `${option_var.join("")}`;

    let textEng = `
    ${main_text}
    <text ref=${stepName}_text1></text>
    `;
    eng_var.push(varEng);
    eng_text.push(textEng);
    i++;
  });
  gsQuestions.forEach((question) => {
    let stepName = "GS" + j;
    let editorType = question.type;
    let editbox = 0;
    let ddm = 0;
    let option_var = [];
    let main_text = ``;
    if (
      editorType == "ansed" ||
      editorType == "formed" ||
      editorType == "tabed"
    ) {
      editbox = question.editbox;
      ddm = question.ddm;
    }
    if (ddm != 0) {
      for (let a = 0; a < ddm; a++) {
        option_var.push(
          "\r\n    " + `<var name=DDM_${stepName}_${a + 1} value={}>`
        );
      }
      main_text = `<text ref=${stepName}_text></text>`;
    } else {
    }

    let varEng = `${option_var.join("")}`;
    let textEng = `
    ${main_text}
    <text ref=${stepName}_text1></text>
    `;
    eng_var.push(varEng);
    eng_text.push(textEng);
    j++;
  });
  return [eng_var.join(""), eng_text.join("")];
};

const generateENG = () => {
  const engText = getEngtext();
  const engCode = getENGCode(engText);
  $("#eng-data").val(engCode);
};
