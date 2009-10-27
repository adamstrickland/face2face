$.(function(){
    addSlideBehaviors = function(){
    	$("h4.slidetoggle").toggle(function(){
    		$(this).addClass("active"); 
    	}, 
    	function () {
    		$(this).removeClass("active");
    	});

    	$("h4.slidetoggle").click(function(){
    		$(this).next(".slidecontainer").slideToggle("slow");
    	});
    }
    
    addSlideBehaviors();
});