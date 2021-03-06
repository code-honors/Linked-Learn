'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    //   initialView: 'timeGridThreeDay',
    //   initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridThreeDay,timeGridDay,listWeek',
    },
    views: {
      timeGridThreeDay: {
        type: 'timeGrid',
        duration: { days: 3 },
        buttonText: '3 days',
      },
      timeGrid: {
        dayMaxEvents: 3,
      },
    },
    //   allDaySlot: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    expandRows: true,
    selectable: true,
    selectMirror: true,
    moreLinkClick: 'day',
    editable: true,
    dayMaxEvents: true,
    nowIndicator: true,
    events: [
      {
        title: 'All Day Event',
        start: '2021-04-24',
      },
      {
        title: 'Long Event',
        start: '2021-04-25',
        end: '2021-04-27',
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2021-04-01T16:00:00',
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2021-04-08T16:00:00',
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2021-04-15T16:00:00',
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2021-04-22T16:00:00',
      },
      {
        groupId: '999',
        title: 'Repeating Event',
        start: '2021-04-29T16:00:00',
      },
      {
        title: 'Meeting with Ruba',
        start: '2021-04-27T10:30:00',
        end: '2021-04-27T11:00:00',
      },
      {
        title: 'Meeting with Zaid',
        start: '2021-04-27T11:00:00',
        end: '2021-04-27T11:30:00',
      },
      {
        title: 'Meeting with Bashar',
        start: '2021-04-27T11:30:00',
        end: '2021-04-27T12:00:00',
      },
      {
        title: 'Meeting with Ahmad',
        start: '2021-04-27T13:00:00',
        end: '2021-04-27T13:30:00',
      },
      {
        title: 'Meeting with Afnan',
        start: '2021-04-27T13:30:00',
        end: '2021-04-27T14:00:00',
      },
    ],
    dateClick: function (arg) {
      console.log(arg.date.toString());
      console.log(arg);
      console.log(arg.dateStr);
    },
    eventClick: function (info) {
      info.el.style.backgroundColor = 'red';
      info.el.style.lineHeight = 1.5;
      info.el.style.fontSize = '1rem';
      console.log(info.event);
    },
  });
  calendar.render();
});
