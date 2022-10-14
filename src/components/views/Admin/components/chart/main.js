// Hint: This is a good place to declare your global variables
var female_data;
var male_data;

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
    var width = 1000,
        height = 600;
    var parseYear = d3.timeParse('%Y');



    var svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "my_svg");
    
   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv'), d3.csv('data/males_data.csv')])
        .then(function (values) {
            console.log('loaded females_data.csv and males_data.csv');
            female_data = values[0];
            male_data = values[1];
            console.log(male_data[0]["Uganda"]);

            var subgroups = male_data.columns.slice(1)
            console.log(subgroups);
            // Hint: This is a good spot for doing data wrangling
            male_data.map(function (col){
                console.log(col['Uganda'].length);
                col.Uganda = +col.Uganda
                col.Ukraine = +col['Ukraine']
                col['United Arab Emirates'] = +col['United Arab Emirates']
                col['United Kingdom'] = +col['United Kingdom']
                col['United States'] = +col['United States']   
                col.Year = +parseYear(col["Year"])
            
            });
            

            female_data.map(function (col){
                col.Uganda = +col['Uganda']
                col.Ukraine = +col['Ukraine']
                col['United Arab Emirates'] = +col['United Arab Emirates']
                col['United Kingdom'] = +col['United Kingdom']
                col['United States'] = +col['United States']   
                col.Year = +parseYear(col["Year"])
            });
            
            drawLolliPopChart();
        });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {

    const selectedCountry =  document.getElementById('sel_country').value;


    const svg = d3.select('#my_svg');

    var width = 1000,
    height = 600;

    const margin = {top:80, bottom:50, left:120, right:50}
    const actualWidth = width - margin.left - margin.right;
    const actualHeight = height - margin.top - margin.bottom;
    
    const xRange = d3.scaleTime().domain([new Date('1990'), new Date('2023')]) .range([0, actualWidth]); 


    y1=d3.max(male_data.map(d => d[selectedCountry]))
    y2=d3.max(female_data.map(d => d[selectedCountry]))

    y3=d3.min(male_data.map(d => d[selectedCountry]))
    y4=d3.min(female_data.map(d => d[selectedCountry]))

    yMax = Math.max(y1,y2)
    ymin = Math.min(y3,y4)
    console.log(ymin +" ymin")

    const yRange = d3.scaleLinear().domain([0, yMax]).range([actualHeight, 0 ]); 

    svg.select('g').remove();

    const g = svg.append('g')
                .attr('transform', 'translate('+margin.left+', '+margin.top+')');;
    const yAxis = d3.axisLeft(yRange);
    g.append('g').call(yAxis);
    const xAxis = d3.axisBottom(xRange);
    g.append('g').call(xAxis)
                    .attr('transform',`translate(0,${actualHeight})`)
    g.append('text').attr('x',actualWidth/2).attr('y',actualHeight+40).text('Year');
        
    g.append('text').attr('transform','rotate(-90)').attr('y','-40px').attr('x',-actualHeight/2).attr('text-anchor','middle').text('Employment Rate')

    g.append("rect").attr("x",650).attr("y",-10).attr('width', 12).attr('height', 12).style("fill", '#122740').attr("stroke", '#122740')
        
    g.append("text").attr("x", 680).attr("y", -3).text("Male Employment Rate").style("font-size", "15px").attr("alignment-baseline","middle")

    g.append("rect")
        .attr("x",650)
        .attr("y",-38)
        .attr('width', 12)
        .attr('height', 12)
        .style("fill", '#84b29e')
        .attr("stroke", '#84b29e')

    g.append("text")
        .attr("x", 680)
        .attr("y", -30)
        .text("Female Employment Rate")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle")

    g.selectAll('mCircle')
        .data(male_data)
        .enter()
        .append('circle')
        .transition()
        .duration(1000)
        .attr('cx', function(d){ return xRange(d.Year) -4;})
        .attr('cy', function(d) { return yRange(d[selectedCountry]);})
        .attr('r',4)
        .style('fill', '#122740')
        // .style('stroke','red');

    g.selectAll('mLine')
        .data(male_data)
        .enter()
        .append('line')
        .transition()
        .duration(1000)
        .attr('x1', function(d){ return xRange(d.Year) -4;})
        .attr('x2', function(d){ return xRange(d.Year) -4;})
        .attr('y1', function(d) { return yRange(d[selectedCountry]) +4;})
        .attr('y2', yRange(0))
        // .style('fill', '#122740')
        .style('stroke','#122740');
    
    
    g.selectAll('fCircle')
        .data(female_data)
        .enter()
        .append('circle')
        .transition()
        .duration(1000)
        .attr('cx', function(d){ return xRange(d.Year) +4;})
        .attr('cy', function(d) { return yRange(d[selectedCountry]);})
        .attr('r',4)
        .style('fill', '#84b29e')
        // .style('stroke','yellow');

    g.selectAll('fLine')
        .data(female_data)
        .enter()
        .append('line')
        .transition()
        .duration(1000)
        .attr('x1', function(d){ return xRange(d.Year) +4;})
        .attr('x2', function(d){ return xRange(d.Year) +4;})
        .attr('y1', function(d) { return yRange(d[selectedCountry]) +4;})
        .attr('y2', yRange(0))

        // .style('fill', '#84b29e')
        .style('stroke','#84b29e');
    

    
}

