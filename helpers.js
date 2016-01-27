function getDomainFromEmail(email, domainToFilterOut) {
  
  var domain = email.replace(/.*@/, "");
  if (domain.toLowerCase() == domainToFilterOut){  // filter out your own domains
     return "";
  }
  
  return "http://"+ domain.toLowerCase();
  
}

// This function relies on keyword matching
// Pick keywords that you want to watch

function isValidEvent(event, keywordsToMatch, keywordsToAvoid) {

    var title = event.getTitle();
    var validTitle = false;
	
	if (keywordsToMatch.indexOf(title.toLowerCase()) > -1 && 
		keywordsToAvoid.indexOf(title.toLowerCase()) == -1){
			
			 validTitle = true;
			
	}
    
    var guestList = event.getGuestList(true);
    var customerDomainCount = 0;
    
    for (var p=0;p<guestList.length;p++){
        var guest = guestList[p];
        var url = getDomainFromEmail(guest.getEmail());
        if (url.length>0){
           customerDomainCount++;  
        }
     }
     
     var isExternalMeeting = (customerDomainCount > 0);
     
     return (validTitle && isExternalMeeting);
}

function substituteNewlineWithBR(inputString){

  if(inputString){
    return inputString.replace(/(\r\n|\n|\r)/gm,"<br>");
  }

  return '';
}