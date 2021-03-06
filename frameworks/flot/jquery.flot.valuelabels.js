/**
 * Value Labels Plugin for flot.
 * http://leonardoeloy.github.com/flot-valuelabels
 * http://wiki.github.com/leonardoeloy/flot-valuelabels/
 *
 * Using canvas.fillText instead of divs, which is better for printing - by Leonardo Eloy, March 2010.
 * Tested with Flot 0.6 and JQuery 1.3.2.
 *
 * Original homepage: http://sites.google.com/site/petrsstuff/projects/flotvallab
 * Released under the MIT license by Petr Blahos, December 2009.
 */
(function ($) {
  var options = {
      series: {
          valueLabels: {
              show:            false,
              showAsHtml:      false, // Set to true if you wanna switch back to DIV usage (you need plot.css for this)
              showLastValue:   false, // Use this to show the label only for the last value in the series
              labelFormatter:  function(v) { return v; }, // Format the label value to what you want
              align:           'start', // can also be 'center', 'left' or 'right'
              plotAxis:        'y', // Set to the axis values you wish to plot
              hideZero:        false,
			  verticalAlign:   'bottom', // bottom, top, center
			  showTotalValues: true
          }
      }
  };

	function init(plot) {
		plot.hooks.draw.push( function (plot, ctx) {

		var allSeries = plot.getData();
		
		$.each(allSeries, function(ii, series) {
	        if (!series.valueLabels.show) return;

	        var showLastValue  = series.valueLabels.showLastValue;
	        var showAsHtml     = series.valueLabels.showAsHtml;
	        var plotAxis       = series.valueLabels.plotAxis;
	        var labelFormatter = series.valueLabels.labelFormatter;
	        var fontcolor      = series.valueLabels.fontcolor;
	        var xoffset        = series.valueLabels.xoffset;
	        var yoffset        = series.valueLabels.yoffset;
	        var align          = series.valueLabels.align;
	        var font           = series.valueLabels.font;
	        var hideZero       = series.valueLabels.hideZero;
			var verticalAlign  = series.valueLabels.verticalAlign;
			var showTotalValues = series.valueLabels.showTotalValues;
        
			// Workaround, since Flot doesn't set this value anymore
	        series.seriesIndex = ii;

	        if (showAsHtml) {
	          plot.getPlaceholder().find("#valueLabels"+ii).remove();
	        }

	        var html       = '<div id="valueLabels' + series.seriesIndex + '" class="valueLabels">';
	        var last_val   = null;
	        var last_x     = -1000;
	        var last_y     = -1000;
	        var categories = series.xaxis.options.mode == 'categories';
			var x_pos;
			var y_pos;
		
			for (var i = 0; i < series.data.length; ++i) {

				if (series.data[i] === null || (showLastValue && i != series.data.length-1))  continue;
			
				var x = series.data[i][0];
				var y = series.data[i][1];
				var yPos = y;
				var yHeight = 0;
				var yOffset = 0;
		  
				if (series.stack){
					switch (verticalAlign){
						case  'bottom':
							yPos = series.datapoints.points[i*3 + 2];
							yOffset = -12;
						break;
						case 'top':
							yPos = series.datapoints.points[i*3 + 1];
							yOffset = 8;
						break;
						//case 'center':
						default:
							yPos = (series.datapoints.points[i*3 + 1] + series.datapoints.points[i*3 + 2])/2;
							yOffset = 0;
						break;
					}
			  
					yHeight = series.datapoints.points[i*3 + 1] - series.datapoints.points[i*3 + 2];
				}

				if (categories) {
					x = series.xaxis.categories[x];
				}

				// console.log(y);
				if (x < series.xaxis.min || x > series.xaxis.max || y < series.yaxis.min || y > series.yaxis.max)  continue;

				var val = ( plotAxis === 'x' ) ? x : y;
	  
				if(val === null){val='';}
  
				if ( val === 0 && hideZero ) continue;

				if (series.valueLabels.valueLabelFunc) {
					val = series.valueLabels.valueLabelFunc({ series: series, seriesIndex: ii, index: i });
				}
	  
				val = "" + val;
				val = labelFormatter(val);
	  
	  
				//console.log('series has length: '+ series.data.length + ' and i: '+ i);
				if (val != last_val || i == series.data.length - 1) {
					// console.log('firs condition' + (series.yaxis.p2c(yHeight)-series.yaxis.p2c(0)) + ' -<--' + yHeight);
					var xx = series.xaxis.p2c(x) + plot.getPlotOffset().left;
					var yy = series.yaxis.p2c(yPos) + (series.stack ? yOffset : -12) + plot.getPlotOffset().top;
		
		
					if (series.stack && (series.yaxis.p2c(0) - series.yaxis.p2c(yHeight)) < 15){
						//console.log('to narrow to draw');
					} else 
					if ( Math.abs(yy - last_y) > 20 || last_x < xx ) {
						//console.log("drawing: "+val+ " at posy: "+y );
						if (!series.stack) last_val = val;
						last_x = xx + val.length * 8;
						last_y = yy;
						if (!showAsHtml) {
							// Little 5 px padding here helps the number to get
							// closer to points
							x_pos = xx;
							y_pos = yy + 6;

							// If the value is on the top of the canvas, we need
							// to push it down a little
							if (yy <= 0) y_pos = 18;

							// The same happens with the x axis
							if (xx >= plot.width()) {
								x_pos = plot.width();
							}

							if (font) {
								ctx.font = font;
							}
							if(typeof(fontcolor) != 'undefined'){
								ctx.fillStyle     = fontcolor;
							}
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 1.5;
							if(typeof(fontcolor) != 'undefined'){
								ctx.shadowColor = fontcolor;
							}
							ctx.textAlign = align;

							ctx.fillText(val, x_pos, y_pos);
						
						} else {
						
							var head = '<div style="left:' + xx + 'px;top:' + yy + 'px;" class="valueLabel';
							var tail = '">' + val + '</div>';
							html += head + "Light" + tail + head + tail;
						
						}
					}
				}
			}
		
	        if (showAsHtml) {
	          html += "</div>";
	          plot.getPlaceholder().append(html);
	        }
		});

		var n = allSeries.length-1;
		if (n >= 0 && allSeries[n].valueLabels.showTotalValues){
			//console.log("need to draw total values....");
			// grab the last series, and draw totalValues:
			var series = allSeries[n];
			
			// skip ik valuaLabels are not required
			if (!series.valueLabels.show) return;
			
			var i = 0;
			var x;
			var y;
			var yPos;
			var x_pos;
			var y_pos;
			var val;
			var yHeight = 0;
			var yOffset = 0;
			var plotAxis       = series.valueLabels.plotAxis;
	        var fontcolor      = series.valueLabels.fontcolor;
	        var xoffset        = series.valueLabels.xoffset;
	        var yoffset        = series.valueLabels.yoffset;
	        var align          = series.valueLabels.align;
	        var font           = series.valueLabels.font;
			var labelFormatter = series.valueLabels.labelFormatter;
	        
			for (i=0; i < series.data.length; i++){
				x = series.data[i][0];
				y = series.datapoints.points[i*3 + 1];
				//console.log(y);
				yPos = y;
				yOffset = -12;
			
				var xx = series.xaxis.p2c(x) + plot.getPlotOffset().left;
				var yy = series.yaxis.p2c(yPos) + (series.stack ? yOffset : -12) + plot.getPlotOffset().top;
			
				val = ( plotAxis === 'x' ) ? x : y;
	  
				if(val === null){val='';}
				
				if (series.valueLabels.valueLabelFunc) {
					val = series.valueLabels.valueLabelFunc({ series: series, seriesIndex: n, index: i });
				}
  
				val = "" + val;
				val = labelFormatter(val);
			
				if (!series.valueLabels.showAsHtml) {
					// Little 5 px padding here helps the number to get
					// closer to points
					x_pos = xx;
					y_pos = yy + 6;

					// If the value is on the top of the canvas, we need
					// to push it down a little
					if (yy <= 0) y_pos = 18;

					// The same happens with the x axis
					if (xx >= plot.width()) {
						x_pos = plot.width();
					}

					if (font) {
						ctx.font = font;
					}
					if(typeof(fontcolor) != 'undefined'){
						ctx.fillStyle     = fontcolor;
					}
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 0;
					ctx.shadowBlur = 1.5;
					if(typeof(fontcolor) != 'undefined'){
						ctx.shadowColor = fontcolor;
					}
					ctx.textAlign = align;

					ctx.fillText(val, x_pos, y_pos);
			
				} else {
			
					var head = '<div style="left:' + xx + 'px;top:' + yy + 'px;" class="valueLabel';
					var tail = '">' + val + '</div>';
					//html += head + "Light" + tail + head + tail;
			
				}
			}
		}
    });
  }

  $.plot.plugins.push({
    init: init,
    options: options,
    name: 'valueLabels',
    version: '1.2'
  });
})(jQuery);
