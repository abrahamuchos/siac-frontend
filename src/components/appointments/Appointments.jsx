/**
 * Object to response data to appointment
 * @typedef {Object} Appointments
 * @property {number} id
 * @property {number} idPatient - Patient id
 * @property {string} title - Patient name (sometimes add doctor name)
 * @property {string} start - Start date/time
 * @property {string} end - Start date/time
 * @property {boolean} firstConsultation
 * @property {string} color - Hex color bg
 */
/**
 * @typedef {Object} ResponseData
 * @property {Array.<Appointments>} appointments - Appointments lists
 */
/**
 * @typedef {Object} ConsultationHours
 * @property {Array.<ConsultationHours>} consultationHours - Consultation Hours lists
 */
/**
 * @typedef {Object} ConsultationHour
 * @property {number} id
 * @property {number} doctorId
 * @property {string|number} dayOfWeek
 * @property {string} startTime - time to start
 * @property {string} endTime - time to end
 */
import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'
import allLocales from '@fullcalendar/core/locales-all';
import { Card } from "react-bootstrap";
import { Tooltip } from "bootstrap";
import { useLocation, useNavigate } from "react-router-dom";


import { useUserContext } from "../../contexts/UserProvider.jsx";
import axiosClient from "../../axios-client.js";
import ErrorAlert from "../alerts/ErrorAlert.jsx";

export default function Appointments() {
  let tooltipInstance = null;
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useUserContext();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const [consultationHours, setConsultationHours] = useState([]);
  /**
   *
   * @type {React.MutableRefObject<FullCalendar>}
   */
  const calendarRef = useRef(null);


  useEffect(() => {
    //Get consultations hours only to MD role
    if(user.role.id === 3){
      getConsultationHours();
    }
  }, []);

  const getConsultationHours = () => {
    axiosClient.get('/appointments/consultation-hours')
      .then(({data})=>{
        let consultation = [];
        data.map(function(item){
          consultation.push({
            daysOfWeek: [item.daysOfWeek],
            startTime: item.startTime,
            endTime: item.endTime
          })
        })
        setConsultationHours(consultation)

      })
      .catch((err) =>{
        setError(err)
      });
  }

  /**
   *
   * @param {string} start
   * @param {string} end
   */
  const getAppointments = (start, end) => {
    axiosClient.get('appointments', {
      params: {
        start: start,
        end: end,
      }
    })
      .then(({data}) => {
        setEvents(data.appointments)
      })
      .catch((err) => {
        setError(err);
      })
  }

  const handleDateSet = (arg) => {
    getAppointments(arg.startStr, arg.endStr);
  }

  const handleDateClick = (info) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridDay', info.dateStr);
  }

  const handleEventClick = (info) => {
    handleMouseLeave();
    const pathname = location.pathname.split('/')
    if(typeof pathname[1] != 'undefined'){
      navigate('/'+pathname[1]+'/appointment/' + info.event.id)
    }else {
      navigate('/404')
    }
  }

  /**
   *
   * @param {EventHoveringArg} info
   */
  const handleMouseEnter = (info) => {
    if (info.event.extendedProps.reason) {
      tooltipInstance = new Tooltip(info.el, {
        title: info.event.extendedProps.reason,
        html: true,
        placement: "top",
        trigger: "hover",
        container: "body"
      });
      tooltipInstance.show();
    } else if (info.event.extendedProps.moreInfo) {
      tooltipInstance = new Tooltip(info.el, {
        title: info.event.extendedProps.moreInfo,
        html: true,
        placement: "top",
        trigger: "hover",
        container: "body"
      });
      tooltipInstance.show();
    }
  }

  const handleMouseLeave = () => {
    if (tooltipInstance) {
      tooltipInstance.dispose();
      tooltipInstance = null;
    }
  };


  return (
    <>
      <Card>
        <Card.Body>
          {user.role.id === 2 ?
            // FullCalendar to UM
            <FullCalendar
              ref={calendarRef}
              locales={allLocales}
              locale={'es'}
              height={"85vh"}
              plugins={[dayGridPlugin, listPlugin, interactionPlugin, timeGridPlugin]}
              selectable={true}
              initialView="listWeek"
              headerToolbar={{
                left: 'listWeek,customBtn',
                center: 'title',
              }}
              customButtons={{
                customBtn: {
                  text: 'Añadir cita',
                  click: function () {
                    return navigate('appointment');
                  }
                }
              }}
              buttonText={{
                today: 'Hoy',
                day: 'Día',
                list: 'Lista'
              }}
              events={events}
              eventClick={handleEventClick}
              datesSet={handleDateSet}
              nowIndicator={true}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }}
            />
            : // FullCalendar to MD, AS and others
            <FullCalendar
              ref={calendarRef}
              locales={allLocales}
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
                    return navigate('appointment');
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
              eventClick={handleEventClick}
              eventMouseEnter={handleMouseEnter}
              eventMouseLeave={handleMouseLeave}
              datesSet={handleDateSet}
              nowIndicator={true}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }}
              dateClick={handleDateClick}
              businessHours={consultationHours}
            />
          }


        </Card.Body>
      </Card>

      {error ?
        <ErrorAlert err={error.response}/> : ''
      }

    </>
  );
}

