module.exports = {
  getTotalVotes : function(election, candidates){
    var results = [];
    for(var i = 0; i<candidates.length; i++ ){

      //Get array of every ballot fovouring the candidate = count
      var count = election.filter(e=>{
        return e.candidate === candidates[i];
      });
      var countMale = count.filter(c=>{
        return c.gender === 'male'
      });
       var cand ={
        candidate: candidates[i],
        count: count.length,
        countMale: countMale.length,
      }
      results.push(cand);
    }
    var fresults = {
      electionId : election[1].election,
      results: results
    }
    return fresults;
  }
};
