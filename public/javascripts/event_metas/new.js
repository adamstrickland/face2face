$(function(){
    ajaxFormOptions = {
        dataType:'json',
        beforeSubmit:function(){ $.blockUI({ message: modalDiv('Creating your Flexvite') }) },
        success:function(data){
            $.unblockUI({
                onUnblock:function(){
                    if(data.errors && data.errors.length > 0){
                        displayErros(data.errors);
                    }
                    else if(data.requiresLogin){
                        promptForLogin();
                    }
                    else{
                        $.blockUI({ message: modalDiv('Sending your Flexvite') });
                        $.unblockUI({
                            onUnblock:function(){
                                $.blockUI({
                                   message: modalDiv(data.userCreated ? 'Emailing you a temporary password' : 'Loading your Flexvite')
                                });
                                setTimeout(function(){ $(window).location = data.url; }, 500);
                            }
                        });
                    }
                }
            });
        },
        error:function(data){
            displayErrors(data.errors);
        }
    };
    
    modalDiv = function(msg){
        return '<p class="modalmessage first">'+msg+'</p>';
    }

    clearFormErrors = function(){
        // $('#createEventForm').clear();
    }

    clearErrors = function(){
        // $('.error').clear();
        clearFormErrors();
    }

    displayErrors = function(errors){
        // displayErrorsForForm('#createEventForm', errors);
    }    
    
    removeAddressAndMapLink = function(){
     	$('#mapLink').val('');
    	$('#findaplace').unbind("mouseover").unbind("mouseout").unbind("click"); //remove tooltip

    	$('#address').fadeOut("fast");
    	window.setTimeout("$('#address').html('');",2000);

    	$('#priorAddressName').val($(this).val());
    }

    pickLocationPopup = function() {
    	$.nyroModalManual({
    		minWidth: 200,
    		minHeight: 100,
    		title: '',
    		ajax: {url: '/pickLocation'},
    		endShowContent: function(elts, settings) {
    			whereContent = $('#where').val();
    			if (whereContent) {
    				$('#searchTerm').val(whereContent);
    				$('#spot').focus();
    			}
    			else {
    				$('#searchTerm').focus();
    			}

    			$('#locationForm').ajaxForm({
    				success: function(data) { 
    				    $('#locationSearchResultDiv').html(data);
        				$.nyroModalSettings({height:'450', width: '750'});
        			}
    			});
    		}
    	});
    }

    selectedLocationChoice = function(choiceDiv) {
    	var container = $(choiceDiv).parent().parent();
    	var containerId = container.attr('id');
    	var addressLine1 = $('#' + containerId + ' div.addressLine1').text();
    	var addressLine2 = $('#' + containerId + ' div.addressLine2').text();
    	var phone = $('#' + containerId + ' div.phoneNumber').text();
    	var city = $('#' + containerId + ' div.city').text();
    	var mapLink = $('#' + containerId + ' div.mapLink a').attr('href');
    	var title = $('#' + containerId + ' div.locationTitle').text();

    	$.nyroModalRemove(); 

    	$('#where').val(title);
    	$('#priorAddressName').val(title);
    	$('#mapLink').val(mapLink);
        $('#address').html(
            '<a href="'+mapLink+'" target="_blank"><img id="mapIcon" src="/images/map.png"></a><a href="#" onclick="removeAddressAndMapLink()"><img width=7 height=7 style="float:right;" src="/images/cross.gif" alt="Remove Map link" /></a>' + 
            addressLine1 + '<br/>' + (addressLine2 ? addressLine2 : city)
        );
        $('#address').fadeIn("fast");

    	$('#findaplace img').attr('src','/images/map.gif');
    	$('#findaplace').tooltip({
    		bodyHandler: function() {
    		    return 'A Map link has been generated for ' + title + ' at ' + addressLine1 + ', ' + addressLine2;
        	},
        	title:title,
        	delay: 0, 
        	showURL: false, 
        	showBody: " - ", 
        	extraClass: "pretty", 
        	fixPNG: true, 
        	opacity: 0.95, 
        	left: -120 
    	});

    	$('#dayfilter').focus();
    }

    promptForLogin = function(){
        $.nyroModalManual({
           minWidth:350,
           minHeight:220,
           ajax:{
               url:'/identify',
               data:{ 'loginId':$('#author').val() }
           },
           endShowContent:function(elts, settings){
               $.unblockUI();
               $('#identityForm').ajaxForm({
                   dataType:'json',
                   beforeSubmit:function(){ $.blockUI({ message: modalDiv('Logging you in') }) },
                   success:function(data){
                       $.unblockUI({
                           onUnblock:function(){
                              clearErrors();
                               if(data.errors && data.errors.length > 0){
                                   displayErrors(data.errors);
                               }
                               else{
                                   $.nyroModalRemove();
                                   $.blockUI({ message: modalDiv('Sending your Flexvite') });
                                   $('#createEventForm').ajaxSubmit(ajaxFormOptions);
                               }
                           }
                       });
                   }
               });
               $('#password').focus();
           }
        });
    };
    
    suggestedEvents = function(){
        return [
            { what:"Lunch", time:"11:30 am", day:"weekday", week:"two weeks"},
            { what:"All of us should get together for Drinks", time:"6:00 pm"},
            { what:"Barbeque", time:"4:00 pm"},	  
            { what:"Baby Shower", time:"2:00 pm", day:"Sat/Sun"},	  
            { what:"Bachelor Party", time:"6:00 pm", day:"Fri/Sat"},	  
            { what:"Bachelorette Party", time:"6:00 pm", day:"Fri/Sat" },	  
            { what:"Bridal Shower", time:"2:00 pm", day:"Sat/Sun"},	  
            { what:"Beers and Brats", time:"6:00 pm", day:"Fri/Sat"},
            { what:"Beer Tasting", time:"6:00 pm", day:"Fri/Sat"},
            { what:"Birthday Dinner", time:"7:00 pm"},	  
            { what:"Basketball 3-on-3", time:"6:30 pm"},
            { what:"Bike the Lake - Morning", time:"6:00 am"},	  
            { what:"Bike Ride", time:"7:00 am"},	  
            { what:"Board Game Night", time:"7:00 pm"},	  
            { what:"Book Club", time:"6:00 pm"},	  
            { what:"Breakfast", time:"7:30 am"}, 
            { what:"Brunch", time:"10:00 am"},
            { what:"Camping", time:"5:30 pm", week:"four weeks"}, 			
            { what:"Coffee", time:"5:30 pm"}, 			
            { what:"Company Outing", time:"11:30 am", day:"weekday", week:"four weeks"},	  
            { what:"Company Picnic", time:"2:00 pm", day:"Sat/Sun", week:"four weeks"},	  
            { what:"Cook off", time:"6:00 pm"},	  
            { what:"Co-working at the Coffee Shop", time:"9:00 am", day:"Mon-Fri"},	  
            { what:"Date", time:"7:00 pm"},
            { what:"Day on the Lake", time:"8:00 am", day:"Sat/Sun", week:"four weeks"},
            { what:"Deer Hunting", time:"7:00 am"},
            { what:"Dinner", time:"7:00 pm"}, 
            { what:"Drinks", time:"6:30 pm"},	  
            { what:"Driving Range Smackdown", time:"2:00 pm"},
            { what:"DVD Marathon", time:"9:00 am", day:"Sat/Sun"},
            { what:"Early Lunch", time:"11:15 am", day:"weekday", week:"two weeks"},
            { what:"Early Dinner", time:"6:00 pm", day:"weekday", week:"two weeks"},
            { what:"End of Summer Party", time:"3:00 pm"},
            { what:"Feedback Session", time:"11:45 am"},
            { what:"Footrace", time:"8:00 am"},	  
            { what:"Food day at work", time:"9:00 am", day:"weekday"},
            { what:"Game Night", time:"7:00 pm"}, 
            { what:"Girls Night In", time:"7:00 pm", day:"Fri/Sat", week:"four weeks"}, 
            { what:"Girls Night Out", time:"7:00 pm", day:"Fri/Sat", week:"four weeks"},
            { what:"Golf", time:"9:00 am", day:"Sat/Sun", week:"four weeks"},
            { what:"Guys Night", time:"7:00 pm"},
            { what:"Halloween Party", time:"7:00 pm"},	  
            { what:"Happy Hour", time:"6:30 pm", day:"Mon-Thu", week:"two weeks"},	  
            { what:"Homebrew", time:"6:00 pm"},	  
            { what:"House Warming", time:"7:00 pm"},
            { what:"Hunting", time:"7:00 am"},
            { what:"Hoops", time:"6:30 pm"},
            { what:"Interested in Lunch?", time:"11:30 am", day:"weekday", week:"two weeks"},
            { what:"Jam Session", time:"7:00 pm"},
            { what:"Kayaking Day", time:"11:30 am"},
            { what:"Late Lunch", time:"1:00 pm", day:"weekday", week:"two weeks"},
            { what:"Late Dinner", time:"8:00 pm"},
            { what:"Let's go volunteer somewhere", time:"9:00 am", day:"Sat/Sun" },
            { what:"Let's rent a party boat!", time:"9:00 am", day:"Sat/Sun", week:"four weeks"},
            { what:"Meeting", time:"2:00 pm", day:"Mon-Fri"},
            { what:"Mountain Biking Afternoon", time:"1:30 pm"},
            { what:"Movie Night", time:"7:00 pm", day:"Fri/Sat"},
            { what:"Movie's at our House", time:"7:00 pm"},
            { what:"No Kid Night", time:"7:00 pm"},
            { what:"Off-site Meeting", time:"7:00 pm", day:"Mon-Fri"},
            { what:"Party", time:"7:00 pm"},
            { what:"Playdate", time:"10:00 am"},
            { what:"Picnic", time:"1:00 pm"}, 
            { what:"Phone Call", time:"3:00 pm"},
            { what:"Poker Night", time:"7:00 pm", day:"Fri/Sat"},
            { what:"Pool Party", time:"1:00 pm", day:"Sat/Sun"},
            { what:"Pot Luck Dinner", time:"7:00 pm"},
            { what:"Practice", time:"7:00 pm"},
            { what:"Racquetball", time:"7:00 am"},
            { what:"Rock Climbing", time:"7:00 pm"},
            { what:"Quail Hunting", time:"7:00 am"},
            { what:"Recipe Swap", time:"7:00 pm"},
            { what:"Sales Meeting", time:"2:00 pm"},
            { what:"Shopping Trip", time:"10:00 am"},
            { what:"Soccer Night", time:"6:30 pm"},
            { what:"Swimming", time:"1:00 pm"},
            { what:"Tennis Smackdown", time:"2:00 pm"},
            { what:"Turkey Hunting", time:"7:00 am"},
            { what:"Unicorn Racing", time:"3:30 am"},
            { what:"Video Game Jam", time:"5:00 pm"},
            { what:"Visit a local Winery", time:"6:00 pm", day:"Sat/Sun"},
            { what:"Weekend Getaway", time:"5:00 pm"}, 
            { what:"Weekend at the cabin", time:"5:00 pm"},
            { what:"Wine Tasting", time:"6:00 pm", day:"Fri/Sat"},
            { what:"Xylophone Jam Session", time:"3:30 am"},
            { what:"Yodeling Practice", time:"3:30 am"},
            { what:"Zeppelin Race", time:"3:30 am"}
        ];
    }

    $('#who').blur(function(e){
        fdbk = $('#emailValidationMessage');
        fdbk.removeClass('positive').removeClass('negative').html('Validating...');
        clearTimeout(this.timer);
        setTimeout(function(){
            if(this.value.length > 0){
                var values = field.value.replace(/^[\s\n,;]*([\s\S]+?)[\s\n,;]*$/, "$1").split(/[\n\r;,]/g);
                var emails = jQuery.each(values, function(i, val){
                    return val.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/);
                });
                if(emails.length != values.length){
                    fdbk.addClass('negative').html('Not a valid list of emails.');
                }
                else{
                    fdbk.addClass('positive').html(emails.length+' emails recognized.');
                }
            }            
        }, 200);
    });

 	if($('#daterange').is(":visible")){
	    $('#daterange').daterangepicker({
	        arrows: false,
			presetRanges: [		
	    		{text: 'the next 7 days', dateStart: 'today', dateEnd: 'today+7days' },
	    		{text: 'this week', dateStart: 'today', dateEnd: 'next saturday' },
	    		{text: 'next week', dateStart: 'next sunday', dateEnd: function(){ return Date.today().next().saturday().add(7).days(); } },
	    		{text: 'the next 2 weeks', dateStart: 'today', dateEnd: 'today+14days' },
	    		{text: 'the next month', dateStart: 'today', dateEnd: 'next month' }
			],
			presets: {
				dateRange: 'Date Range'
			},
			dateFormat: 'm/d/y',
			earliestDate: '-1 years',
			latestDate: '+1 years',
			onClose: function(){
	            $('#daterange').css({'background' : 'white'});
		    }
	    });
	}
    
    choices = [];
	$.each(['am', 'pm'], function(i, p){
	   for(h = 1; h <= 12; h++){
	       for(m = 0; m < 59; m += 15){
	           choices.push($.format('{0:d}:{1:02d} {2}', [h,m,p]))
	       }
	   } 
	});
    $('#startTime').autocomplete(choices);

    $('#what').autocomplete(suggestedEvents(), {
      formatItem: function(item) {
        return item.what;
      }
    }).result(function(e, item, format){
        $('#startTime').val(item.time);
        if(item.day){ $("#dayFilter").val(item.day).attr("selected", "selected"); }
        if(item.week){ $("#weekLimit").val(item.week).attr("selected", "selected"); }
    });

    $('#createEventForm').ajaxForm(ajaxFormOptions);
    
	$('#startTimeTimeZone').val($.getTimeZoneOffset);
	
    $("#advanced_options_slidetoggle").toggle(function(){
		$(this).addClass("active"); 
	}, 
	function () {
		$(this).removeClass("active");
	});

	$("#advanced_options_slidetoggle").click(function(){
		$(this).next(".slidecontainer").slideToggle("slow");
	});
});