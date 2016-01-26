function calendars() {
 
     var calendarsToFollow = [
                              abc@yourdomain.com,
                              def@yourdomain.com,
                              xyz@yourdomain.com
                            ];                  
   
     var eventsToCopy = {};
     
     // if running on sat or sunday, get the next monday
     // if running on monday, get today
     // if running on tuesday-friday, get previous monday and today
     var startDate = Date.today().next().monday();
     var endDate = Date.today().next().saturday();
          
      if(Date.today().is().monday()){
        startDate = Date.today();
      }else if(Date.today().is().tuesday() || Date.today().is().wednesday() || Date.today().is().thursday() || Date.today().is().friday()){
        startDate = Date.today().previous().monday();
      }
      
     
     Logger.log ('start date %s end date %s', startDate, endDate);
     
     for (var i=0;i<calendarsToFollow.length; i++){
       
       var calendarId = calendarsToFollow[i];
       var calendar = CalendarApp.getCalendarById(calendarId);
       
       if(calendar){
          
          var events = calendar.getEvents(startDate, endDate);
          
          for(var k=0;k<events.length;k++){
          
              var event = events[k];
              var title = event.getTitle();
              var id = event.getId();
              
              if (isValidEvent(event)) {
                    
                    var eventExists = eventsToCopy[id];
                    if (eventExists){
                    }else{
                       eventsToCopy[id] = event;
                    }
              
              } 
          }
          
          
       }else{
          Logger.log('no calendar found for %s', calendarId);
       }
      
    }
      
    // remove moved events
    removeMovedEvents(eventsToCopy);
   
    //copy all events into your calendar
    var keys = Object.keys(eventsToCopy);
    Logger.log('no of events: %s', keys.length);
    
    for (var i=0;i<keys.length;i++){
        var key = keys[i];
        
        var eventToCopy = eventsToCopy[key];
        addToCalendar(eventToCopy);
        
    }
   
  
  
}

function addToCalendar(event) {

   var title = event.getTitle();
   var startTime = event.getStartTime();
   var endTime = event.getEndTime();
   
   // check if this event already copied. if so,skip it
   
   if(eventInCalendar(title, startTime, endTime)){
     Logger.log(title + ': event already added');
     return;
   }
   
   var desc = event.getDescription();
   var location = event.getLocation();
   var guestList = event.getGuestList(true);
   
   var guests = "Invitees:\n";
   var urls = {};
   
   for (var p=0;p<guestList.length;p++){
      var guest = guestList[p];
      guests = guests + '\n ' + guest.getEmail();
      var url = getDomainFromEmail(guest.getEmail());
      if (url.length>0){
         urls[url]=url;
      }
   }
   
   var additionalInfo = "";
   var keys = Object.keys(urls);
   for (var i=0;i<keys.length;i++){
        var key = keys[i];
        additionalInfo += key + "\n";
        
    }
    
   var description = desc + '\n ' + additionalInfo + '\n ' + guests;
   
   var calendar = customerCallsCalendar();
   var event = calendar.createEvent(title,
     startTime,
     endTime,
     {location: location, 
      description: description
     });
   event.setTag("type", "customerCall");
 
  

}


function eventInCalendar(title, startTime, endTime){

   var calendar = customerCallsCalendar();
   var events = calendar.getEvents(startTime, endTime,
     {search: title});
     
   return (events.length>0) ;

}


function customerCallSummary(){


   var recepients = 'you@yourdomain.com';
   var callLiteral = 'Calls';
   
   var mainTemplate = getTopLevelTemplate();
   var weeklyTemplate = getWeeklyTemplate();
   
   // get this weeks events marked with type = customerCall
   
   var events = getCustomerCallEvents();
   
   //weekly stuff
   weeklyTemplate.callCount = events.length;
   weeklyTemplate.callLiteral = callLiteral;
   weeklyTemplate.callListHtml = '';
   
   mainTemplate.mainTitle = 'Upcoming Week Roundup';
   mainTemplate.poweredBy = 'Your TagLine';
   mainTemplate.weeklySummary = weeklyTemplate.evaluate().getContent();
   
   var trContent = '';
   
   for (var i=0;i<events.length;i++){
   
       var rt = getTRTemplate();
       var ct = getTDTemplate();
       
       var event = events[i];
       var title = event.getTitle();
       var startTime = moment(event.getStartTime());
       var endTime = moment(event.getEndTime());
       var description = substituteNewlineWithBR(event.getDescription());
       
       ct.eventTitle = title;
       ct.startTime = startTime.format('dddd') + ' ' + startTime.format('h:mm a');
       ct.endTime = endTime.format('h:mm a');
       ct.description = description;
       ct.columnNumber = 'first';
       
       rt.tdContent = ct.evaluate().getContent();
       trContent += rt.evaluate().getContent();
   }
   
   mainTemplate.trContent = trContent;
   
   var htmlBody = mainTemplate.evaluate().getContent();

   // for testing purposes.. uncomment
   // var blob = Utilities.newBlob(htmlBody, 'text/html', 'report.html');
   
   var subject = 'Customer Calls: Upcoming Week';
   
   MailApp.sendEmail(recepients,
                    subject,
                    'This message requires HTML support to view.',
                    {
                      name: 'Customer Calls',
                      htmlBody: htmlBody
                    });

}

