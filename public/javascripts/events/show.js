	voteOptionsDefaults = {
			complete: function () {}
	};

	placeVote = function(voteOptions) {
		castVote(voteOptions.voteAnchor, voteOptions.complete);
	};
	
	doneButton = function() {
		$('#whathappensnext_ok').click(function() { 
            $.unblockUI(); 
    		$.blockUI({message: '<p class="modalmessage first">Loading your account page...  Think about adding your photo!</p>'});
    		location.href='/account';
            return false; 
        }); 
 
        $.blockUI({ message: $('#whathappensnext') }); 
	};

	queueVote = function(voteOptions) {
		if($('#dayVotes').queue().length === 0){
			$('#DoneButton').parent().parent().parent().block({message: '', overlayCSS:  { backgroundColor: '#000', opacity: 0.8 }});
		}

		voteOptions = $.extend({}, voteOptionsDefaults, voteOptions);

		var old = voteOptions.complete;
		voteOptions.complete = function(){
			if ( old ) { old.apply( this, arguments ); }

			$('#dayVotes').dequeue();
			if($('#dayVotes').queue().length === 0){
				$('#DoneButton').parent().parent().parent().unblock();
			}
		};

		$('#dayVotes').queue(function(){
			placeVote( voteOptions );
		});
	};


	commentary = function()
	{
		if($(".positiveVote").length === $(".positiveVote > img[src*='smile-checked']").length)
		{
			addMessage('Wow! Thanks for making yourself, very available. I\'m sure the rest of participants will appreciate it.');
		}
		
		if($(".negativeVote").length === $(".negativeVote > img[src*='frown-checked']").length)
		{
			addMessage('Hey, what kind of an organizer schedules and plans an event but doesn\'t attend it???? Seriously, send us some feedback because we\'re curious.');
		}
	};

	buildVoterListForDayState = function (voteHistory, state, dateStr)
	{
      if(state === 'positiveVotes')
      {
		userList = '<h5 class="tooltip">This day works <span class="positive">great</span> for . . .</h5>';
	  } else {
	  	userList = '<h5 class="tooltip">This day is <span class="negative">bad</span> for . . .</h5>';
	  }
      userList += '<hr/><ul style="list-style-type:none;">';
      for(var user in voteHistory.when[dateStr])
      {
          if(user !== 'positiveVotes' && user !== 'negativeVotes' && user !== 'thisUserHasDecidingVote')
          {
              if(voteHistory.when[dateStr][user][state])
              {
                  pictureUrl = '<img class="smallpic" width=24 height=24 src="' + window.defaultPicUrl + '" />';

                  if(voteHistory.when[dateStr][user].pictureUrl)
                  {
                      pictureUrl='<img class="smallpic" width=24 height=24 src="' + voteHistory.when[dateStr][user].pictureUrl + '" />';
                  }
                  
                  userNick = voteHistory.when[dateStr][user].nickname;
                      
                  userList += '<li class="tooltiplist">' + pictureUrl + userNick + '</li>';
              }
          }
      }
      userList+='</ul>';
      
      return userList;
	};

	buildPositiveVoterListForDayState = function (voteHistory, dateStr)
	{
		return buildVoterListForDayState(voteHistory, 'positiveVotes', dateStr);
	};
	
	buildNegativeVoterListForDayState = function (voteHistory, dateStr)
	{
		return buildVoterListForDayState(voteHistory, 'negativeVotes', dateStr);
	};

	setEmptyTooltip = function(element)
	{
		element.unbind("mouseover").unbind("mouseout").unbind("click");
	};
	
	addVoterTooltip = function(element, userList)
	{
		thisUserList = function() { return userList; };
		
		element.tooltip({
			bodyHandler: thisUserList,
			track: true, 
		    delay: 0, 
		    showURL: false, 
		    extraClass: "pretty", 
		    fixPNG: true, 
		    opacity: 1, 
		    left: -120 
		});
	};
	
	updateVoteCalendarFromVoteHistory = function(voteHistory)
	{
		decidingVoteHtml = function () {return 'Deciding Vote';};
		
	    for(var dateStr in voteHistory.when)
	    {
            var date = new Date().setISO8601(dateStr);
            var monthAbbr = ['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()];
            var divIdForDate = monthAbbr + date.getDate();

            var thisUserHasDecidingVote = voteHistory.when[dateStr].thisUserHasDecidingVote;
            
            var totalSlots = voteHistory.totalVotesAvailable;
            
            if(thisUserHasDecidingVote !== null && thisUserHasDecidingVote !== undefined && thisUserHasDecidingVote === true) 
            {
            	positiveVoteElement = $("#" + divIdForDate + "_day").children('.positiveVote');
            	positiveVoteElement.tooltip({bodyHandler: decidingVoteHtml, showURL: false});
            	
            	positiveVoteElement.addClass('decidingVote');
            }

            var blocked = voteHistory.when[dateStr].blocked;
            var pos = voteHistory.when[dateStr].positiveVotes;
            var neg = voteHistory.when[dateStr].negativeVotes;

            dayElement = $("#" + divIdForDate + "_day");

            if(blocked)
            {
            	dayElement.addClass('disabled');
            	dayElement.children('.posVotes, .negVotes, .positiveVote, .negativeVote').hide();
    			setEmptyTooltip(dayElement);
    			
    			continue;
            }
            
            voteCountElement = $("#" + divIdForDate + "_day").children('.posVotes'); 

            userList = "";
            
            if(pos !== null && pos !== undefined && pos !== 0)
            {
                voteCountElement.text(pos);
                userList+=buildPositiveVoterListForDayState(voteHistory, dateStr);
    		}
            else
            {
            	setEmptyTooltip(voteCountElement);
            	voteCountElement.text('');
            }
    		
            voteCountElement = $("#" + divIdForDate + "_day").children('.negVotes');
    		if(neg !== null && neg !== undefined && neg !== 0)
    		{
                voteCountElement.text(neg);
                userList += (userList !== "" ? "<br/>" : "") + buildNegativeVoterListForDayState(voteHistory, dateStr);
    		}

    		if(userList !== "")
    		{
    			//userList += "<br/>Place <i>your vote</i> by check marking one of the smilies";
                addVoterTooltip(dayElement, userList);
    		}
    		else
    		{
    			setEmptyTooltip(dayElement);
    			voteCountElement.text('');
    		}
	    }

	};
	
    fetchVoteHistoryAndUpdate = function() 
	{
	    $.ajax({url: window.eventHistoryUrl,
		  		async: false,
		  		dataType: 'json',
		  		success: function(voteHistory) {
		  		    updateVoteCalendarFromVoteHistory(voteHistory);
		  		}
		 });
	};
	
	castVote = function(anchor, successCallback) {
		var randomnumber = Math.floor(Math.random()*1000001);
		
		$.ajaxQueue({
	          url: $(anchor).attr("href") + '?r=' + randomnumber,
	          dataType: "json",
	          success: function(msg){
	              delay = 4000;
	              
	              clearErrorAndMessagesFields();
	              
	              if(msg.messages) 
	              { 
	            	  displayMessages(msg.messages); 
	              }
	              
	              if(msg.success === true)
	              {
	            	  updateVoteCalendarFromVoteHistory(msg.result);
	            	  successCallback(anchor);
	              }
	              else 
	              {
	            	  highlightErrorFieldsBasedOnJsonResponse(msg);
	              }
	              
	              if(msg.result && msg.result.eventFinalized === true)
	              {
	                    $.blockUI({ message: '<p class="modalmessage first">Selecting the day</p>' });
	                    window.setTimeout(function() { window.location.reload(); }, 3000);
	              }
	              else
	              {
	            	  commentary();
	              }
	          }
	       });
	};
	
	isPositiveVoteAction = function(voteAnchor) {
		return $(voteAnchor).hasClass('positiveVote');
	}; 
	
	isDecidingVote = function(voteAnchor) {
		return $(voteAnchor).hasClass('decidingVote');
	};

	isNegativeVoteAction = function(voteAnchor) {
		return $(voteAnchor).hasClass('negativeVote');
	}; 
	
	hasPositiveVote = function(voteAnchor) {
		return $(voteAnchor).parent().find('.positiveVote img').attr('src') ===  '/images/smile-checked.gif';
	};

	hasNegativeVote = function(voteAnchor) {
		return $(voteAnchor).parent().find('.negativeVote img').attr('src') ===  '/images/frown-checked.gif';
	};

	castPositiveVote = function(voteAnchor, unblockDay) {
		onComplete = function(anchor) {$(anchor).find('> img').attr('src', '/images/smile-checked.gif'); if(unblockDay) {$(anchor).parent().unblock();}}; 
		queueVote({voteAnchor: voteAnchor, complete: onComplete});
	}; 
	
	castNegativeVote = function(voteAnchor, unblockDay) {
		onComplete = function(anchor) {$(anchor).find('> img').attr('src', '/images/frown-checked.gif'); if(unblockDay) {$(anchor).parent().unblock();}};
		queueVote({voteAnchor: voteAnchor, complete: onComplete});
	}; 
	
	removeNegativeVote = function(voteAnchor, unblockDay) {
		posVoteAnchor = $(voteAnchor).parent().find('.positiveVote');
		
        onComplete = function(anchor) {$(anchor).parent().find('.negativeVote > img').attr('src', '/images/frown-blank.gif'); if(unblockDay) {$(anchor).parent().unblock();}};
        queueVote({voteAnchor: posVoteAnchor, complete: onComplete});
	};

	removePositiveVote = function(voteAnchor, unblockDay) {
		negVoteAnchor = $(voteAnchor).parent().find('.negativeVote');
		
		onComplete=function(anchor) {$(anchor).parent().find('.positiveVote > img').attr('src', '/images/smile-blank.gif'); if(unblockDay) {$(anchor).parent().unblock();}};

		queueVote({voteAnchor: negVoteAnchor, complete: onComplete});
	};
	
$(function(){
	
	$("#cancelEventImage, #cancelEvent").click(function(e) {

		result=confirm('Are you sure you want to cancel the event?   Click OK to cancel the event.');

		if(result)
		{
			return true;
		}
		else
		{
	        e.preventDefault();
			return false;
		}
	});
	
	$(".removeUser").click(function(e) {

		result=confirm('Are you sure you want to remove that user from this event?   Click OK to remove them.');

		if(result)
		{
			return true;
		}
		else
		{
	        e.preventDefault();
			return false;
		}
	});

	$(".remindUser").click(function(e) {

		result=confirm('Send a reminder (e-mail) to that user?  Click OK to send the reminder.');

		if(result)
		{
			return true;
		}
		else
		{
	        e.preventDefault();
			return false;
		}
	});
	
	//Hide (Collapse) the toggle containers on load
	$(".slidecontainer").hide(); 

	/*
//Hide (Collapse) the toggle containers on load
	$(".guestslidecontainer").hide();
	$(".showsome").addClass("hidden");

	//Switch the "Open" and "Close" state per click
	$("a.guestslidetoggle").toggle(function(){
		$(".showall").addClass("hidden");
		$(".showsome").removeClass("hidden");
		$(".guestslidecontainer").slideDown("slow");
		}, function () {
		$(".showall").removeClass("hidden");
		$(".showsome").addClass("hidden");
		$(".guestslidecontainer").slideUp("slow");
	});

	//Slide up and down on click
	$("a.guestslidetoggle").click(function(){
		
	});
*/
	
	fetchVoteHistoryAndUpdate();

	$("a.negativeVote, a.positiveVote").click(function(e) {
        e.preventDefault();

        $(this).parent().block({ message: '<h4 style="color:white">Casting<br/> Vote...</h4>', css: { border: '0px', width: '0px', left:'20%', top:'30%', background:'none', margin:'0px'}, centerX: false, centerY: false , overlayCSS: { backgroundColor: '#000', opacity: '0.8' }}); 
        
		if(isPositiveVoteAction(this))
		{
			if(hasPositiveVote(this))  // unchecking
			{ 
				removePositiveVote(this, true);
				return;
			}
			else //checking
			{
				if(isDecidingVote(this))
				{
					result=confirm('Congratulations, you are about to cast the deciding vote. If you want the event to be on that day, Click OK.');

					if(result)
					{
					}
					else
					{
						$(this).parent().unblock();
						return false;
					}
				}

				if(hasNegativeVote(this)) 
				{ 
					removeNegativeVote(this);
				}
				
				castPositiveVote(this, true);
			}
		}
		
		if(isNegativeVoteAction(this))
		{
			if(hasNegativeVote(this)) // unchecking
			{
				removeNegativeVote(this, true);
				return;
			}
			else // checking
			{
				if(hasPositiveVote(this)) 
				{ 
					removePositiveVote(this);
				} 
				
				castNegativeVote(this, true);
			}
		}
		   
	       return false;
	   });
               
       $("#mapLink").tooltip({
			bodyHandler: function() {
				return 'Click to see a Map';
			},
		    delay: 0, 
		    showURL: false, 
		    showBody: " - ", 
		    extraClass: "pretty", 
		    fixPNG: true, 
		    opacity: 0.95, 
		    left: -120 
		});

		$('.submitBtn').hover(
			function(){ $(this).addClass('submitBtnHover'); },
			function(){ $(this).removeClass('submitBtnHover'); }
		);
		
		$('#comment').keypress(function(e){
		    if(e.charCode >= 48){
		        if($(this).val().length >= 500){
		            return false;
		        }
		    }
		});
});
