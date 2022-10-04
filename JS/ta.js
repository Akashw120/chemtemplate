const htmlTeacherModule = (editorType) => {
  let taArr = [];
  let i = 1,
    j = 1;
  mainQuestions.forEach((editorData) => {
    let stepName = "I" + i;
    let ta = ``;
    if (editorData.type == "moleced") {
      ta = `
        <if cond=("@partRequested;" == "${stepName}")>
          <var name=moleced_display_${stepName}_TA value=@toolLayout.createAuthoringTool("moleced_disp_TA_${stepName}","@tool_TA_${stepName};","@item_name;");>
          <var name=teacherAnswerHTML value="@moleced_display_${stepName}_TA;">
        </if>`;
    } else {
      ta = `
        <var name=${editorData.type}_display_${stepName}_TA value=@.toolLayout.createTool('${editorData.type}','${editorData.type}_${stepName}_TA','display',#{recall:text(),fillAnswer:"&(text(ans_${stepName}))"});>
        <var name=teacherAnswerHTML cond=("@partRequested;" == "${stepName}") value="@${editorData.type}_display_${stepName}_TA;">`;
    }
    taArr.push(ta);
    i++;
  });
  gsQuestions.forEach((question) => {
    let stepName = "GS" + j;
    if (!question.static) {
      let ta = ``;
      if (question.type == "moleced") {
        ta = `
        <if cond=("@partRequested;" == "${stepName}")>
        <var name=moleced_display_${stepName}_TA value=@toolLayout.createAuthoringTool("moleced_disp_TA_${stepName}","@tool_TA_${stepName};","@item_name;");>
        <var name=teacherAnswerHTML value="@moleced_display_${stepName}_TA;">
        </if>`;
      } else {
        ta = `
        <var name=${question.type}_display_${stepName}_TA value=@.toolLayout.createTool('${question.type}','${question.type}_${stepName}_TA','display',#{recall:text(),fillAnswer:"&(text(ans_${stepName}))"});>
        <var name=teacherAnswerHTML cond=("@partRequested;" == "${stepName}") value="@${question.type}_display_${stepName}_TA;">`;
      }
      taArr.push(ta);
    }
    j++;
  });
  return `${taArr.join("")}`;
};

const generateTeacherAnswer = (stepName, editorType, editbox, ddm) => {
  let teacherAnswer = ``;
  if (editorType == "formed") {
    let answerArr = [];
    for (i = 1; i <= editbox; i++) {
      let answer = `[ans_returned_${stepName}_${i}]=[\\\\editbox;[]];`;
      answerArr.push(answer);
    }
    for (j = editbox + 1; j <= editbox + ddm; j++) {
      let answer = `[ans_returned_${stepName}_${j}]=[];`;
      answerArr.push(answer);
    }
    teacherAnswer = `
        <if cond=("@mode;" == "server_if")>
            <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=#{ans_returned_${stepName}_1:"\\\\editbox;[]"}>
        <else>
             <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value="&(text(ans_${stepName}));">
        </if>
        `;
  } else if (editorType == "ansed") {
    let answer = `\\\\editbox;[]`;
    teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value="&(text(ans_${stepName}));">`;
  } else if (editorType == "tabed") {
    teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value="&(text(ans_${stepName}));">`;
  } else if (editorType == "moleced") {
    teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=("@mode" == "solve" ? "@answer_list_${stepName};" : "@fin_recall_hash_${stepName};")>`;
  } else {
    teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=("@mode" == "solve" ? "&(text())" : "&(text())")>`;
  }
  return teacherAnswer;
};

const generateTeacherAnswerSource = (stepName, editorType, editbox, ddm) => {
  let teacherAnswer = ``;
  if (editorType == "formed") {
    let answerArr = [];
    for (i = 1; i <= editbox; i++) {
      let answer = `[ans_returned_${stepName}_${i}]=[\\\\editbox;[]];`;
      answerArr.push(answer);
    }
    for (j = editbox + 1; j <= editbox + ddm; j++) {
      let answer = `[ans_returned_${stepName}_${j}]=[];`;
      answerArr.push(answer);
    }
    teacherAnswer = `
        <text ref=ans_${stepName}>${answerArr.join("")}</text>`;
  } else if (editorType == "ansed") {
    let answer = `\\\\editbox;[]`;
    teacherAnswer = `
    <text ref=ans_${stepName}>${answer}</text>`;
  } else if (editorType == "tabed") {
    teacherAnswer = `
        <text ref=ans_${stepName}>\\\\set1;[]</text>`;
  } else if (editorType == "moleced") {
    teacherAnswer = `
        <var name=tool_TA_${stepName} value="">`;
  } else {
    teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=("@mode" == "solve" ? "&(text())" : "&(text())")>`;
  }
  return teacherAnswer;
};

const generateStaticVar = (stepName, editorType, editbox, ddm) => {
  let staticVar = ``;
  if (editorType == "formed") {
    let varArr = [];
    for (i = 1; i <= editbox + ddm; i++) {
        let varStr = `<text ref=${editorType}_source_${stepName}_${i}></text>
        `;
        varArr.push(varStr);
    }
    staticVar = varArr.join(' ');
  } else if (editorType == "ansed") {
    staticVar = `
    <text ref=ansed_source_${stepName}_1></text>`;
  } else if (editorType == "tabed") {
    let varArr = [];
    for (i = 1; i <= editbox + ddm; i++) {
        let varStr = `<text ref=${editorType}_source_${stepName}_${i}></text>
        `;
        varArr.push(varStr);
    }
    staticVar = varArr.join(' ');
  } else {
    staticVar = `
        `;
  }
  return staticVar;
};

const teacherAnswerModule = () => {
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
    let teacherAnswer = generateTeacherAnswer(
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
      let teacherAnswer = generateTeacherAnswer(
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

const molecedTA = (stepName) => {
  return `
        <var name=answer_list_${stepName} value=@toolLayout.getAnswerRecallFromAuthoring("@tool_TA_${stepName};", "@item_name;")>
        <var name=recall_hash_${stepName} value=#{
            "answers":{"@answer_list_${stepName};"},
            "tests":{
            #{"name":"structureType", "structure": {"skeleton"}},
            #{"name": "reversibleGroups", "tolerance": 10}
            }
        }>
        <var name=fin_recall_hash_${stepName} value="@userf.stringifyJSJSON(@recall_hash_${stepName};);">
        `;
};

const extraTA = () => {
  let extraTeacherAnswer = [],
    i = 1,
    j = 1;
  mainQuestions.forEach((question) => {
    let stepName = "I" + i;
    let editorType = question.type;
    let extTA = ``;
    if (editorType == "moleced") {
      extTA = molecedTA(stepName);
      extraTeacherAnswer.push(extTA);
    }
    i++;
  });
  gsQuestions.forEach((question) => {
    let stepName = "GS" + j;
    let editorType;
    if (!question.static) {
      editorType = question.type;
      let extTA = ``;
      if (editorType == "moleced") {
        extTA = molecedTA(stepName);
        extraTeacherAnswer.push(extTA);
      }
    }
    j++;
  });
  return `${extraTeacherAnswer.join("")}`;
};
