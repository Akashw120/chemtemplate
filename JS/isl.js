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

<item title="@Title">
  <instance>
    <integer name=inst from=1 to=10>
  </instance>
  
  <requirement>
  </requirement>

  <!-- *************************************** Sequence Block ***************************************-->
  <var name=item_instance_values value={"@inst;"}>
  <sequence index=history>
      <signature name=@autoSequenceSignatureName() value="@formatAutoSequenceSignature(@item_instance_values;)">
  </sequence>

  <requirement>
      <requires cond=@testAutoSequencerequirement(@item_instance_values;)>
  </requirement>

  <question>
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
        <!-- *************************************** Main question ***************************************-->
        <function name=StatementModule_Main list={modeRequested}>
          <text ref=debug>
            <div>===================== DebugText =====================</div>
              inst == &(@item_instance_values;)
              <hr>
          </text>
          <if cond=("@modeRequested"=="resolution" || "@modeRequested"=="gs")>
            <text ref=part_qn>
              <p>%I1_text1;</p>
            </text>
          </if>
          <text ref=statement>
            %debug;
            <p>%Qn_text;</p>
            %part_qn;
          </text>
          <return value="statement">
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
          <text ref=resolution>
            <p>%EP_text1;</p>
          </TEXT>
          <return value="resolution">
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
      <return value=text(Hint_text)>
    </function>  
  </question>
  ${finalAP}
</item>
    `;
    console.log(finalAP)
  return isl_code;
};
