Template.itemsList.helpers({
  items: function() {
  	var results = Session.get('searchResults');
  	if (results === undefined || results === null) {
  		return Items.find({});
  	} else {
  		return Items.find({_id: {
  			$in: _.map(results, function(result) {
  				return result.ref
  			})
  		}});
  	}
  }
});

Template.itemsList.rendered = function() {
	setupBlocks();
}

var colCount = 0;
var colWidth = 300;
var margin = 10;
var spaceLeft = 0;
var windowWidth = 0;
var blocks = [];

$(function(){
	$(window).resize(setupBlocks);
});

function setupBlocks() {
	windowWidth = $(window).width();
	blocks = [];

	// Calculate the margin so the blocks are evenly spaced within the window
	colCount = Math.floor(windowWidth/(colWidth+margin*2));
	spaceLeft = (windowWidth - ((colWidth*colCount)+(margin*(colCount-1)))) / 2;
	
	for(var i=0;i<colCount;i++){
		blocks.push(margin);
	}
	positionBlocks();
}

function positionBlocks() {
	$('.block').each(function(i){
		var min = Array.min(blocks);
		var index = $.inArray(min, blocks);
		var leftPos = margin+(index*(colWidth+margin));
		$(this).css({
			'left':(leftPos+spaceLeft)+'px',
			'top':min+ 60 + 'px'
		});
	blocks[index] = min+$(this).outerHeight()+margin;
	});	
}

// Function to get the Min value in Array
Array.min = function(array) {
   	return Math.min.apply(Math, array);
};