var app = angular.module("CalendarToDo", []);

function calendarCtrl($scope, $element, $attrs) {
    var ctrl = this;
    ctrl.day = moment();
    ctrl.selected = resetTime(moment());
    ctrl.weeks = [];
    ctrl.month = ctrl.selected.clone();
    var start = ctrl.selected.clone();

    start.date(1);
    resetTime(start.date(1));

    buildMonth(ctrl.weeks,start, ctrl.month);

    function resetTime(date) {
        return date.hour(0).minute(0).second(0).millisecond(0);
    }

    function buildMonth(weeks,start, month) {
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            weeks.push({ days: buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 3 && monthIndex !== date.month();
            monthIndex = date.month();
        }
        return weeks;
    }

    function buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd"),
                number: date.date(),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
}

app.component("calendarMonthly", {
    templateUrl: 'views/calendarMonthly.html',
    controller: calendarCtrl
})