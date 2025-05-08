import { DayPicker } from "react-day-picker";

interface CalendarProps {
  selectedDate?: Date;
  onDateChange: (date?: Date) => void;
  disabledDays?: { before?: Date; after?: Date };
}

export function MyCalendar({ selectedDate, onDateChange, disabledDays }: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onDateChange}
      // disabled={disabledDays || { after: new Date() }}
      footer={selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : "Pick a day."}
      className="border rounded-md"
      styles={{
        root: { margin: '0' },
        caption: { color: '#3b82f6' },
        day: { margin: '2px' }
      }}
    />
  );
}