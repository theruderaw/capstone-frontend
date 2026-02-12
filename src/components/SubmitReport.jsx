import React, { useEffect, useState } from 'react'
import Textbox from './Textbox.jsx'
import Button from './Button.jsx'

function SubmitReport() {
  const [reason,setReason] = useState("")
  const [reportContent,setReportContent] = useState("")
  const [reportDate,setReportDate] = useState(Date.now().toString().slice(0,10))
  const [supervisorName,setSupervisorName] = useState('')
  const [supervisorId,setSupervisorId] = useState(0)

  useEffect(() => {
    const userId = localStorage.user_id; // or get from localStorage

    fetch(`http://localhost:8000/info/supervisor?user_id=${userId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setSupervisorName(data.data.supervisor_name);
        setSupervisorId(data.data.supervisor_id)
      })
      .catch((err) => {
        console.error("Error fetching supervisor:", err);
      });
  }, []);
  return (
    <div>
      <Textbox className='reason' text={reason} setText={setReason} placeholder='Enter reason of report' />
      <Textbox className='reportContent' text = {reportContent} setText={setReportContent} placeholder='Details'/>
      <Textbox className='reportDate' text = {reportDate} setText={setReportDate} type='date'/>
      <Textbox className='supervisorName' text = {supervisorName} setText={setSupervisorName} placeholder='Supervisor Name' disabled={true}/>
      <Button 
        onClick = {async () => {
          try {
            const res = await fetch("http://localhost:8000/report/submit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify({
                user_id: localStorage.user_id,
                reason: reason,
                description: reportContent,
                submission_date: reportDate
              }),
            });

            const data = await res.json();
            console.log("Response:", data);
          } catch (error) {
            console.error("Error submitting report:", error);
          }
        }} 
        children={"Submit Report"} 
        className = 'submitbutton'
      />
    </div>
  )
}

export default SubmitReport
