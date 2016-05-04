// Custom Helpers

Template.registerHelper('compare', function(v1, v2) {
  if (typeof v1 === 'object' && typeof v2 === 'object') {
    return _.isEqual(v1, v2); // do a object comparison
  } else {
    return v1 === v2;
  }
});


Template.registerHelper('arrayDifference', function(array1, array2){
  var array1Names = [];
  var array2Names = [];

  if(array1 != undefined && array1 != null && array1.length > 0){
    for (i in array1){
      array1Names.push(array1[i].name);
    }
  }

  if(array2 != undefined && array2 != null && array2.length > 0){
    for (j in array2){
      array2Names.push(array2[j].name);
    }   
  }

  var arrayNamesDiff = $(array1Names).not(array2Names).get();
  var arrayDiff = [];

  for (objectIndex in array1){
    var name = array1[objectIndex].name;

    for (arrayNameIndex in arrayNamesDiff){

      if ( name == arrayNamesDiff[arrayNameIndex]){
        arrayDiff.push(array1[objectIndex]);
      }

    } 
  }
  return arrayDiff;
});


// Some utility functions...

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}