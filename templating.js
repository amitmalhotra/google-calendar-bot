function getTopLevelTemplate() {
  var t = HtmlService.createTemplateFromFile('mainTemplate');
  return t;
}

function getWeeklyTemplate() {
  var t = HtmlService.createTemplateFromFile('weeklySummary');
  return t;
}


function getTRTemplate() {
  var t = HtmlService.createTemplateFromFile('rowTemplate');
  return t;
}

function getTDTemplate() {
  var t = HtmlService.createTemplateFromFile('columnTemplate');
  return t;
}

function substituteNewlineWithBR(inputString){

  if(inputString){
    return inputString.replace(/(\r\n|\n|\r)/gm,"<br>");
  }

  return '';
}