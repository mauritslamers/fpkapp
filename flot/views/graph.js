// ==========================================================================
// Project:   Flot.GraphView
// Copyright: ©2010 Bo Xiao <mail.xiaobo@gmail.com>, Inc.
// ==========================================================================
/*globals Flot */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

//sc_require('core.js');

SC.warn('Plotselected is attached to FLOT => not proven (flot/views/graph.js)');

Flot.GraphView = SC.View.extend( SC.ActionSupport,
/** @scope Flot.GraphView.prototype */ {
	backgroundColor: 'white',
	plot: null,
	
	series: null,
	data: null ,
	options: null ,
	debugInConsole: false ,
	
	action: 'bla',
	target: 'blo',
	
	
	trace: function(){
		if (this.debugInConsole){
			if (SC.typeOf(arguments[0]) == 'string') arguments[0] = "Flot.GraphView: " + arguments[0];
			SC.info.apply(this, arguments);
		}
	},
	
	render: function(context, firstTime) {
		this.trace('will render.....%@', this);
		
		sc_super();
		
		if( !this.get('layer') || ! this.get('isVisibleInWindow')) {
			this.trace('has no layer or not visible.....');
			return;
		}
		

		if((this.get('frame').width <= 0) || (this.get('frame').height <= 0)) {
			this.trace('frame has no size.....');
			return;
		}
		
		if( ($(this.get('layer')).width() <= 0)
				|| ($(this.get('layer')).height() <= 0)){
					this.trace('view has no size()')
			return;
		}

		var data = this.get('data'),
		series = this.get('series');
		if (!SC.empty(data)) {
			this.trace('has data... %@', this.get('layer'));
			
			this.plot = Flot.plot(this.get('layer'), data.toArray(), this.get('options'));
			this.trace("%@", data.toArray());
			this.bindSelectionListener();			
			
			this.trace('render data');
		} else if (!SC.empty(series)) {
			this.plot = Flot.plot(this.get('layer'), series.toArray(), this.get('options'));
			this.bindSelectionListener();
			this.trace('render series');
		} else {
			this.trace('data was empty');
		}
	},
	
	didCreateLayer: function(){
		this.trace('did created the basic layer...%@', this.get('layer'));
		var data = this.get('data'),
			 series = this.get('series');
		
		if (!SC.empty(data)) {
			this.trace('has data... %@', this.get('layer'));

			this.plot = Flot.plot(this.get('layer'), data.toArray(), this.get('options'));
			this.bindSelectionListener();			

			this.trace('render data on flot %@', this.plot);
		} else if (!SC.empty(series)) {
			this.plot = Flot.plot(this.get('layer'), series.toArray(), this.get('options'));
			this.bindSelectionListener();
			this.trace('render series on flot %@', this.plot);
		} else {
			this.trace('data was empty');
		}
	},
	
	willDestroyLayer: function(){
		this.trace('will detroy layer ...%@', this.get('layer'));
		this.unbindSelectionListeners();
		if (this.plot) this.plot.shutdown();
		this.plot = null;
	},
	
	plotselected: function(event, ranges){
		SC.info('PLOT SELECTED CALLSED');
		var o = this.get('options');
		
		o.xaxis.min = ranges.xaxis.from;
		o.xaxis.max = ranges.xaxis.to;
		
		
		//this.set('options', o);
		this.setLayerNeedsUpdate() ;
		this.trace('options changed');
	},
	
	
	plotclicked: function(event, position, item){
		//if (item) {
		//	this.plot.highlight(item.series, item.datapoint);
		//}	
		
		// var action = this.get('action');
		// var target = this.get('target');
		// var pane = this.get('pane');
		// if (pane) {
		// 	pane.rootResponder.sendAction(action, target, this, pane, item, event, position);
		// }
		this.set('actionContext', {event:event, position:position, item:item});
		this.invokeOnce('click');
		
		//this.fireAction();
	},
	
	click: function(){
		this.fireAction();
	},
	
	bindSelectionListener: function(){
		// remove previous event
		$(this.get('layer')).bind("plotselected");
		
		var me = this;
		
		$(this.get('layer')).bind("plotclick", function (event, pos, item) {
			me.plotclicked(event, pos, item);
		});
		
		// attach again...
		
		$(this.get('layer')).bind("plotselected", function (event, ranges) {
			me.plotselected(event, ranges);
	    });
		
	},
	
	unbindSelectionListeners: function(){
		this.trace("unbinding existing events...");
		var l = $(this.get('layer'));
		if (l){
			l.off("plotclick");
			l.off("plotselected");
		}	
	},
	
    plotDataDidChange: function() {
		this.displayDidChange() ;
		this.trace('data changed to %@', this.get('data'));
	}.observes('data','data.[]'),
    
    plotSeriesDidChange: function() {
		this.displayDidChange() ;
		if (this.debugInConsole) console.log('series changed');
	}.observes('.series','.series.[]'),
	
	//     plotOptionsDidChange: function() {
	// 	this.displayDidChange() ;
	// 	if (this.debugInConsole) console.log('options changed');	
	// }.observes('.options', '.options.[]'),
	
    visibilityDidChange: function() {
		if(this.get('isVisibleInWindow') && this.get('isVisible')) {
			this.trace('visibility changed');
			this.displayDidChange() ;
		}		
	}.observes('isVisibleInWindow','isVisible'),
	
	//     layerDidChange: function() {
	// 	if (this.debugInConsole) console.log('layerchanged');
	// 	this.setLayerNeedsUpdate() ;	
	// }.observes('layer'),
	
    layoutDidChange: function() {
		sc_super();
		this.trace('layout changed');
		this.displayDidChange();
	},
	
    updateLayerLocationIfNeeded: function() {
		var ret = sc_super() ;
		this.trace('layer location update');
		this.displayDidChange() ;
		return ret;
	},
	
    setLayerNeedsUpdate: function() {
		this.invokeOnce(function() {
			this.set('layerNeedsUpdate', YES);
			this.trace('need update') ;
		});
	},
	
    viewDidResize: function() {
		sc_super();
		this.setLayerNeedsUpdate() ;
		this.trace('view did resize');
	}.observes('layout'),
	
	
    parentViewDidResize : function() {
		sc_super();
		this.setLayerNeedsUpdate();
		this.trace('parent did resize');
	}

});