const ansproModuleList = () => {
  let i = 1,
    j = 1;
  let taArr = [];
  mainQuestions.forEach((question) => {
    let stepName = "I" + i;
    let editorType = question.type;
    let taVal = `${stepName}:{"${editorType}_${stepName}"}`;
    taArr.push(taVal);
    i++;
  });
  gsQuestions.forEach((question) => {
    let stepName = "GS" + j;
    let editorType;
    if (!question.static) {
      editorType = question.type;
      let taVal = `${stepName}:{"${editorType}_${stepName}"}`;
      taArr.push(taVal);
    }
    j++;
  });
  return `<return value=#{${taArr.join(",")}}>`;
};

const splitAnswerForAP = (editbox, ddm, editorType) => {
  let splitReturn = [];
  if (editorType == "tabed") {
    let splitTabed = `      &(@multiFeedback.splitAnswer3("student_answer","@userf.removeSet1("@studentAnswer;");"));
      &(@multiFeedback.splitAnswer3("teacher_answer","@userf.removeSet1("@teacherAnswer;");"));`;
    splitReturn.push(splitTabed);
  }
  if (
    editorType == "ansed" ||
    editorType == "formed" ||
    editorType == "tabed"
  ) {
    if (editbox != 0) {
      let splitEditbox = "";
      if (splitReturn.length) {
        splitEditbox = `
      &(@multiFeedback.splitAnswerEditBox("student_answer","@studentAnswer;"));
      &(@multiFeedback.splitAnswerEditBox("teacher_answer","@teacherAnswer;"));`;
      } else {
        splitEditbox = `      &(@multiFeedback.splitAnswerEditBox("student_answer","@studentAnswer;"));
      &(@multiFeedback.splitAnswerEditBox("teacher_answer","@teacherAnswer;"));`;
      }
      splitReturn.push(splitEditbox);
    }
    if (ddm != 0) {
      let splitDDM = "";
      if (splitReturn.length) {
        splitDDM = `
      &(@userf.splitReturnValueByName("@studentAnswer;",".student_"));
      &(@userf.splitReturnValueByName("@teacherAnswer;",".teacher_"));`;
      } else {
        splitDDM = `      &(@userf.splitReturnValueByName("@studentAnswer;",".student_"));
      &(@userf.splitReturnValueByName("@teacherAnswer;",".teacher_"));`;
      }
      splitReturn.push(splitDDM);
    }
  }
  return `${splitReturn.join("")}`;
};

const apForEditbox = (editbox, ddm, stepName) => {
  let editboxEvalutionArr = [];
  for (i = 1; i <= editbox; i++) {
    let feedbackStatement = ``;
    if (editbox + ddm > 1) {
      if (i < 10) {
        feedbackStatement = `
      &(@itemAnspro.storeFeedback("${stepName}.0${i}"))
      &(@itemAnspro.registerFeedback("${stepName}.0${i}"))`;
      } else {
        feedbackStatement = `
      &(@itemAnspro.storeFeedback("${stepName}.${i}"))
      &(@itemAnspro.registerFeedback("${stepName}.${i}"))`;
      }
    }
    let editboxEvalution = `
      <evaluation rule=arith2 student="@student_answer${i};" teacher="@teacher_answer${i};">
      <feedback>
        <catch name=value.*>
        <catch name=type.*>
        <catch name=reduce.*>
        <catch name=convention.*>
      &(@userFeedback.fracSimplifyDivByOne(););
      </feedback>${feedbackStatement}`;
    editboxEvalutionArr.push(editboxEvalution);
  }
  return `${editboxEvalutionArr.join("")}`;
};

