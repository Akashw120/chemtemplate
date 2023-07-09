const generateADAText = () => {
    let selectedFile;
    $("#ada-input").change((event) => {
        selectedFile = event.target.files[0];
    });
    $("#add-ada-part").click(() => {
        if (selectedFile) {
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(selectedFile);
            fileReader.onload = (event) => {
                let data = event.target.result;
                let workbook = XLSX.read(data, { type: "binary" });
                // sheet_to_json
                let rowObj = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets.Sheet1
                );
                let newPara1 = "";
                for (let j = 0; j < rowObj.length; j++) {
                    let initTag = "";
                    let endTag = "";
                    let newPara = "";
                    let textLineSpace = "";
                    let key1 = Object.keys(rowObj[j])[0];
                    let text = rowObj[j][key1];
                    let pattern1 = /^\s*$(?:\r\n?|\n)/gm;
                    let pattern2 = /\n/;
                    let result = text.replace(pattern1, ""); //will return text without empty new line
                    result = result.replaceAll(/’/g, "'");
                    result = result.split(pattern2); // split each sentence
                    if(result.length > 1) {
                        initTag = "<p>";
                        endTag = "</p>";
                        textLineSpace = "\n ";
                    }
                    for (let i = 0; i < result.length; i++) {
                        if(result.length > 1) {
                            let firstTab = i == 0 ? "\t" : "";
                            newPara += `\t${firstTab}${initTag}${result[i].trim()}${endTag}`;
                            newPara += "\n\t";
                        } else {
                            newPara += `${initTag}${result[i].trim()}${endTag}`;
                        }
                    }
                    newPara1 += `\t<text ref=Alt_text_${j+1}>${textLineSpace}${newPara}</text>\n`;
                }
                $("#ada-data").text(`<def>\n${newPara1}</def>
                    `);
            };
            $("#ada-data").select();
            document.execCommand('copy');
        }
    });
}