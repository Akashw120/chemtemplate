const getENGCode = (engText) => {
  var eng_code = `
<def>
    <!-- Title of the page -->
    <var name=Title value="">
    ${engText[0]}
    
    <text ref=Qn_text></text>
    ${engText[1]}
    <text ref=Hint_text></text>
</def>
    `;
  return eng_code;
};
