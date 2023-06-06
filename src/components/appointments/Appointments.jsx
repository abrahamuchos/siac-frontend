import React, { useEffect, useRef, useState } from 'react';
import axiosClient from "../../axios-client.js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Appointments() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  /**
   *
   * @type {React.MutableRefObject<FullCalendar>}
   */
  const calendarRef = useRef(null);

  const getAppointments = (start, end) => {
    axiosClient.get('appointment', {
      params: {
        start: start,
        end: end,
      }
    })
      .then(({data}) => {
        // console.log(data)
        setEvents(data.appointments)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleDateSet = (arg) => {
    getAppointments(arg.startStr, arg.endStr);
  }

  const handleDateClick = (info) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridDay', info.dateStr);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <FullCalendar
            ref={calendarRef}
            locale={'es'}
            height={"85vh"}
            plugins={[dayGridPlugin, listPlugin, interactionPlugin, timeGridPlugin]}
            selectable={true}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next,listWeek,customBtn',
              center: 'title',
              right: 'today,dayGridMonth,timeGridWeek,timeGridDay'
            }}
            customButtons={{
              customBtn: {
                text: 'Añadir cita',
                click: function () {
                  return navigate('create');
                }
              }
            }}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              list: 'Lista'
            }}
            events={events}
            datesSet={handleDateSet}
            nowIndicator={true}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }}
           dateClick={handleDateClick}
          />

        </Card.Body>
      </Card>


    </>
  );
}