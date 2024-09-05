import React from 'react';
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";


const TrackingBar = () => {
  const steps = ['7/15/2024: 13:45', ' en camino', 'cerca', '7/15/2024: 14:40'];
  const currentStep = 3; 

  return (
    <div className="tracking-bar">
      <div className="background-line" />
      <div className="progress-line" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
      <Timeline className="timeline">
        {steps.map((step, index) => (
          <TimelineItem key={index} className="timeline-item">
            <TimelineSeparator className="timeline-separator">
              <TimelineDot className={index <= currentStep ? "timeline-dot completed" : "timeline-dot not-completed"} />
              {index < steps.length - 1 && <TimelineConnector className="timeline-connector" />}
            </TimelineSeparator>
            <TimelineContent className="timeline-content">{step}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default TrackingBar;
