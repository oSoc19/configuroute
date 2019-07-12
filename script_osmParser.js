var getJSON = async function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  await xhr.send();
};
document.addEventListener('DOMContentLoaded', async function(){
  var osmOntologyURL = "http://hdelva.be/tiles/ns/ontology.json";
  await getJSON(osmOntologyURL, requestCallback);

  var configOntologyURL = "http://hdelva.be/profile/ns/ontology.json";
  await getJSON(configOntologyURL, requestCallback);
});

async function requestCallback(status, response){
  if(status != null){
    return;
  }

  var result = {};
  const flattened = response;
  //const flattened = await jsonld.expand(response);

  for(var i = 0; i < flattened.length; i++){
    const item = flattened[i];
    if(item["http://www.w3.org/2000/01/rdf-schema#label"] != undefined && item["@type"].includes("http://www.w3.org/2002/07/owl#NamedIndividual")){
      // Item has label
      var list = item["http://www.w3.org/2000/01/rdf-schema#label"];
      for(var j = 0; j < list.length; j++){
        var keyValuePair = list[j]["@value"];
        var keyValueList = keyValuePair.split("=");
        var key = keyValueList[0];
        var value = keyValueList[1];

        if(result[key] == undefined){
          result[key] = [];
        }
        result[key].push(value);
      }
    }
  }
  console.log(result);
}
