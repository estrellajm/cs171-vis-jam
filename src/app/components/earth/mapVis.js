/* * * * * * * * * * * * * *
 *          MapVis          *
 * * * * * * * * * * * * * */

class MapVis {
	constructor(parentElement, airportData, geoData) {
		this.parentElement = parentElement;
		this.geoData = geoData;
		this.airportData = airportData;

		// define colors
		this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b'];

		this.initVis();
	}

	initVis() {
		let vis = this;

		vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// init drawing area
		vis.svg = d3
			.select('#' + vis.parentElement)
			.append('svg')
			.attr('width', vis.width)
			.attr('height', vis.height)
			.attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

		// add title
		vis.svg
			.append('g')
			.attr('class', 'title')
			.attr('id', 'map-title')
			.append('text')
			.text('Title for Map')
			.attr('transform', `translate(${vis.width / 2}, 20)`)
			.attr('text-anchor', 'middle');

		// TODO
		vis.projection = d3
			.geoOrthographic() // d3.geoStereographic()
			.scale(160)
			.translate([vis.width / 2, vis.height / 2]);
		vis.path = d3.geoPath().projection(vis.projection);
		vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features;

		/** Paint Ocean */
		vis.svg
			.append('path')
			.datum({ type: 'Sphere' })
			.attr('class', 'graticule')
			.attr('fill', '#ADDEFF')
			.attr('stroke', 'rgba(129,129,129,0.35)')
			.attr('d', vis.path);

		let m0, o0;

		vis.svg.call(
			d3
				.drag()
				.on('start', function (event) {
					let lastRotationParams = vis.projection.rotate();
					m0 = [event.x, event.y];
					o0 = [-lastRotationParams[0], -lastRotationParams[1]];
				})
				.on('drag', function (event) {
					if (m0) {
						let m1 = [event.x, event.y],
							o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
						vis.projection.rotate([-o1[0], -o1[1]]);
						vis.updateMap();
					}
				})
		);

		vis.createTooltip();
		vis.wrangleData();
	}

	createTooltip() {
		this.tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
	}

	updateMap() {
		let vis = this;

		vis.path = d3.geoPath().projection(vis.projection);
		vis.svg.selectAll('.country').attr('d', vis.path);
		vis.svg.selectAll('.graticule').attr('d', vis.path);

		vis.svg
			.selectAll('.airport')
			.attr('cx', (d) => vis.projection([d.longitude, d.latitude])[0])
			.attr('cy', (d) => vis.projection([d.longitude, d.latitude])[1]);

		vis.svg
			.selectAll('.connection')
			.attr('x1', (d) => vis.projection([vis.airportData.nodes[d.source].longitude, vis.airportData.nodes[d.source].latitude])[0])
			.attr('y1', (d) => vis.projection([vis.airportData.nodes[d.source].longitude, vis.airportData.nodes[d.source].latitude])[1])
			.attr('x2', (d) => vis.projection([vis.airportData.nodes[d.target].longitude, vis.airportData.nodes[d.target].latitude])[0])
			.attr(
				'y2',
				(d) => vis.projection([vis.airportData.nodes[d.target].longitude, vis.airportData.nodes[d.target].latitude])[1]
			);
	}

