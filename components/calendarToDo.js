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
    ctrl.people;
    ctrl.options = ['Birthday', 'Meeting', 'Trip','Date' ,'Other'];
    ctrl.today;

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
        ctrl.task.begDate = day.date.toDate();
        ctrl.task.endDate = day.date.toDate();
    }

    ctrl.getDay2 = function(day){
        ctrl.dayTask = day;
    }

    ctrl.todayIs = function(day){
        ctrl.today = day;
    }

    ctrl.deleteTask = function(task, day){
        ctrl.dayTask = day;
        console.log(ctrl.dayTask);

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
         //console.log("ctrl.dayTask.tasks: "+ctrl.dayTask.tasks.length);
         //console.log("ctrl.storedTasks: "+ctrl.storedTasks.length);
    };

    ctrl.addTask = function(task){
        ctrl.dayTask.tasks.push({
            id: ctrl.iterator,
            name: task.name,
            people: task.people,
            date: ctrl.dayTask.date,
            begTime: ctrl.dayTask.date.hour(task.begTime.getHours()).minute(task.begTime.getMinutes()),
            endTime: ctrl.dayTask.date.hour(task.endTime.getHours()).minute(task.endTime.getMinutes()),
        });
        ctrl.storedTasks.push({
            id: ctrl.iterator,
            name: task.name,
            people: task.people,
            date: ctrl.dayTask.date,
            begTime: ctrl.dayTask.date.hour(task.begTime.getHours()).minute(task.begTime.getMinutes()),
            endTime: ctrl.dayTask.date.hour(task.endTime.getHours()).minute(task.endTime.getMinutes()),
        });
        ctrl.clearTask();
        ctrl.iterator++;
        // console.log(task.category);
    };


    ctrl.clearTask = function(){
        ctrl.task = {name: "", people: "", begDate: "", begTime: "", endDate: "", endTime: "", category:""};
    }


    ctrl.getTask = function(task){
        ctrl.task = task;
    };

    ctrl.editTask = function(task){
        for(var i = 0; i < ctrl.dayTask.tasks.length; i++) {
            if(ctrl.dayTask.tasks[i].id == task.id) {
                console.log("id "+ctrl.dayTask.tasks[i].id+" id2: "+task.id);
                ctrl.dayTask.tasks[i] = task;
                break;
            }
        }
        for(var i = 0; i < ctrl.storedTasks.length; i++) {
            if(ctrl.storedTasks[i].id == task.id) {
                ctrl.storedTasks[i] = task;
                break;
            }
        }
        ctrl.clearTask();
    };

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
                tasks: [],
                hours: buildDay(date)
            });
            for(var j=0;j<ctrl.storedTasks.length;j++){
                console.log(ctrl.storedTasks[j].date,days[i].date);
                if(ctrl.storedTasks[j].date.format("dddd, MMMM Do YYYY")==days[i].date.format("dddd, MMMM Do YYYY")){
                    days[i].tasks.push(ctrl.storedTasks[j]);
                    //console.log(days[i].date);
                    for(let k = 0;k < 24;k++){
                        if(ctrl.storedTasks[j].begTime==days[i].hours[k].date.format("kk")){
                            days[i].hours[k].tasks.push(ctrl.storedTasks[j]);
                            console.log("Przypisano do godziny.");
                        }
                    }
                    console.log("Przypisano do dnia.");
                }
            }
            date = date.clone();
            date.add(1, "d");
            //console.log(days[i].hours[1].name);
        }
        return days;
    }

    function buildDay(date){
        var hours = [];
        for(let i = 0; i < 24; i++){
            hours.push({
                name: date.format("D M YYYY kk:mm"),
                date: date,
                tasks: []
            });
            date = date.clone();
            date.add(1, "h");
        }
        return hours;
    }
}

app.component("calendarMonthly", {
    templateUrl: 'views/calendarMonthly.html',
    controller: calendarCtrl
});




