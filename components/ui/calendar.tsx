import { useState } from "react";
import { DateRange, DayPicker, SelectSingleEventHandler, SelectRangeEventHandler } from "react-day-picker";
import "react-day-picker/style.css";
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils";

type CalendarProps = {
  mode?: "range" | "single";
  selected?: Date | DateRange | undefined;
  onSelect?: ((date: Date | undefined) => void) | ((range: DateRange | undefined) => void);
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
};

export function MyDatePicker({
  className,
  classNames: customClassNames,
  mode = "range",
  showOutsideDays = true,
  onSelect,
  selected,
  ...props
}: CalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>(
    mode === "range" && selected ? selected as DateRange : undefined
  );

  const [singleDate, setSingleDate] = useState<Date | undefined>(
    mode === "single" && selected ? selected as Date : undefined
  );

  const sharedClassNames = {
    months: "flex flex-col space-y-4",
    month: "space-y-4",
    nav: "space-x-1 flex items-center",
    nav_button: "text-gray-500 hover:text-gray-400 transition-colors",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse space-y-1",
    head_row: "flex justify-between",
    head_cell: "text-muted-foreground w-9 font-normal text-[0.8rem] text-center",
    row: "flex w-full mt-2 justify-between",
    cell: cn(
      "h-9 w-9 text-center text-sm p-0 relative",
      "focus-within:relative focus-within:z-20",
      "[&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800/30",
      "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
    ),
    day_selected: cn(
      "bg-gray-600 text-white",
      "hover:bg-gray-700 hover:text-white",
      "focus:bg-gray-600 focus:text-white",
      "dark:bg-gray-600 dark:text-slate-50"
    ),
    day_today: "bg-accent text-accent-foreground",
    day_outside: "text-muted-foreground opacity-50",
    day_disabled: "text-muted-foreground opacity-50",
    day_range_middle: cn(
      "aria-selected:bg-gray-100 aria-selected:text-gray-900",
      "dark:aria-selected:bg-gray-700/30 dark:aria-selected:text-gray-50"
    ),
    day_hidden: "invisible",
    ...customClassNames,
  };

  return (
    <div className="p-4 rounded-2xl w-fit">
      {mode === "range" && (
        <>
          <DayPicker
            mode="range"
            showOutsideDays={showOutsideDays}
            selected={range}
            onSelect={(value) => {
              if (onSelect) (onSelect as (range: DateRange | undefined) => void)(value);
              else setRange(value);
            }}
            numberOfMonths={1}
            pagedNavigation
            locale={ptBR}
            classNames={sharedClassNames}
            weekStartsOn={0}
          />
          <div className="text-sm text-zinc-400 mt-2">
            {range?.from && range?.to
              ? `Selecionado: ${range.from.toLocaleDateString("pt-BR")} - ${range.to.toLocaleDateString("pt-BR")}`
              : "Selecione um período"}
          </div>
        </>
      )}

      {mode === "single" && (
        <>
          <DayPicker
            mode="single"
            showOutsideDays={showOutsideDays}
            selected={singleDate}
            onSelect={(value) => {
              if (onSelect) (onSelect as (date: Date | undefined) => void)(value);
              else setSingleDate(value);
            }}
            numberOfMonths={1}
            pagedNavigation
            locale={ptBR}
            classNames={sharedClassNames}
            weekStartsOn={0}
          />
          <div className="text-sm text-zinc-400 mt-2">
            {singleDate
              ? `Data selecionada: ${singleDate.toLocaleDateString("pt-BR")}`
              : "Selecione uma data"}
          </div>
        </>
      )}
    </div>
  );
}