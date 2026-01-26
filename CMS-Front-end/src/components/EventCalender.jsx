import { useState } from "react";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export function EventCalender() {
    const [value, onChange] = useState(new Date());
    return (
        <div className="bg-white rounded-xl h-full p-4">            
            <Calendar onChange={onChange} value={value} />
        </div>
    );
}