	wrangleData() {
		let vis = this;

		// create random data structure with information for each land
		vis.countryInfo = {};
		vis.geoData.objects.countries.geometries.forEach((d) => {
			let randomCountryValue = Math.random() * 4;
			vis.countryInfo[d.properties.name] = {
				name: d.properties.name,
				category: `category_${Math.floor(randomCountryValue)}`,
				color: vis.colors[Math.floor(randomCountryValue)],
				value: (randomCountryValue / 4) * 100
			};
		});

		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		vis.drawGraticules();
		// TODO
		// Ordinal color scale (10 default colors)
		let color = d3.scaleOrdinal(d3.schemeCategory10);

		vis.countries = vis.svg
			.selectAll('.country')
			.data(vis.world)
			.enter()
			.append('path')
			.attr('class', 'country')
			.attr('d', vis.path)
			.style('fill', function (d, index) {
				return vis.countryInfo[d.properties.name].color;
			})
			.on('mouseover', function (event, d) {
				const country = vis.countryInfo[d.properties.name];
				d3.select(this).attr('stroke-width', '2px').attr('stroke', 'black').attr('fill', 'rgba(173,222,255,0.62)');

				vis.tooltip
					.style('opacity', 1)
					.style('left', event.pageX + 20 + 'px')
					.style('top', event.pageY + 'px').html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                            <h3>${country.name}<h3>
							<h4> Name: ${country.name}</h4>
                            <h4> Category: ${country.category}</h4>
							<h4> Color: ${vis.countryInfo[d.properties.name].color}</h4>
                            <h4> Value: ${country.value}</h4>            
                        </div>`);
			})
			.on('mouseout', function (event, d) {
				d3.select(this)
					.attr('stroke-width', '0px')
					.attr('fill', (d) => vis.countryInfo[d.properties.name].color);

				vis.tooltip.style('opacity', 0).style('left', 0).style('top', 0).html(``);
			});

		vis.airports = vis.svg
			.selectAll('.airport')
			.data(vis.airportData.nodes)
			.enter()
			.append('circle')
			.attr('class', 'airport')
			.attr('r', 3)
			.attr('fill', '#777')
			.attr('cx', (d) => vis.projection([d.longitude, d.latitude])[0])
			.attr('cy', (d) => vis.projection([d.longitude, d.latitude])[1]);

		vis.connections = vis.svg
			.selectAll('.connection')
			.data(vis.airportData.links)
			.enter()
			.append('line')
			.attr('class', 'connection')
			.attr('stroke', '#999')
			.attr('x1', (d) => vis.projection([vis.airportData.nodes[d.source].longitude, vis.airportData.nodes[d.source].latitude])[0])
			.attr('y1', (d) => vis.projection([vis.airportData.nodes[d.source].longitude, vis.airportData.nodes[d.source].latitude])[1])
			.attr('x2', (d) => vis.projection([vis.airportData.nodes[d.target].longitude, vis.airportData.nodes[d.target].latitude])[0])
			.attr(
				'y2',
				(d) => vis.projection([vis.airportData.nodes[d.target].longitude, vis.airportData.nodes[d.target].latitude])[1]
			);

		// append tooltip
		vis.tooltip = d3.select('body').append('div').attr('class', 'tooltip').attr('id', 'pieTooltip');

		/** LEGEND */
		// Usage of the drawLegend function in a context where the SVG has already been defined.
		const svg = d3.select('svg'); // Assuming the SVG has been selected or created earlier.
		const svgWidth = +svg.attr('width'); // Extract the width of the SVG for positioning the legend.

		vis.drawLegend();
	}

	drawGraticules() {
		let vis = this;
		// Define the graticule generator
		var graticule = d3.geoGraticule();

		// Create a path generator using the projection
		var path = d3.geoPath().projection(vis.projection);

		// Append the graticule lines to the SVG
		vis.svg
			.append('path')
			.datum(graticule) // Bind the graticule data
			.attr('class', 'graticule') // Apply a class for styling if needed
			.attr('d', path) // Generate the path data
			.attr('fill', 'none')
			.attr('stroke', '#000') // Style the lines with a light grey color
			.attr('stroke-width', 0.2)
			.attr('stroke-opacity', 0.6);

		// Optionally, append the outline of the graticule (the frame)
		vis.svg
			.append('path')
			.datum(graticule.outline)
			.attr('class', 'graticule-outline')
			.attr('d', path)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width', 0.5);
	}

	drawLegend() {
		let vis = this;

		// Define the width and height for each color segment and SVG dimensions
		const segmentWidth = vis.colors.length * 30;
		const height = 20;
		const svgWidth = segmentWidth + 20; // additional space for padding
		const svgHeight = 80;

		const legendXPosition = vis.width - svgWidth;
		const legendYPosition = vis.height - svgHeight + 30;

		// Create SVG element
		const legend = vis.svg.append('g').attr('transform', `translate(${legendXPosition}, ${legendYPosition})`);

		// Draw the color segments
		vis.colors.forEach((color, i) => {
			legend
				.append('rect')
				.attr('x', i * (segmentWidth / vis.colors.length) + 10)
				.attr('y', 10)
				.attr('width', segmentWidth / vis.colors.length)
				.attr('height', height)
				.style('fill', color);
		});

		// Set up the scale for the xAxis
		const xScale = d3
			.scaleLinear()
			.domain([0, 100])
			.range([10, segmentWidth + 10]);

		// Define the xAxis
		const xAxis = d3.axisBottom(xScale).ticks(2);

		// Add the xAxis to the legend
		legend
			.append('g')
			.attr('transform', `translate(0, ${height + 10})`)
			.call(xAxis);
	}
}
