/*  
mode:
1 -> Statement Step (Main Question)
2 -> Guided step (GS)
*/

const sourceGenerator = (editor, stepName, editbox, ddm) => {
  let editboxSource = [];
  let source = ``;
  for (j = 1; j <= editbox; j++) {
    if (editor == "tabed") {
      source = `
      <text ref=${editor}_source_${stepName}_${j}><object name=ansed>\\\\editbox;[]</object></text>
      `;
    } else if (editor == "ansed") {
      source = `
      <text ref=${editor}_source_${stepName}_${j}>\\\\editbox;[]</text>
      `;
    } else {
      source = `
      <text ref=${editor}_source_${stepName}_${j}><object name=ansed returnValue=ans_returned_${stepName}_${j}>\\\\editbox;[]</object></text>
      `;
    }
    editboxSource.push(source);
  }
  let ddmSource = [];
  source = ``;
  for (j = editbox + 1; j <= editbox + ddm; j++) {
    if (editor == "tabed" || editor == "ansed") {
      source = `
      <text ref=${editor}_source_${stepName}_${j}><object name=UIChoice>
            <option value="1"></option>
            <option value="2"></option></object></text>
            `;
    } else {
      source = `
      <text ref=${editor}_source_${stepName}_${j}><object name=UIChoice returnValue=ans_returned_${stepName}_${j}>
            <option value="1"></option>
            <option value="2"></option></object></text>
            `;
    }
    ddmSource.push(source);
  }
  if (editbox == 0) {
    return `${editboxSource.join("")}${ddmSource.join("")}`;
  } else {
    return `${editboxSource.join("")}
        ${ddmSource.join("")}`;
  }
};

const referenceGenerator = (editor, stepName, mode) => {
  let refVal = mode == 1 ? "INTERACTION" : "SOLUTION";
  return `<TEXT REF=${refVal}>
            <p>%${stepName}_text1;</p>
            @iB;@${editor}_editor_${stepName};@iE;
          </TEXT>
          <return value="${refVal}">`;
};

const staticGS = () => {
  return `
            <TEXT REF=SOLUTION>
            </TEXT>
            <return value="SOLUTION">`;
};

const ansedGenerator = (i, mode, editbox, ddm, extraFeature) => {
  let stepName = (mode == 1 ? "I" : "GS") + i;
  let feedbacktext =
    mode == 1
      ? `
            feedbacks:#{},`
      : ``;

  let reference = referenceGenerator("ansed", stepName, mode);
  let addExtra = extraFeature ? `
            features:#{
              input:#{
                  keyboard:{""}
              },
              syntax:#{
                  chemistryMode:""
              }
          }` : ``;
  let newEditor = `  
          <var name=ansed_editor_${stepName} value=@.toolLayout.createTool('ansed','ansed_${stepName}','editor',#{
            recall:text(),${feedbacktext}${addExtra}
          });>
          ${reference}`;
  return newEditor;
};


const formedGenerator = (i, mode, editbox, ddm, extraFeature) => {
  let stepName = (mode == 1 ? "I" : "GS") + i;
  let feedbacktext =
    mode == 1
      ? `,
            feedbacks:#{}`  
      : ``;

  let reference = referenceGenerator("formed", stepName, mode);
  let addExtra = extraFeature ? `
            features:#{ansed: #{syntax: #{chemistryMode: "chemistry_equation"}, input: #{keyboard: {"letters"},disabledLetters:{",",".","[","]","{","}","(",")","1","2","3","4","5","6","7","8","9","0"}}}}` : ``;
  let newEditor = `  
          <var name=formed_editor_${stepName} value=@.toolLayout.createTool('formed','formed_${stepName}','editor',#{
            recall:text()${feedbacktext}${addExtra}
          });>
          ${reference}`;
  return newEditor;
};
const mediaListGenerator = (editbox, ddm) => {
  let mediaList = "html";
  if (editbox != 0) {
    mediaList = mediaList.concat(",ansed,ansedchem");
  }
  if (ddm != 0) {
    mediaList = mediaList.concat(",UIChoice");
  }
  if (editbox == 0 && ddm == 0) {
    mediaList = mediaList.concat(",checkbox");
  }
  return mediaList;
};