function getCustomerCallEvents(){

  var startDate = Date.today().next().monday();
  var endDate = Date.today().next().saturday();
        
  if(Date.today().is().monday()){
      startDate = Date.today();
  }else if(Date.today().is().tuesday() || Date.today().is().wednesday() || Date.today().is().thursday() || Date.today().is().friday()){
      startDate = Date.today().previous().monday();
  }
  
  return getCustomerCallEventsForDates(startDate, endDate);

}

function getCustomerCallEventsForDates(startDate, endDate){

  var calendar = customerCallsCalendar();
  var events = calendar.getEvents(startDate, endDate);
  var customerCallEvents = [];
  
  for(var i=0;i<events.length;i++){
  
     var event = events[i];
     var type = event.getTag("type");
     if (type == 'customerCall'){
         customerCallEvents.push(event);
     }
  
  }

 return customerCallEvents;
}


function customerCallsCalendar(){

  var calendarId = "yourdomain_nuvfvvcvsecavjoponppi93sh8@group.calendar.google.com";
  var calendar = CalendarApp.getCalendarById(calendarId);
  return calendar;

}


function removeMovedEvents(candidateEvents){

    // check existing events in CustomerCalls Calendar 
    // if any event is in the Calendar thats not in the 
    // new candidates, then remove it from the CustomerCalls Calendar
    // do this before new events get copied
    
    var startDate = Date.today().next().monday();
    var endDate = Date.today().next().saturday();
          
    if(Date.today().is().monday()){
      startDate = Date.today();
    }else if(Date.today().is().tuesday() || Date.today().is().wednesday() || Date.today().is().thursday() || Date.today().is().friday()){
      startDate = Date.today().previous().monday();
    }
      
    var existingEvents = getCustomerCallEventsForDates(startDate, endDate);
    var movedEvents = [];
    
    for(var i=0;i<existingEvents.length;i++){
        
        var existingEvent = existingEvents[i];
        var existingEventId = existingEvent.getId();
        var eventToCopy = candidateEvents[existingEventId];
        if(eventToCopy){
        }else{
           movedEvents.push(existingEvent);
        }
        
    
    }
    
    for(var i=0;i<movedEvents.length;i++){
      
       var movedEvent = movedEvents[i];
       movedEvent.deleteEvent();
    
    }


}


function deleteVagrant(){
 // Demo Follow Up and Feedback - 
 
 var startTime = Date.today();
 var endTime = Date.today().next().saturday();
 var title = "Title of Event to be Deleted";
 var events = CalendarApp.getDefaultCalendar().getEvents(startTime, endTime,
     {search: title});
     
 for (var i=0;i<events.length;i++){
   
     var event = events[i];
     event.deleteEvent();
 }
 
}


function testAdd(){
 
   var startTime = Date.today();
   var endTime = Date.today().next().saturday();
   var title = "Preliminary Demo - Acme Corp ";
   var calendar = CalendarApp.getCalendarById('somone@yourdomain.com');
   var events = calendar.getEvents(startTime, endTime,
       {search: title});
       
   for (var i=0;i<events.length;i++){
       var event = events[i];
       event.addGuest('you@yourdomain.com');
   }
 }
 
 function testCal(){
 
   var startTime = Date.today();
   var endTime = Date.today().next().saturday();
   
   var calendars = CalendarApp.getAllOwnedCalendars();
   for (var i=0; i<calendars.length; i++){
       var calendar = calendars[i];
       Logger.log(calendar.getName() + " : " + calendar.getId());
   }

 
 
 }