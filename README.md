A visualization demonstration based on [dc.js](https://dc-js.github.io/dc.js/) and [d3.js](http://d3js.org/) to investigate polio AFP cases in Pakistan and Afghanistan and their dynamics in time, location, genetic cluster, etc.

![screenshot](/docs/polio-dashboard-screenshot.png?raw=true "AFP dashboard")

Data derived from [excellent animation](http://afpakpolio.droppages.com/) of cases and genetic links based on Arie Voorman's [epiviz package](https://github.com/avoorman/epiviz).

###Getting Started

To view this dashboard in a local browser, one need to have the [Flask python package](http://flask.pocoo.org/) installed, either directly on your machine or in a [virtual environment](http://flask.pocoo.org/docs/0.10/installation/).  Parsing the csv file is handled by the `pandas` python package, which can either be built from source or downloaded as a [pre-built binary](http://www.lfd.uci.edu/~gohlke/pythonlibs/#pandas) along with its dependencies.

Then one simply need to run `python app.py` and point a browser to `http://localhost:5000`.