const tabedGenerator = (i, mode, editbox, ddm, extraFeature) => {
  let stepName = (mode == 1 ? "I" : "GS") + i;
  let mediaList = mediaListGenerator(editbox, ddm);
  let feedbacktext =
    mode == 1 && editbox != 0 ? `mediaFeatures:#{ansed:#{feedbacks:#{}}},` : ``;
  let cellFeedback = mode == 1 ? `feedbacks:#{},` : ``;
  let addExtra =
    !extraFeature && editbox > 1
      ? ``
      : `,
                cellFeatures:#{
                    cell_autoid_0:#{${cellFeedback}
                        correctAnswers:{}
                    }
                }`;

  let reference = referenceGenerator("tabed", stepName, mode);
  let newEditor = `  
          <var name=tabed_editor_${stepName} value=@.toolLayout.createTool('tabed','tabed_${stepName}','editor',#{
            recall:text(),features: #{display: #{border: "none"}},${feedbacktext}
            mediaList:{${mediaList}}${addExtra}
          });>
          ${reference}`;
  return newEditor;
};

const molecedGenerator = (i, mode) => {
  let stepName = (mode == 1 ? "I" : "GS") + i;
  let feedbacktext = mode == 1 ? `feedbacks:#{},` : ``;
  let reference = referenceGenerator("moleced", stepName, mode);
  let newEditor = `  <var name=moleced_editor_${stepName} value=@.toolLayout.createTool('moleced','moleced_${stepName}','editor',#{
            width:600,
            height:400,
            menu: "standard",
            features:#{
                input:#{
                    bondType:{"line"}
                    }
                }
            });>
            ${reference}`;
  return newEditor;
};

const elecedGenerator = (i, mode) => {
  let stepName = (mode == 1 ? "I" : "GS") + i;
  let feedbacktext =
    mode == 1
      ? `
                feedbacks:#{},`
      : ``;
  let reference = referenceGenerator("eleced", stepName, mode);
  let newEditor = `  <var name=eleced_editor_${stepName} value=@.toolLayout.createTool('eleced','eleced_${stepName}','editor',#{
            recall: text(),${feedbacktext}
            features: #{
                display: #{
                    yLabel: "",
                    yLalels: "",
                    elecedAnsedFontFace: "",
                },
                style: #{
                    activeAndHighlightMode: "",
                    bottomLabels: "",
                    elecedType: "",
                    labelPrefixNum: "",
                    rowsShiftUp: "",
                    saveSpace: false,
                    showHorizontalLine: false,
                    showCFHorizontalLine: false,
                }
            }
          });>
          ${reference}`;
  return newEditor;
};

const lewisedGenerator = (i, mode) => {
  let stepName = (mode == 1 ? "I" : "GS") + i;
  let feedbacktext =
    mode == 1
      ? `
                feedbacks:#{},`
      : ``;
  let reference = referenceGenerator("lewised", stepName, mode);
  let newEditor = `  <var name=lewiced_editor_${stepName} value=@.toolLayout.createTool('lewised','lewised_${stepName}','editor',#{
            recall: text(),${feedbacktext}
            menu:"basic",
            height:250,
            width:200
            });>
          ${reference}`;
  return newEditor;
};

const statObjectReference = () => {
  let i = 1,
    j = 1;
  let sourceArr = [];

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

    let sourceText = sourceGenerator(question.type, stepName, editbox, ddm);
    let source = `
        ${sourceText}`;
    sourceArr.push(source);

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
      let sourceText = sourceGenerator(question.type, stepName, editbox, ddm);
      let source = `
        ${sourceText}`;
      sourceArr.push(source);
    }
    j++;
  });
  return `${sourceArr.join("")}`;
};
