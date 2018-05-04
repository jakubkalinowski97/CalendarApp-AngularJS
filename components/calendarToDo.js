var app = angular.module("CalendarToDo", []);

function calendarCtrl($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.day = moment();
    ctrl.selected = resetTime(moment());
    ctrl.month = ctrl.selected.clone();
    ctrl.dayTask;
    ctrl.storedTasks=[];
    ctrl.task = {name: "", people: "", begTime: "", endTime: ""};
    ctrl.iterator = 0;
    // ctrl.task = {name: "", people: "", begDate: "", begTime: "", endDate: "", endTime: ""};
    ctrl.people;
    $scope.options = ['Birthday', 'Meeting', 'Trip','Date' ,'Other'];

    var start = ctrl.selected.clone();
    start.date(1);
    resetTime(start.date(1));
    buildMonth(start, ctrl.month);

    ctrl.next = function () {
        var next = ctrl.month.clone();
        resetTime(next.month(next.month() + 1).date(1));
        ctrl.month.month(ctrl.month.month() + 1);
        buildMonth(next, ctrl.month);
    };

    ctrl.previous = function () {
        var previous = ctrl.month.clone();
        resetTime(previous.month(previous.month() - 1).date(1));
        ctrl.month.month(ctrl.month.month() - 1);
        buildMonth(previous, ctrl.month);
    };

    ctrl.getDay = function(day){
        ctrl.dayTask = day;
        // ctrl.task.begDate = day.clone;
        ctrl.task.begDate = day.date.toDate();
        ctrl.task.endDate = day.date.toDate();
        // ctrl.task.begTime = moment().toDate();
        console.log(ctrl.dayTask.date);
        console.log(day);
    }

    ctrl.getDay2 = function(day){
        ctrl.dayTask = day;
    }

    ctrl.deleteTask = function(task, day){
        // console.log(task.id);
        // ctrl.getDay2(task.date);
        // ctrl.dayTask = day;
        for(var i = 0; i < ctrl.dayTask.tasks.length; i++) {
            if(ctrl.dayTask.tasks[i].id == task.id) {
                ctrl.dayTask.tasks.splice(i, 1);
                break;
            }
        }
        for(var i = 0; i < ctrl.storedTasks.length; i++) {
            if(ctrl.storedTasks[i].id == task.id) {
                ctrl.storedTasks.splice(i, 1);
                break;
            }
        }
         console.log("ctrl.dayTask.tasks: "+ctrl.dayTask.tasks.length);
         console.log("ctrl.storedTasks: "+ctrl.storedTasks.length);
    };

    ctrl.addTask = function(task){
        ctrl.dayTask.tasks.push({
            id: ctrl.iterator,
            name: task.name,
            people: task.people,
            date: ctrl.dayTask.date
        });
        ctrl.dayTask.date
        ctrl.storedTasks.push({
            id: ctrl.iterator,
            name: task.name,
            people: task.people,
            date: ctrl.dayTask.date
        });
        ctrl.task = {name: "", people: "", begDate: "", begTime: "", endDate: "", endTime: ""};
        ctrl.people = "";
        ctrl.iterator++;
        console.log(ctrl.storedTasks);
    };

    ctrl.roll = "noRollUp";
    ctrl.rollUpTasks = function(){
        if(ctrl.roll === "noRollUp")
            ctrl.roll = "rollUp";
        else
            ctrl.roll = "noRollUp";
    }

    function resetTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function buildMonth(start, month) {
        ctrl.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            ctrl.weeks.push({ days: buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 3 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd"),
                number: date.date(),
                date: date,
                tasks: []
            });
            for(var j=0;j<ctrl.storedTasks.length;j++){
                console.log(ctrl.storedTasks[j].date,days[i].date);
                if(ctrl.storedTasks[j].date.format("dddd, MMMM Do YYYY, h:mm:ss a")==days[i].date.format("dddd, MMMM Do YYYY, h:mm:ss a")){
                    days[i].tasks.push(ctrl.storedTasks[j]);
                }
            }
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
}

app.component("calendarMonthly", {
    templateUrl: 'views/calendarMonthly.html',
    controller: calendarCtrl
});




