import { Dispatch, useCallback, useMemo, useRef } from "react";
import {
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    endOfMonth,
    isSameMonth,
    isSameDay,
} from "date-fns";
import { classNames } from "@utils";
import { Mode } from "@types";
import styles from "./index.module.scss";

interface MonthProps {
    onDateClick?(date: Date): void;
    month: Date;
    currentDate: Date;
    setCurrentDate: Dispatch<React.SetStateAction<Date>>;
    mode: Mode;
    transitionedMode: Mode;
}

const cx = classNames(styles, "month");

function Month({
    month,
    currentDate,
    setCurrentDate,
    onDateClick,
    mode,
    transitionedMode,
}: MonthProps) {
    const weekRef = useRef(1);
    const days = useMemo(
        () =>
            eachDayOfInterval({
                start: startOfWeek(month),
                end:
                    transitionedMode === "WEEK"
                        ? endOfWeek(month)
                        : endOfWeek(endOfMonth(month)),
            }),
        [month, transitionedMode]
    );

    const handleClick = useCallback(
        (day: Date) => {
            onDateClick?.(day);
            setCurrentDate(day);
        },
        [onDateClick, setCurrentDate]
    );

    return (
        <div
            className={cx("", `--${mode}`)}
            style={{
                transform:
                    mode === "WEEK" && transitionedMode !== "WEEK"
                        ? `translateY(${(weekRef.current - 1) * -20}vw)`
                        : "",
            }}
        >
            <div className={cx("__container")}>
                {days.map((day, i) => {
                    const currentWeek = Math.floor(i / 7) + 1;
                    const isCurrentDate = isSameDay(day, currentDate);

                    if (isCurrentDate) {
                        weekRef.current = currentWeek;
                    }

                    return (
                        <div
                            role="button"
                            tabIndex={-1}
                            key={day.toString()}
                            className={cx(
                                "__day",
                                isCurrentDate && "__day--current",
                                !isSameMonth(day, month) &&
                                    "__day--different-month",
                                `__day--column-${(i % 7) + 1}`,
                                `__day--row-${currentWeek}`
                            )}
                            onClick={() => {
                                handleClick(day);
                                weekRef.current = currentWeek;
                            }}
                        >
                            {day.getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Month;
