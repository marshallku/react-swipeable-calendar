import { useCallback, useEffect, useMemo, useState } from "react";
import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    isSameMonth,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { classNames } from "@utils";
import styles from "./index.module.scss";

interface CalendarProps {
    date?: Date;
    onDateClick?(date: Date): void;
}

const cx = classNames(styles, "calendar");

function Calendar({ date = new Date(), onDateClick }: CalendarProps) {
    const days = useMemo(
        () =>
            eachDayOfInterval({
                start: startOfWeek(startOfMonth(date)),
                end: endOfWeek(endOfMonth(date)),
            }),
        [date]
    );
    const [currentDate, setCurrentDate] = useState(date);

    const handleClick = useCallback(
        (day: Date) => {
            onDateClick?.(day);
            setCurrentDate(day);
        },
        [onDateClick]
    );

    useEffect(() => {
        setCurrentDate(date);
    }, [date]);

    return (
        <div className={cx()}>
            <div className={cx("__container")}>
                {days.map((day) => (
                    <div
                        role="button"
                        tabIndex={-1}
                        key={day.toString()}
                        className={cx(
                            "__day",
                            !isSameMonth(day, currentDate) &&
                                "__day--different-month"
                        )}
                        onClick={() => {
                            handleClick(day);
                        }}
                    >
                        {day.getDate()}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
