'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
}

export function Calendar({ selected, onSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, idx) => idx);

  const isSelectedDate = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={previousMonth} aria-label="이전 달">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-bold text-primary">
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="다음 달">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, idx) => {
          const colorClass = idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-muted-foreground';
          return (
            <div key={day} className={`text-center text-xs font-medium ${colorClass}`}>
              {day}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}
        {days.map((day) => {
          const selected = isSelectedDate(day);
          const btnClass = `aspect-square flex items-center justify-center rounded-md text-sm hover:bg-muted transition-colors ${selected ? 'bg-primary text-white hover:bg-primary/90' : ''}`;
          return (
            <button
              key={day}
              onClick={() => {
                const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                onSelect(newDate);
              }}
              className={btnClass}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
