queue()
    .defer(d3.json, "/polio_records")
    .defer(d3.json, "static/geojson/afpak.geojson")
    .await(makeGraphs);

function makeGraphs(error, polioRecordsJson, districtsJson) {

    //Clean polio records data
	var polioRecords = polioRecordsJson;
    var dateFormat = d3.time.format("%Y-%m-%d");
	polioRecords.forEach(function(d) {
        d.onset = dateFormat.parse(d.onset);
        d.onset.setDate(1); // group on month
        d.age = Math.floor(d.age / 12) // months --> years
	});

    //Create a Crossfilter instance
    var ndx = crossfilter(polioRecords);

    //Define Dimensions
    var ageDim = ndx.dimension(function(d) { return d.age; });
    var dateDim = ndx.dimension(function(d) { return d.onset; });
    var countryDim = ndx.dimension(function(d) { return d.country; });
    var districtDim = ndx.dimension(function(d) { return d.district; });
    var sexDim = ndx.dimension(function(d) {return d.sex; });
    var clusterDim = ndx.dimension(function(d) {return d.cluster; });
    var dosesDim = ndx.dimension(function(d) {return d["doses.total"]; });

    //Calculate metrics
    var all = ndx.groupAll();
    var numRecordsByAge = ageDim.group();
    var numRecordsByDate = dateDim.group();
    var numRecordsByCountry = countryDim.group();
    var numRecordsByDistrict = districtDim.group();
    var numRecordsBySex = sexDim.group();
    var numRecordsByCluster = clusterDim.group();
    var numRecordsByDoses = dosesDim.group();

    //Define values (to be used in charts)
    var max_state = numRecordsByDistrict.top(1)[0].value;
	var minDate = new Date(2010, 0, 0);
    var maxDate = new Date();

    //Charts
    var ageChart = dc.barChart("#age-chart");
    var dosesChart = dc.barChart("#doses-chart");
    var clusterChart = dc.pieChart("#cluster-chart")
    var timeChart = dc.lineChart("#time-chart")
    var mapChart = dc.geoChoroplethChart("#map-chart");
    var countryChart = dc.rowChart("#country-chart")

    ageChart
      .x(d3.scale.linear().domain([0, 8]))
      .width(250)
      .height(150)
      .margins({top: 10, right: 10, bottom: 35, left: 30})
      .elasticY(true)
      .dimension(ageDim)
      .xAxisLabel('Age (years)')
      .group(numRecordsByAge);
      ageChart.yAxis().ticks(4);
      ageChart.xAxis().ticks(4);


    dosesChart
      .x(d3.scale.linear().domain([0, 12]))
      .width(250)
      .height(150)
      .margins({top: 10, right: 10, bottom: 35, left: 30})
      .elasticY(true)
      .dimension(dosesDim)
      .xAxisLabel('Doses (routine + campaign)')
      .group(numRecordsByDoses)
      .yAxis().ticks(4);
    dosesChart.xAxis().ticks(6);


    clusterChart
      .width(250)
      .height(250)
      .radius(90)
      .innerRadius(30)
      .dimension(clusterDim)
      .group(numRecordsByCluster);


    countryChart
      .width(250)
      .height(200)
      .margins({top: 60, right: 10, bottom: 25, left: 30})
      .elasticX(true)
      .dimension(countryDim)
      .group(numRecordsByCountry)
      .xAxis().ticks(5);


    timeChart
      .x(d3.time.scale().domain([minDate, maxDate]))
      .width(550)
      .height(150)
      .margins({top: 10, right: 10, bottom: 30, left: 30})
      .elasticY(true)
      .clipPadding(10)
      .renderArea(true)
      .dimension(dateDim)
      .group(numRecordsByDate)
      .yAxis().ticks(5);


    mapChart
      .width(500)
      .height(580)
      .dimension(districtDim)
      .group(numRecordsByDistrict)
      //.colors(colorbrewer.Blues[9])
      .colors(d3.scale.linear().range(["#d9d9d9", "#d9d9d9", "#f7fbff", "#08306b"]))
      .overlayGeoJson(districtsJson.features, "district", function (d) {
        return d.properties.name;
      })
      .projection(d3.geo.conicEqualArea()
                    .scale(1800)
                    .translate([50, 650])
                    .rotate([0, 25, 0])
                    .center([68.6, 31.6])
                  )
      .title(function (p) {
        return "District: " + p["key"] + "\n"
                            + "Cases: " + Math.round(p["value"]);
      })

      mapChart.on("preRender", function(chart) {
          chart.colorDomain([0, 0.99, 1, d3.extent(chart.data(), chart.valueAccessor())[1]]);
      });
      mapChart.on("preRedraw", function(chart) {
          chart.colorDomain([0, 0.99, 1, d3.extent(chart.data(), chart.valueAccessor())[1]]);
      });


    dc.renderAll();
}
