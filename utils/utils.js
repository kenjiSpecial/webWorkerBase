module.exports = {
    mix : function(curValue, targetValue, rate){
        return curValue * (1-rate) + targetValue * rate;
    }
};