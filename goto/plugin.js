(function(){
var buildListHasRunOnce = false;
var rebuildTable;
var buildTable = function() {
	var titles = getTitles();
	if (buildListHasRunOnce) {
		// Remove the old unordered list from the dom.
		// This is just to cleanup the old list within the iframe
		$(this._.panel._.iframe.$).contents().find("ul").each(function(){
			if($(this).find('a').attr("title") == "Go to"){
				$(this).remove();
			}
		});
		// reset list
		this._.items = {};
		this._.list._.items = {};
	}
	for (var i in titles) {
		// do your add calls
		this.add(i, titles[i] , "Go to");
	}
	if (buildListHasRunOnce) {
		// Force CKEditor to commit the html it generates through this.add
		this._.committed = 0;
		// We have to set to false in order to trigger a complete commit()
		this.commit();
	}
	buildListHasRunOnce = true;
};

function getTitles() {
	var titles = [],
	    id = 0;
	$(":header", $("iframe.cke_wysiwyg_frame").contents()).each(function(index) {
		var titleText = '' + $(this).text();
		// $(this).attr("id", id++);
		$(this).prepend("<span id='" + id++ + "'></span");
		if($(this).is("h2")){
			titleText = " - " + titleText;
		} else if ($(this).is("h3")){
			titleText = "   - " + titleText;
		}
		titles.push(titleText);
	});
	return titles;
}

CKEDITOR.plugins.add('goto', {
	requires : 'richcombo',

	init : function(editor) {
		var config = editor.config;
		if (editor.blockless)
			return;

		editor.ui.addRichCombo('goto', {
			label : "Go to...",
			title : "Go to",
			toolbar : 'styles,20',
			panel : {
				css : [CKEDITOR.skin.getPath('editor')].concat(config.contentsCss),
				multiSelect : true,
				attributes : {
					'aria-label' : "Go to..."
				}
			},

			init : function() {
				this.startGroup("Go to");
				rebuildTable = CKEDITOR.tools.bind(buildTable, this);
				rebuildTable();
				$(editor).bind('rebuildTable', rebuildTable);
			},

			onClick : function(value) {
				$("iframe.cke_wysiwyg_frame").attr("src", "#" + value);
			},

			onOpen : function() {
				rebuildTable();
				this.showAll();

			}
		});
	}
});
})();
