const htmlTeacherModule = () => {
    let taArr = [];
    let i = 1, j = 1;
    mainQuestions.forEach((question) => {
        let stepName = "I" + i;
        let ta = `
        <var name=teacherAnswerHTML cond=("@partRequested;" == "${stepName}") value="&(text())">`;
        taArr.push(ta);
        i++;
    });
    gsQuestions.forEach((question) => {
        let stepName = "GS" + j;
        if (!question.static) {
            let ta = `
        <var name=teacherAnswerHTML cond=("@partRequested;" == "${stepName}") value="&(text())">`;
            taArr.push(ta);
        }
        j++;
    });
    return `${taArr.join("")}`;
}

const generateTeacherAnswer = (stepName, editorType, editbox, ddm) => {
    let teacherAnswer = ``;
    if (editorType == "formed") {
        let answerArr = [];
        for (i = 1; i <= editbox; i++) {
            let answer = `[ans_returned_${stepName}_${i}]=[\\\\editbox;[]];`;
            answerArr.push(answer);
        }
        for (j = (editbox + 1); j <= (editbox + ddm); j++) {
            let answer = `[ans_returned_${stepName}_${j}]=[];`;
            answerArr.push(answer);
        }
        teacherAnswer = `
       
        <if cond=("@mode;" == "server_if")>
            <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=#{ans_returned_${stepName}_1:"\\\\editbox;[]"}>
        <else>
             <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value="@ans_${stepName};">
        </if>
        `;
    }
    else if (editorType == "ansed") {
        let answer = `\\\\editbox;[]`;
        teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value="@ans_${stepName};">`;
    }
    else if (editorType == "tabed") {
        teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value="@ans_${stepName};">`;
    }
    else if (editorType == "moleced") {
        teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=("@mode" == "solve" ? "@answer_list_${stepName};" : "@fin_recall_hash_${stepName};")>`;
    }
    else {
        teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=("@mode" == "solve" ? "&(text())" : "&(text())")>`;
    }
    return teacherAnswer;
}

const generateTeacherAnswerSource = (stepName, editorType, editbox, ddm) => {
    let teacherAnswer = ``;
    if (editorType == "formed") {
        let answerArr = [];
        for (i = 1; i <= editbox; i++) {
            let answer = `[ans_returned_${stepName}_${i}]=[\\\\editbox;[]];`;
            answerArr.push(answer);
        }
        for (j = (editbox + 1); j <= (editbox + ddm); j++) {
            let answer = `[ans_returned_${stepName}_${j}]=[];`;
            answerArr.push(answer);
        }
        teacherAnswer = `
        <var name=ans_${stepName} value="${answerArr.join("")}">`;
    }
    else if (editorType == "ansed") {
        let answer = `\\\\editbox;[]`;
        teacherAnswer = `
        <var name=ans$_${stepName} value="${answer}">`;
    }
    else if (editorType == "tabed") {
        teacherAnswer = `
        <var name=ans_${stepName} value="\\\\set1;[]">`;
    }
    else if (editorType == "moleced") {
        teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=("@mode" == "solve" ? "@answer_list_${stepName};" : "@fin_recall_hash_${stepName};")>`;
    }
    else {
        teacherAnswer = `
        <var name=teacherAnswerHash["${editorType}_${stepName}"] cond=("@partRequested;" == "${stepName}") value=("@mode" == "solve" ? "&(text())" : "&(text())")>`;
    }
    return teacherAnswer;
}


const teacherAnswerModule = () => {
    let teacherAnswerArr = [];
    let i = 1, j = 1;
    mainQuestions.forEach((question) => {
        let stepName = "I" + i;
        let editorType = question.type;
        let editbox = 0;
        let ddm = 0;
        if (editorType == "ansed" || editorType == "formed" || editorType == "tabed") {
            editbox = question.editbox;
            ddm = question.ddm;
        }
        let teacherAnswer = generateTeacherAnswer(stepName, editorType, editbox, ddm);
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
            if (editorType == "ansed" || editorType == "formed" || editorType == "tabed") {
                editbox = question.editbox;
                ddm = question.ddm;
            }
            let teacherAnswer = generateTeacherAnswer(stepName, editorType, editbox, ddm);
            teacherAnswerArr.push(teacherAnswer);
        }
        j++;
    });
    return `${teacherAnswerArr.join("")}`;
}

const molecedTA = (stepName) => {
    return `
        <var name=recall_hash_${stepName} value=#{
            "tests":{
            #{"name":"structureType", "structure": {"skeleton"}},
            #{
                "name": "checkBondAngle",
                "rules": {"skeletal"},
                "minAngle": 70
            },
            #{
                "name": "reversibleGroups",
                "tolerance": 10
            }
            },
            "answers":@answer_list_${stepName};
        }>
        <var name=fin_recall_hash_${stepName} value="@userf.stringifyJSJSON(@recall_hash_${stepName};);">
        `;
}

const extraTA = () => {
    let extraTeacherAnswer = [], i = 1, j = 1;
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
}