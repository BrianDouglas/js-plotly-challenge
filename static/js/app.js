var myData = {};

d3.json("https://briandouglas.github.io/js-plotly-challenge/samples.json").then(jsonData => {
    var dropdownMenu = d3.select("#selDataset");
    var options = dropdownMenu.selectAll("option")
        .data(jsonData.names)
        .enter()
        .append("option");
    options.text(d => d)
        .attr("value", d => d);
    
    var initialName = d3.select("#selDataset").property("value");
    var filterData = jsonData.samples.filter(d => d.id === initialName)[0];
    //get top 10
    var topSamples = filterData.sample_values.slice(0,9);
    var topIds = filterData.otu_ids.slice(0,9);
    var topLabels = filterData.otu_labels.slice(0,9);
    //data for bar chart
    var barData = [{
        x: topSamples,
        y: topIds.map(d => `OTU ${d}`),
        text: topLabels,
        type: 'bar',
        orientation: 'h'
    }];
    //data for bubble chart
    var bubbleData = [{
        x: filterData.otu_ids,
        y: filterData.sample_values,
        mode: 'markers',
        marker: {
            size: filterData.sample_values,
            sizemode: 'area',
            sizeref: 0.05,
            color: filterData.otu_ids,
            colorscale: "Portland"
        },
        text: filterData.otu_labels 
    }];
    //bar chart layout
    var barLayout = {
        title: "Top Samples",
        yaxis: {
            autorange: "reversed"
        }
    };
    //bubble chart layout
    var bubbleLayout = {
        title: "All Samples",
        showlegend: false
    };
    //draw charts
    Plotly.newPlot("bar", barData, barLayout);
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    //make data accessible to other functions
    myData = jsonData;
    //populate metadata
    updateMetaData(initialName);
});

function optionChanged(){
    currentName = d3.select("#selDataset").property("value");
    updateCharts(currentName);
    updateMetaData(currentName);
};

function updateMetaData(name){
    var filterData = myData.metadata.filter(d => d.id === +name)[0];
    var dataDiv = d3.select("#sample-metadata");
    console.log(filterData);
    dataDiv.html("");
    dataDiv.append('p')
      .text(`id: ${filterData.id}`);
    dataDiv.append('p')
      .text(`ethnicity: ${filterData.ethnicity}`);
    dataDiv.append('p')
      .text(`gender: ${filterData.gender}`);
    dataDiv.append('p')
      .text(`age: ${filterData.age}`);
    dataDiv.append('p')
      .text(`location: ${filterData.location}`);
    dataDiv.append('p')
      .text(`bbtype: ${filterData.bbtype}`);
    dataDiv.append('p')
      .text(`wfreq: ${filterData.wfreq}`);
};

function updateCharts(name){
    var filterData = myData.samples.filter(d => d.id === name)[0];

    var barx = filterData.sample_values.slice(0,9);
    var bary = filterData.otu_ids.slice(0,9).map(d => `OTU ${d}`);
    var bartext = filterData.otu_labels.slice(0,9);

    var bubblex = filterData.otu_ids;
    var bubbley = filterData.sample_values;
    var bubbletext = filterData.otu_labels

    Plotly.restyle("bar", "x", [barx]);
    Plotly.restyle("bar", "y", [bary]);
    Plotly.restyle("bar", "text", [bartext])

    Plotly.restyle("bubble", "x", [bubblex]);
    Plotly.restyle("bubble", "y", [bubbley]);
    Plotly.restyle("bubble", "text", [bubbletext])
    Plotly.restyle("bubble", "marker.color", [bubblex]);
    Plotly.restyle("bubble", "marker.size", [bubbley]);
};
