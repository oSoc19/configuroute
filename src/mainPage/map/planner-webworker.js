function doQuerry(map) {
    if(map.state.from_marker.placed && this.state.to_marker.placed){
        map.setState({calculating: true});
      let query = {
        roadNetworkOnly: true,  // don't mix with publicTranspotOnly, for obvious reasons
        from: { latitude: map.state.from_marker.lngLat.lat, longitude: this.state.from_marker.lngLat.lng},
        to: { latitude: map.state.to_marker.lngLat.lat, longitude: this.state.to_marker.lngLat.lng}
      };
      console.log(query);
      console.log("waiting...");
        console.log("querying planner.js...");
        map.planner.query(query)
        .take(1)
        .on("error", (error) => {
          console.log(error);
        })
        .on("data", (path) => {
          //console.log("got result:");
            //console.log(JSON.stringify(path, null, " "));
            let route_coordinates = [];
            path.steps.forEach((step) => {
              route_coordinates.push([step.startLocation.longitude, step.startLocation.latitude]);
              route_coordinates.push([step.stopLocation.longitude, step.stopLocation.latitude]);
            });
            //console.log(coordinates);
            let date = new Date();
            map.setState(prevState => ({
              active_route: {
                key: prevState.saved_routes.length,
                text: date.toISOString(),
                coordinates: route_coordinates
              }
            }));
        })
        .on("end", () => {
          console.log("end\n");
          map.setState({calculating: false});
        });
      }
}