const apForDDM = (editbox, ddm, stepName) => {
  let ddmEvalutionArr = [];
  for (i = editbox + 1; i <= editbox + ddm; i++) {
    let feedbackStatement = ``;
    if (editbox + ddm > 1) {
      if (i < 10) {
        feedbackStatement = `
      &(@itemAnspro.storeFeedback("${stepName}.0${i}"))
      &(@itemAnspro.registerFeedback("${stepName}.0${i}"))`;
      } else {
        feedbackStatement = `
      &(@itemAnspro.storeFeedback("${stepName}.${i}"))
      &(@itemAnspro.registerFeedback("${stepName}.${i}"))`;
      }
    }
    let ddmEvalution = `
      <evaluation rule=choice student="@('.student_ans_returned_${stepName}_${i}');" teacher="@('.teacher_ans_returned_${stepName}_${i}');">
      <feedback></feedback>${feedbackStatement}`;
    ddmEvalutionArr.push(ddmEvalution);
  }
  return `${ddmEvalutionArr.join("")}`;
};

const apForGeneral = () => {
  return `
      <evaluation rule=rule_name student="@studentAnswer" teacher="@teacherAnswer">
      <feedback>
        <catch name=value.*>
        <catch name=type.*>
        <catch name=reduce.*>
        <catch name=convention.*>
      </feedback>`;
};

const apForMoleced = () => {
  return `
      <evaluation rule=moleced_simple student="@studentAnswer" teacher="@teacherAnswer">
      <feedback>
        <catch name={value.*,type.*,reduce.*,system.*,convention.*}>
        <catch cond=(@itemAnspro.getCurrentFeedbackField('system');!='NullStudentMoleced' && @itemAnspro.getCurrentFeedbackField('value');!='Correct') redirect={system._,syntax._,type._,value.Wrong}>
      </feedback>`;
};

const generateAnswerProcessing = () => {
  let answerProcessingArr = [];
  let i = 1,
    j = 1;
  mainQuestions.forEach((question) => {
    let stepName = "I" + i;
    let editorType = question.type;
    let editbox = 0;
    let ddm = 0;
    let editboxEvalution = ``,
      ddmEvalution = ``,
      generalRule = ``;
    if (
      editorType == "ansed" ||
      editorType == "formed" ||
      editorType == "tabed"
    ) {
      editbox = question.editbox;
      ddm = question.ddm;
      editboxEvalution = apForEditbox(editbox, ddm, stepName);
      ddmEvalution = apForDDM(editbox, ddm, stepName);
      if (editorType == "tabed" && editbox + ddm == 0) {
        generalRule = apForGeneral();
      }
    } else if (editorType == "moleced") {
      generalRule = apForMoleced();
    } else {
      generalRule = apForGeneral();
    }
    let spiltval = splitAnswerForAP(editbox, ddm, editorType);
    let apComment = `<!-- *************************************** Answer processing of ${stepName} *************************************** -->`;
    let functionAP = `
    ${apComment}
    <function name=anspro_${editorType}_${stepName} list={studentAnswer,teacherAnswer}>
${spiltval}${generalRule}
    ${editboxEvalution}${ddmEvalution}
    </function>
        `;
    answerProcessingArr.push(functionAP);
    i++;
  });

  gsQuestions.forEach((question) => {
    let stepName = "GS" + j;
    let editorType;
    if (!question.static) {
      editorType = question.type;
      let editbox = 0;
      let ddm = 0;
      let editboxEvalution = ``,
        ddmEvalution = ``,
        generalRule = ``;
      if (
        editorType == "ansed" ||
        editorType == "formed" ||
        editorType == "tabed"
      ) {
        editbox = question.editbox;
        ddm = question.ddm;
        editboxEvalution = apForEditbox(editbox, ddm, stepName);
        ddmEvalution = apForDDM(editbox, ddm, stepName);
      } else if (editorType == "moleced") {
        generalRule = apForMoleced();
      } else {
        generalRule = apForGeneral();
      }
      let spiltval = splitAnswerForAP(editbox, ddm, editorType);
      let apComment = `<!-- *************************************** Answer processing of ${stepName} *************************************** -->`;
      let functionAP = `
    ${apComment}
    <function name=anspro_${editorType}_${stepName} list={studentAnswer,teacherAnswer}>
${spiltval}${generalRule}
    ${editboxEvalution}${ddmEvalution}
    </function>
    `;
      answerProcessingArr.push(functionAP);
    }
    j++;
  });
  return `${answerProcessingArr.join("")}`;
};
