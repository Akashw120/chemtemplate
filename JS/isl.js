

const getISLCode = (statementStepsList, staticSourceAnsList, resolutionStepsList, statementSteps, resolutionSteps, staticSourceList, triesModule, apModuleList, extraTeacher, teacherAnswer, teacherHTML, finalAP, intermidiateFunction, generateNumListFunction, stikeMathFunction) => {
  var isl_code = `<def>
  <include module=userfChemistry>
  ${intermidiateFunction}${generateNumListFunction}${stikeMathFunction}
</def>

<description>
  <label name=level value={}>
  <label name=curriculum value={}>
  <label name=under value={}>
  <label name=thesaurus value={}>
</description>

<ITEM TITLE="@Title">
  <INSTANCE>
  </INSTANCE>
  <REQUIREMENT>
  </REQUIREMENT>

  <!-- *************************************** Sequence Block ***************************************-->
  <var name=item_instance_values value={}>
  <SEQUENCE INDEX=history>
      <SIGNATURE NAME=@autoSequenceSignatureName() VALUE="@formatAutoSequenceSignature(@item_instance_values;)">
  </SEQUENCE>

  <REQUIREMENT>
      <REQUIRES COND=@testAutoSequenceRequirement(@item_instance_values;)>
  </REQUIREMENT>

  <QUESTION>
    <function name=TrunkModule list={}>
      <def module=".">
	  
        <!-- ###############################<< Styling >>###############################-->
        <var name=varEqualTo value=@userf.disp("=")>
        <var name=indent_start value="@userf.indent_begin();">
        <var name=indent_end value="@userf.indent_end();">
        <var name=table_width value="width=40">
        <var name=nlHint value="@.newLineHint;">
        <var name=xl value="@userf.xlist();">
        <var name=valign_base value="valign=baseline">
        <var name=align_right value='style="text-align:right;"'>
        <var name=align_left value='style="text-align:left;"'>
        <var name=align_center value='style="text-align:center;"'> 
		
	      <!-- ###############################<< Question >>###############################-->
        <text ref=i1_table>
          <table role="presentation">
            <tr>
              <td rw id=i1_chemform_id>%tabed_source_I1_1;</td>
            </tr>
          </table>
    		</text>

        <!-- ###############################<< show me and t_html >>###############################-->
        ${staticSourceList}

        ${staticSourceAnsList}

      </def> 
    </function>

    <function name=StatementSteps list={}>
      ${statementStepsList}
    </function>
    ${triesModule}
    <function name=StatementModule list={}>
      <def module="."> 
      
        <!-- *************************************** Main Question ***************************************-->
        <function name=StatementModule_Main list={modeRequested}>
          <TEXT REF=STATEMENT>
          
          </TEXT>
          <return value="STATEMENT">
        </function>
        ${statementSteps}
      </def>
    </function>


    <function name=ResolutionSteps list={}>
      ${resolutionStepsList}
    </function>

    <function name=ResolutionModule list={partsRequested}>
      <def module=".">

        <!-- *************************************** Show Me ***************************************-->
        <function name=ResolutionModule_Main list={modeRequested}> 
          <TEXT REF=RESOLUTION>
          
          </TEXT>
          <return value="RESOLUTION">
        </function>
        ${resolutionSteps}
      </def>
    </function>


    <function name=AnsproModule list={}>
      ${apModuleList}
    </function>
    
    <function name=TeacherModule list={partRequested,mode}>
      ${extraTeacher}
      &(teacherAnswerHash=#{};;);${teacherAnswer}
      <return value=@teacherAnswerHash>
    </function>

    <function name=HtmlTeacherModule list={partRequested}>
      <unvar name=teacherAnswerHTML>${teacherHTML}
      <return value="@teacherAnswerHTML">
    </function>

    <function name=HintModule list={}>
      <return value=text()>
    </function>
    
  </QUESTION>
  ${finalAP}
</ITEM>
    `
  return isl_code;
}
