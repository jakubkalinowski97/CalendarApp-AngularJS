var app = angular.module("CalendarToDo", ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/logo', {
            templateUrl: 'views/logo.html',
        }).
        when('/help', {
            templateUrl: 'views/help.html',
        }).
        when('/authors', {
            templateUrl: 'views/authors.html',
        }).
        otherwise({
            templateUrl: 'views/logo.html',
        })
    }]);

app.factory('myService' ,function () {

        var iterator = 0;
        var storedTasks = [];
        var options = [
        {name: 'Birthday', icon: "fa fa-birthday-cake"},
        {name: 'Meeting', icon: "fa fa-users"},
        {name: 'Trip', icon: "fa fa-plane"},
        {name: 'Other', icon: "fa fa-calendar-alt"}];
        return{
            getIterator: function(){
                return iterator;
            },
            getOptions: function() {
                return options
            },
            increaseIterator: function(){
                iterator++;
            },
            resetTime: function (date) {
                return date.day(0).hour(0).minute(0).second(0).millisecond(0);
            },
            buildDay: function (date) {
                var hours = [];
                for(let i = 0; i < 24; i++){
                    hours.push({
                        name: date.format("kk:mm"),
                        date: date,
                    });
                    date = date.clone();
                    date.add(1, "h");
                }
                return hours;
            },
            getStoredTasks: function () {
                return storedTasks;
            },
            setStoredTasks: function (task,dayTask) {
              storedTasks.push({
                  id: iterator,
                  name: task.name,
                  people: task.people,
                  date: dayTask.date,
                  category: task.category,
                  begTime: dayTask.date.clone().hour(task.begTime.getHours()-1).minute(task.begTime.getMinutes()),
                  endTime: dayTask.date.clone().hour(task.endTime.getHours()-1).minute(task.endTime.getMinutes()),
              })
            },
        }
})


app.component("calendarMonthly",{
    templateUrl: 'views/calendarMonthly.html',
    controller: 'monthlyCtrl',
    bindings: {
        "today" : '=',
        "search" : '='
    }
});

app.component("calendar", {
    templateUrl: 'views/calendar.html',
    controller: 'calendarCtrl'
});

app.component("calendarDaily",{
    templateUrl: 'views/calendarDaily.html',
    controller: 'dailyCtrl',
    bindings:{
        "today": '='
    }
});


app.controller("monthlyCtrl",['$scope', 'myService', function ($scope, myService) {

    var ctrl = this;
    ctrl.day = moment();
    ctrl.selected = myService.resetTime(moment());
    ctrl.month = ctrl.selected.clone();
    ctrl.task = {name: "", people: "", begTime: "", endTime: ""};
    ctrl.options = myService.getOptions();
    ctrl.storedTasks=myService.getStoredTasks();


    var start = ctrl.selected.clone();
    start.date(1);
    myService.resetTime(start.date(1));
    buildMonth(start, ctrl.month);


    ctrl.next = function () {
        var next = ctrl.month.clone();
        myService.resetTime(next.month(next.month() + 1).date(1));
        ctrl.month.month(ctrl.month.month() + 1);
        buildMonth(next, ctrl.month);
    };

    ctrl.previous = function () {
        var previous = ctrl.month.clone();
        myService.resetTime(previous.month(previous.month() - 1).date(1));
        ctrl.month.month(ctrl.month.month() - 1);
        buildMonth(previous, ctrl.month);
    };

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
                hours: myService.buildDay(date)
            });
            for(var j=0;j<myService.getStoredTasks().length;j++){
                //console.log(ctrl.storedTasks[j].date,days[i].date);
                if(myService.getStoredTasks()[j].date.format("dddd, MMMM Do YYYY")==days[i].date.format("dddd, MMMM Do YYYY")){
                    days[i].tasks.push(myService.getStoredTasks()[j]);
                }
            }
            date = date.clone();
            date.add(1, "d");
            //console.log(days[i].hours[1].name);
        }
        return days;
    }

    ctrl.getDay = function(day){
        ctrl.dayTask = day;
        ctrl.task.begDate = day.date.toDate();
        ctrl.task.endDate = day.date.toDate();
    }

    ctrl.getDay2 = function(day){
        ctrl.dayTask = day;
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
        for(var i = 0; i < myService.getStoredTasks().length; i++) {
            if(myService.getStoredTasks()[i].id == task.id) {
                myService.getStoredTasks().splice(i, 1);
                break;
            }
        }
        //console.log("ctrl.dayTask.tasks: "+ctrl.dayTask.tasks.length);
        //console.log("ctrl.storedTasks: "+ctrl.storedTasks.length);
    };

    ctrl.addTask = function(task){
        ctrl.dayTask.tasks.push({
            id: myService.getIterator(),
            name: task.name,
            people: task.people,
            date: ctrl.dayTask.date,
            category: task.category,
            begTime: ctrl.dayTask.date.clone().hour(task.begTime.getHours()-1).minute(task.begTime.getMinutes()),
            endTime: ctrl.dayTask.date.clone().hour(task.endTime.getHours()-1).minute(task.endTime.getMinutes()),
        });
        //console.log(ctrl.dayTask.date);
        myService.setStoredTasks(task,ctrl.dayTask);
        console.log(task);
        ctrl.clearTask();
        myService.increaseIterator();
    };

    ctrl.clearTask = function(){
        ctrl.task = {name: "", people: "", date: "", begTime: "", endTime: "", category:""};
    }

    ctrl.getTask = function(task){
        ctrl.task = task;
    };

    ctrl.editTask = function(task){
        for(var i = 0; i < ctrl.dayTask.tasks.length; i++) {
            if(ctrl.dayTask.tasks[i].id == task.id) {
                //console.log("id "+ctrl.dayTask.tasks[i].id+" id2: "+task.id);
                ctrl.dayTask.tasks[i] = task;
                break;
            }
        }
        for(var i = 0; i < ctrl.storedTasks.length; i++) {
            if(myService.getStoredTasks().id == task.id) {
                myService.setStoredTasks(task);
                break;
            }
        }
        ctrl.clearTask();
    };


}]);

app.controller("calendarCtrl", function($scope, myService) {
    var ctrl = this;
    ctrl.options = myService.getOptions();
    ctrl.dayTask;
    ctrl.storedTasks=myService.getStoredTasks();
    ctrl.people;
    ctrl.search = {};
    ctrl.today = {
        name: moment().format("dd"),
        number: moment().date(),
        date: moment(),
        tasks: [],
        hours: myService.buildDay(myService.resetTime(moment()))
    };
});

app.controller("dailyCtrl",['$scope', 'myService', function ($scope, myService) {
    var ctrl = this;
}]);

app.directive('myAuthors', function() {
  return {
    template: '<h2>Jakub Kalinowaski<br>Mateusz Bednarski</h2>'
  };
});



