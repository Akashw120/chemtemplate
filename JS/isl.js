const getISLCode = (
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
) => {
  var isl_code = `<def>
  <include module=userfChemistry>
  ${intermidiateFunction}${intermidiateFunctionValue}${generateNumListFunction}${stikeMathFunction}
</def>

<description>
  <label name=level value={}>
  <label name=curriculum value={}>
  <label name=under value={}>
  <label name=thesaurus value={}>
</description>

<ITEM TITLE="@Title">

  <INSTANCE>
    <integer name=inst from=1 to=10>
  </INSTANCE>
  
  <REQUIREMENT>
  </REQUIREMENT>

  <!-- *************************************** Sequence Block ***************************************-->
  <var name=item_instance_values value={"@inst;"}>
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
        <var name=iB value="@userf.indent_begin();">
        <var name=iE value="@userf.indent_end();">
        <var name=nlHint value="@.newLineHint;">
        <var name=xl value="@userf.xlist();">

        <!-- ###############################<< Var >>###############################-->
        
        <!-- ###############################<< editor >>###############################-->
        ${staticSourceList}
        
        <!-- ###############################<< editor_ans >>###############################-->
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
          <text ref=debug><p>inst generation - &(@item_instance_values;)</p><hr></text>
          <if cond=("@modeRequested"=="resolution" || "@modeRequested"=="gs")>
            <text REF=part_qn>
              <p>%I1_text1;</p>
            </text>
          </if>
          <TEXT REF=STATEMENT>
            %debug;
            <p>%Qn_text1;</p>
            %part_qn;
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
          ${staticVarsList}
          <TEXT REF=RESOLUTION>
            <p>%EP_text1;</p>
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
      <var name=iB value="">
      <var name=iE value="">
      <unvar name=teacherAnswerHTML>${teacherHTML}
      <return value="@teacherAnswerHTML">
    </function>

    <function name=HintModule list={}>
      <return value=text(Hint_text)>
    </function>
    
  </QUESTION>
  ${finalAP}
</ITEM>
    `;
  return isl_code;
};
