function timeSeriesChart() {

    var width = 330,
        height = 150,
        margin = { top: 17, right: 40, bottom :30, left: 7, axes: 0 },
        legend = { caption: "Time series", series1: "series1", series2: "series2", width: 110 },
        svg = undefined,
        initialized = false,

        line = undefined,
        path1 = undefined,
        path2 = undefined,
        path3 = undefined,

        circlesContainer = undefined,

        time_scale = undefined,
        time_scale_axis = undefined,
        value_scale = undefined,

        xAxis = undefined,
        yAxis = undefined;

    function chart() {};

    function init(data1, data2, data3) {

        if (!svg || svg.length == 0) throw "svg element must be set";

        var clip_id = svg.attr("clip_id");
        if (!clip_id || clip_id.length == 0) {
            throw "svg element must have 'clip_id' attribute";
        }

        time_scale = d3.time.scale()
            .range([0 + margin.left, width - margin.right]);

        time_scale_axis = d3.time.scale()
            .range([0 + margin.left, width - margin.right]);

        value_scale = d3.scale.linear()
            .range([height - margin.bottom, 0 + margin.top]);

        xAxis = d3.svg.axis().scale(time_scale_axis).orient("bottom").ticks(4).tickSize(6,3,0).tickSubdivide(true);
        yAxis = d3.svg.axis().scale(value_scale).orient("right").ticks(4);

        line = d3.svg.line()
//        .interpolate("monotone")
            .x(function(d){return time_scale( new Date(d.timestamp));})
            .y(function(d){return value_scale(d.value);});

        // chart box
        svg.append("rect")
            .attr("width", width)
            .attr("height",height)
            .attr("class","chart_box");

        // plot box
        svg.append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height",height - margin.top - margin.bottom)
            .attr("class","plot_box");

        svg.append("defs").append("clipPath")
            .attr("id", clip_id)
            .append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height",height - margin.top - margin.bottom);

        // paths
        path1 = svg.append("g")
            .attr("clip-path", "url(#"+clip_id+")")
            .append("path");

        path2 = svg.append("g")
            .attr("clip-path", "url(#"+clip_id+")")
            .append("path");

        if (data3) {
            path3 = svg.append("g")
                .attr("clip-path", "url(#"+clip_id+")")
                .append("path");
        }

        circlesContainer = svg.append("g")
            .attr("clip-path", "url(#"+clip_id+")")
            .attr("id","circlesContainer");

        // axes
        svg.append("svg:g")
            .attr("class", "axis x")
            .attr("transform","translate(0,"+ (height - margin.bottom + margin.axes) +")")
            .call(xAxis);

        svg.append("svg:g")
            .attr("class", "axis y")
            .attr("transform","translate("+ (width - margin.right + margin.axes) +",0)")
            .call(yAxis);

        // legend
        var legendSize = { width: legend.width, height: (data3 ? 47 : 31)};

        var legendSvg = svg.append("svg:g");

        legendSvg.append("rect")
            .attr("width", legendSize.width)
            .attr("height", legendSize.height)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("class","legend_background");

        legendSvg.attr("transform","translate("+(margin.left + legend.margin_left)+","+(height -margin.bottom - legendSize.height - legend.margin_bottom)+")");

        var legend1 = legendSvg.append("text").text(legend.series1).attr("class","legend_text");
        var legend2 = legendSvg.append("text").text(legend.series2).attr("class","legend_text");
        var legend3 = legendSvg.append("text").text(legend.series3).attr("class","legend_text");

        legend1.attr("font-size", 10)
            .attr("font-family", "Verdana")
            .attr("transform","translate("+20+","+(legendSize.height - 5)+")");

        legend2.attr("font-size", 10)
            .attr("font-family", "Verdana")
            .attr("transform","translate("+20+","+(legendSize.height - 5 - 14)+")");

        legendSvg.append("circle")
            .attr("r", 3)
            .attr("class", "legend_circle_line1")
            .attr("transform","translate("+10+","+(legendSize.height - 8)+")");

        legendSvg.append("circle")
            .attr("r", 3)
            .attr("class", "legend_circle_line2")
            .attr("transform","translate("+10+","+(legendSize.height - 8 - 14)+")");

        if (data3) {

            legend3.attr("font-size", 10)
                .attr("font-family", "Verdana")
                .attr("transform","translate("+20+","+(legendSize.height - 5 - 14 - 14)+")");

            legendSvg.append("circle")
                .attr("r", 3)
                .attr("class", "legend_circle_line3")
                .attr("transform","translate("+10+","+(legendSize.height - 8 - 14 - 14)+")");

        }

        // caption
        if (legend.caption && legend.caption.length > 0) {

            var captionSvg = svg.append("g");
            captionSvg.append("text").text(legend.caption).attr("class","legend_caption");
            captionSvg.attr("transform", "translate("+margin.left+",11)");

        }

        initialized = true;

    };

    // data1 and data2 are mandatory
    // data3 is optional
    chart.update = function(data1, data2, data3) {

        if (!initialized) init(data1, data2, data3);

        var circles1 = circlesContainer.selectAll("circle.circle_line1")
            .data(data1, function(d){return d.timestamp});

        var circles2 = circlesContainer.selectAll("circle.circle_line2")
            .data(data2, function(d){return d.timestamp});

        circles1.enter()
            .append("circle")
            .attr("class","circle_line1")
            .attr("r", 1.5);

        circles2.enter()
            .append("circle")
            .attr("class","circle_line2")
            .attr("r", 1.5);

        var circles3 = undefined;

        if (data3) {

            circles3 = circlesContainer.selectAll("circle.circle_line3")
                .data(data3, function(d){return d.timestamp});

            circles3.enter()
                .append("circle")
                .attr("class","circle_line3")
                .attr("r", 1.5);

        }

        value_scale.domain([0,
            d3.max([
                d3.max(data1, function(d){return d.value}),
                d3.max(data2, function(d){return d.value}),
                d3.max(data3 ? data3 : [], function(d){return d.value})
            ])
        ]).nice();

        if (data1.length > 2)
            time_scale_axis.domain([
                data1[1].timestamp,
                data1[data1.length-1].timestamp
//            new Date(d3.min(data1, function(d){return d.timestamp})),
//            new Date(d3.max(data1, function(d){return d.timestamp}))
            ]);

        circles1.attr("cx", function(d){return time_scale(new Date(d.timestamp))})
            .attr("cy", function(d){return value_scale(d.value)});

        circles2.attr("cx", function(d){return time_scale(new Date(d.timestamp))})
            .attr("cy", function(d){return value_scale(d.value)});

        circles1.transition().duration(250).ease("linear")
            .attr("cx", function(d){return time_scale(new Date(d.timestamp))})
            .attr("cy", function(d){return value_scale(d.value)});

        circles2.transition().duration(250).ease("linear")
            .attr("cx", function(d){return time_scale(new Date(d.timestamp))})
            .attr("cy", function(d){return value_scale(d.value)});

        path1.data(data1)
            .attr("class", "line1")
            .attr("d", line(data1));

        path2.data(data2)
            .attr("class", "line2")
            .attr("d", line(data2));

        if (data3) {

            circles3.attr("cx", function(d){return time_scale(new Date(d.timestamp))})
                .attr("cy", function(d){return value_scale(d.value)});

            circles3.transition().duration(250).ease("linear")
                .attr("cx", function(d){return time_scale(new Date(d.timestamp))})
                .attr("cy", function(d){return value_scale(d.value)});

            path3.data(data3)
                .attr("class", "line3")
                .attr("d", line(data3));

        }

        if (data1.length > 2)
            time_scale.domain([
                data1[1].timestamp,
                data1[data1.length-1].timestamp
//            new Date(d3.min(data1, function(d){return d.timestamp})),
//            new Date(d3.max(data1, function(d){return d.timestamp}))
            ]);

        var t = svg.transition().duration(250).ease("linear");

        t.select(".x.axis").call(xAxis);
        t.select(".y.axis").call(yAxis);
        path1.transition().duration(250).ease("linear").attr("d", line(data1));
        path2.transition().duration(250).ease("linear").attr("d", line(data2));

        circles1.exit().remove();
        circles2.exit().remove();

        if (data3) {
            path3.transition().duration(250).ease("linear").attr("d", line(data3));
            circles3.exit().remove();
        }

    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.svg = function(_) {
        if (!arguments.length) return svg;
        svg = _;
        return chart;
    };

    chart.legend = function(_) {
        if (!arguments.length) return legend;
        legend = _;
        return chart;
    };

    return chart;
}

