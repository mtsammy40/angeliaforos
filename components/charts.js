module.exports ={
    Male : function(election){
          var ids=[], data=[], backgroundColors=[];
          for(var i = 0; i<election.results.length; i++){
            ids.push(election.results[i].candidate);
            data.push(election.results[i].countMale);
            var dynamicColors = "rgb(" +Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255)+ "," + Math.floor(Math.random() * 255) + ")";
            backgroundColors.push(dynamicColors);
          }
          var Cdata ={
            "labels": ids,
            "datasets": [{
                "label": "Male Voters",
                "data" : data,
                "backgroundColor": backgroundColors
            }]                
          };
          return Cdata;
    },
    Female : function(election){
        var ids=[], data=[], backgroundColors=[];
        for(var q = 0; q<election.results.length; q++){
          ids.push(election.results[q].candidate);
          data.push(election.results[q].count-election.results[q].countMale);
          var dynamicColors = "rgb(" +Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255)+ "," + Math.floor(Math.random() * 255) + ")";
          backgroundColors.push(dynamicColors);
        }
        var Cdata ={
          "labels": ids,
          "datasets": [{
              "label": "Female Voters",
              "data" : data,
              "backgroundColor": backgroundColors
          }]                
        };
        return Cdata;
  },
}