function countState() {
    for(var index in data) {
        // console.log(data[index]);
        var list = data[index].list;
        var countWaiting = 0;
        var countWorking = 0;
        var countComplete = 0;
        for(var key in list) {
            // console.log(list[key])
            if (list[key].stateClass == "waiting") {
                countWaiting++;
            }
            if (list[key].stateClass == "working") {
                countWorking++;
            }
            if (list[key].stateClass == "complete") {
                countComplete++;
            }
        }
        data[index].countWaiting = countWaiting;
        data[index].countWorking = countWorking;
        data[index].countComplete = countComplete;

        data[index].countCompletePercent =  Math.floor (countComplete/ (countWaiting+countWorking+countComplete) *100)

    }
}

$(() => {
	$(".state").on("click", function(e){
		e.stopPropagation();
		var value = $(this).siblings(".tooltip").text();
		navigator.clipboard.writeText(value);
	});
});