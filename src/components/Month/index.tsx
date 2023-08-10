import { Dispatch, useCallback, useMemo } from "react";
import {
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    endOfMonth,
    isSameMonth,
} from "date-fns";
import { classNames } from "@utils";
import styles from "./index.module.scss";

interface MonthProps {
    onDateClick?(date: Date): void;
    month: Date;
    setCurrentDate: Dispatch<React.SetStateAction<Date>>;
}

const cx = classNames(styles, "month");

function Month({ month, setCurrentDate, onDateClick }: MonthProps) {
    const days = useMemo(
        () =>
            eachDayOfInterval({
                start: startOfWeek(month),
                end: endOfWeek(endOfMonth(month)),
            }),
        [month]
    );

    const handleClick = useCallback(
        (day: Date) => {
            onDateClick?.(day);
            setCurrentDate(day);
        },
        [onDateClick, setCurrentDate]
    );

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
                            !isSameMonth(day, month) && "__day--different-month"
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

export default Month;
