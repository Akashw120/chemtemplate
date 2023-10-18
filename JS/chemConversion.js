const convertToChem = () => {
    let selectedFile;
    tinymce.init({
        selector: 'textarea#chem-data',
        toolbar: false,
        menubar: false,
        width: "400px",
        height: "175px",
        init_instance_callback: (editor) => {
            editor.on('change', (evt) => {
                selectedFile = evt.level.content
            });
        }
    });

    $("#convert-to-chem").click(() => {
        if (selectedFile) {
            const chemReg = new RegExp("[A-Z][a-z]?\\d*|\\([^()]*(?:\\(.*\\))?[^()]*\\)\\d+", 'gm')
            const p_reg = new RegExp("<p.*?>", "gm")
            const sup_reg = new RegExp("<sup.*?>", "gm")
            const sub_reg = new RegExp("<sub.*?>", "gm")
            const subs1_reg = new RegExp("(<sub>|</sub>)", "gm")
            const start_num = new RegExp("^\\d", "g")
            const states = new RegExp("\\((s|aq|l|g)\\)", "g")
            const bracs = new RegExp("\\(|\\)", "g")
            const charge = new RegExp("<sup>.*?<\\/sup>", "g")
            let inp = selectedFile.replace("</p><p>", "</p>\n<p>").split("\n")
            let finalOp = ''
            let index = 1
            for (const inp_val of inp) {
                let chem_arr = inp_val.split("\n")
                for (const ch of chem_arr) {
                    let p_clean = ch.replace(p_reg, "{ ")
                        .replace("</p>", " }")
                        .replace(sup_reg, "<sup>")
                        .replace(sub_reg, "<sub>")
                        .replace(subs1_reg, "")
                        .split(" ")
                    let cleaned_array = p_clean.slice(1, -1)

                    let final_Arr = ""
                    for (const ca of cleaned_array) {
                        if (ca == "+" || ca == "-") {
                            final_Arr += `,"${ca}",`
                        } else if (ca == "&rarr;" || ca == "→") {
                            final_Arr += `,"=",`
                        } else {
                            let comp, comp2, chr;
                            let final_arr_temp = ''

                            if (ca.match(start_num)) {
                                let comp_start = ca.match(start_num)
                                final_arr_temp += "{" + comp_start[0] + ","
                            } else {
                                final_arr_temp += "{"
                            }
                            if (comp = ca.match(chemReg)) {
                                for (const com of comp) {
                                    let temp_com;
                                    if (temp_com = com.match(/\)\d/)) {
                                        let t1 = com.replace("(", "").replace(/\)\d/g, "")
                                        let t2 = t1.match(chemReg)
                                        let t4 = com.match(/\d$/g)
                                        final_arr_temp += "{"
                                        for (const t3 of t2) {
                                            if (t3.match(/\d/g)) {
                                                final_arr_temp += t3.replace(/\d/gm, (num) => {
                                                    return `,${num},`
                                                })
                                            } else {
                                                final_arr_temp += `${t3},1,`
                                            }
                                        }

                                        final_arr_temp += "}," + t4
                                    } else {
                                        if (com.match(/\d/g)) {
                                            final_arr_temp += com.replace(/\d/gm, (num) => {
                                                return `,${num},`
                                            })
                                        } else {
                                            final_arr_temp += `${com},1,`
                                        }
                                    }
                                }
                                if (comp2 = ca.match(states)) {
                                    for (const com2 of comp2) {
                                        let temp = com2.replace(bracs, "")
                                        final_arr_temp += `${temp},`
                                    }
                                }

                                if (chr = ca.match(charge)) {
                                    let temp_chr = chr[0].replace("<sup>", "").replace("<\/sup>", "")
                                    let n
                                    if (n = temp_chr.match(/\d/g)) {
                                        final_arr_temp += `,${n}`
                                    } else if (n = temp_chr.match(/\d\-/g)) {
                                        final_arr_temp += `,-${n}`
                                    } else if (temp_chr.match(/\-/g)) {
                                        final_arr_temp += `,-1`
                                    } else {
                                        final_arr_temp += `,1`
                                    }
                                }

                                final_arr_temp += "}"
                                final_Arr += final_arr_temp.replace(",}", "}").replace("\,\,", "\,")

                            }
                        }
                    }
                    final_Arr += ""
                    finalOp += `<var name=chem_${index} value=@userfChemistry.formatChemEquation({${final_Arr}},1)>\n`
                }
                index++;

            }
            $("#chemCode-data").val(finalOp);
        }
    });

}
