$(function(){
	var validateAndCountEmails = function(field) {
		var filter1  = /([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+>?$/;
		var filter2  = /<([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+>$/;
		var filter3  = /"[^"]+"\s?<([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+>$/;
		var error = 0;

		if (field.value === ''){
			return 0;
		}
		
        var aEmails = field.value.replace(/^[\s\n,;]*([\s\S]+?)[\s\n,;]*$/, "$1").split(/[\n\r;,]/g);
		var goodCount = 0;

		// For each of the emails
		for (index = 0; index < aEmails.length; index++) {
		    item = aEmails[index].trim();
		    if(item && item.length > 0) {			
    			if(item.search(filter1) === -1) {
    				error = 1; 
    			}
    			else if(item.search(filter1) > -1 && item.search(/[<>]/) > -1 && item.search(filter2) === -1){
    			    error = 1;
    			}
    			else if(item.search(filter1) > -1 && item.search(/\s/) > -1 && item.search(filter2) === -1){
    			    error = 1;
    			}
    			else if(item.search(filter1) > -1 && item.search(/"[<>]"/) > -1 && item.search(filter3) === -1){
    			    error = 1;
    			}
    			else if(item.search(filter1) > -1 && item.search(',') > -1 && item.search(filter3) === -1){
    			    error = 1;
    			}
    			else{
    			    goodCount++;
    			}
			}
		}

		if(error === 1 || goodCount === 0){
			return -1;
		}
		else{
			return goodCount;
		}
	};

	$.expr[':'].containsExactly = function(obj, index,event_meta, stack) {
	    return $(obj).text() ===event_meta[3];
	};
	
	var selectDropDownFromDescription = function(selector, description) {
		$(selector).val($(selector + " option:containsExactly('" + description+ "')").val());
	};
	
	var unexpectedErrorCreatingEvent = function (XMLHttpRequest, textStatus, errorThrown) {
		$.unblockUI(); 
		alert('Unexpected Error.  Notifying admins.  Please try again later');
	};
	
	var doLoginPrompt = function() {
		var pwToSubmit = "";
	
		$.nyroModalManual({
			minWidth: 350,
			minHeight: 220,
			ajax: {url: '/identify', data: {'loginId': $('#author').val() }},
			endShowContent: function(elts, settings) {
				$.unblockUI();
				$('#identityForm').ajaxForm({
					dataType: 'json',
					beforeSubmit:  function () {
						$.blockUI({ message: '<p class="modalmessage first">Logging you in</p>' }); 
					},
					success: function(data) { 
						$.unblockUI(); 
	
						if (data.success) 
						{
							$.nyroModalRemove(); 
							$.blockUI({ message: '<p class="modalmessage first">Sending your Flexvite</p>' }); 
							$('#createEventForm').ajaxSubmit({dataType:'json', success: loadingEvent, error:unexpectedErrorCreatingEvent});
						}
						else
						{
							clearModalErrorAndMessagesFields();

							if (data.errors.length > 0)
							{
								highlightErrors(data.errors, data.fieldNamesToHighlight, '#modalErrorsList');
							}
						} 
					}
				});
				$('#password').focus();
			}
		});
	};

	$('#createEventForm').ajaxForm({
		dataType: 'json',
		beforeSubmit:  function () {
			$.blockUI({ message: '<p class="modalmessage first">Creating your Flexvite</p>' });
		},
		success: function(data){
		    if(data.success){
		        $.unblockUI(
		            onUnblock: function(){
		                $.blockUI({ message: '<p class="modalmessage first">Sending your Flexvite</p>' });
		            }
		        );
		        if(data.createdUser){
    		        $.unblockUI({
    		            onUnblock: function(){
                            $.blockUI({ message: '<p class="modalmessage first">Emailing you a temporary password</p>' });
    		            }
    		        });
    		    }
		        $.unblockUI({
		            onUnblock: function(){
                        $.blockUI({ message: '<p class="modalmessage first">Loading your Flexvite</p>' });
                        $.unblockUI({
                            onUnblock: function(){
                                setTimeout(function(){
                                   $(window).load(data.url); 
                                }, 500);
                            }
                        });
		            }
		        });
		    }
		    else{
		        if(data.errors && data.errors.length > 0){
    		        $.unblockUI(
    		            onUnblock: function(){
                            // for(e in errors){
                            //     err = div(){
                            //         img('err.jpg');
                            //         span(e.message);
                            //     }
                            //     $('#flash').append(err)
                            //     $(e.field).css({ backgroundColor:'red' });
                            // }
    		            }
    	            );
		        }
		        else{
    		        $.unblockUI(
    		            onUnblock: function() {
                    		$.nyroModalManual({
                    			minWidth: 350,
                    			minHeight: 220,
                    			ajax: {
                    			    url: '/identify', 
                    			    data: { 'loginId': $('#author').val() }
                    			},
                    			endShowContent: function(elts, settings) {
                    				$.unblockUI(
                    				    unUnblock: function(){
                    				        $('#identityForm').ajaxForm({
                    				            dataType: 'json',
                    				            beforeSubmit: function(){
                    				                $.blockUI({ message: 'Logging in' });
                    				            },
                    				            success: function(data){
                    				                $.unblockUI(
                    				                    onUnblock: function(){
                    				                        if(data.success){
                    				                            $.nyroModalRemove();
                    				                            $.blockUI({ message: 'Sending your Flexvite' });
                    				                            $('#createEventForm').ajaxSubmit({
                    				                                dataType:'json',
                    				                                success
                    				                            })
                    				                        }
                    				                    }
                    				                );
                    				            }
                    				        });
                    				        $('#password').focus();
                    				    }
                    				);
                    				$('#identityForm').ajaxForm({
                    					dataType: 'json',
                    					beforeSubmit:  function () {
                    						$.blockUI({ message: '<p class="modalmessage first">Logging you in</p>' }); 
                    					},
                    					success: function(data) { 
                    						$.unblockUI(); 

                    						if (data.success) 
                    						{
                    							$.nyroModalRemove(); 
                    							$.blockUI({ message: '<p class="modalmessage first">Sending your Flexvite</p>' }); 
                    							$('#createEventForm').ajaxSubmit({dataType:'json', success: loadingEvent, error:unexpectedErrorCreatingEvent});
                    						}
                    						else
                    						{
                    							clearModalErrorAndMessagesFields();

                    							if (data.errors.length > 0)
                    							{
                    								highlightErrors(data.errors, data.fieldNamesToHighlight, '#modalErrorsList');
                    							}
                    						} 
                    					}
                    				});
                    				$('#password').focus();
                    			}
                    		});
                    	}
    	            );
		        }
		    }
		},
		error: unexpectedErrorCreatingEvent
	});

	var validateEmail = $('#emailCount');
	var validateEmailText = $('#emailValidationMessage');

	validateEmailText.html('&nbsp;');

	$('#who').blur(function() {
		var t = this;
		if (this.value !== this.lastValue) {
			if (this.timer) { clearTimeout(this.timer); }

			// validateEmail.show();
			validateEmailText.removeClass('positive');
			validateEmailText.removeClass('negative');
			validateEmailText.html('Validating Email');
			
			var validateEmails = function() {
				var emailCount = validateAndCountEmails(t);

				if (emailCount > 0 ) {
					validateEmailText.addClass('positive');
					validateEmailText.html(emailCount + ' e-mail ' + (emailCount > 1 ? 'addresses' : 'address') + ' recognized');
				}
				else if (emailCount === 0) {
					validateEmailText.html('&nbsp;');
				}
				else {
					validateEmailText.addClass('negative');
					validateEmailText.html('Not a valid list of e-mails.');
				}
			};
			
			this.timer = setTimeout(validateEmails, 200);

			this.lastValue = this.value;
		}
	});

	$('#what').result(function(event, data, formatted) {
		if(data in eventsAndTimes) {
			$('#startTime').val(eventsAndTimes[data].time);
			
			if(eventsAndTimes[data].day) {
				selectDropDownFromDescription('#dayfilter', eventsAndTimes[data].day);
			}
			
			if(eventsAndTimes[data].day) {
				selectDropDownFromDescription('#weeklimit', eventsAndTimes[data].week);
			}
	
		}
	});
	
	$("#what").focus();
});