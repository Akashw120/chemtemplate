const clearOldData = () => {
    $(".main-question-table tbody tr").remove();
    $(".gs-question-table tbody tr").remove();
}

const updateDataInTable = () => {
    let mainTableData = [];
    let gsTableData = [];
    let i = 0, j = 0;
    mainQuestions.forEach((question) => {
        const stepName = (i + 1);
        const editorType = question.type;
        let noOfTries = 3, noOfEditbox = 0, noOfddm = 0, extraFeature = false;
        if (editorType == "ansed" || editorType == "formed" || editorType == "tabed") {
            noOfTries = question.tries;
            noOfEditbox = question.editbox;
            noOfddm = question.ddm;
            extraFeature = question.extraFeature;
            // if (editorType == "ansed" || editorType == "tabed") {
            //     extraFeature = question.extraFeature;
            // }
        }
        let row = `<tr>
                    <td>I${stepName}</td>
                    <td>${editorType}</td>
                    <td>${noOfTries}</td>
                    <td>${noOfEditbox}</td>
                    <td>${noOfddm}</td>
                    <td>${extraFeature}</td>
                </tr>`;
        mainTableData.push(row);
        i++;
    });
    gsQuestions.forEach((gs) => {
        const stepName = (j + 1);
        const isStatic = gs.static;
        let editorType = "NA", noOfEditbox = 0, noOfddm = 0, extraFeature = false;
        if (!isStatic) {
            editorType = gs.type;
            if (editorType == "ansed" || editorType == "formed" || editorType == "tabed") {
                noOfEditbox = gs.editbox;
                noOfddm = gs.ddm;
                extraFeature = gs.extraFeature;
                // if (editorType == "ansed" || editorType == "tabed") {
                //     extraFeature = gs.extraFeature;
                // }
            }
        }

        let row = `<tr>
                    <td>GS${stepName}</td>
                    <td>${isStatic}</td>
                    <td>${editorType}</td>
                    <td>${noOfEditbox}</td>
                    <td>${noOfddm}</td>
                    <td>${extraFeature}</td>
                </tr>`;
        gsTableData.push(row);
        j++;
    });
    $(".main-question-table tbody").append(mainTableData.join(" "));
    $(".gs-question-table tbody").append(gsTableData.join(" "));
}



const updateISL = () => {
    clearOldData();
    updateDataInTable();
    generateISL();
}