import { useEffect, useMemo, useState } from "react";
import { add, eachMonthOfInterval, format, parse, sub } from "date-fns";
import { classNames } from "@utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Month } from "@components";
import styles from "./index.module.scss";

interface CalendarProps {
    date?: Date;
    onDateClick?(date: Date): void;
}

const INITIAL_SLIDE = 2;
const MONTH_FORMAT = "yyyy-MM";

const cx = classNames(styles, "calendar");

function Calendar({ date = new Date(), onDateClick }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(date);
    const currentMonth = useMemo(
        () => format(currentDate, MONTH_FORMAT),
        [currentDate]
    );
    const firstDayOfCurrentMonth = useMemo(
        () => parse(currentMonth, MONTH_FORMAT, new Date()),
        [currentMonth]
    );
    const [monthSlides, setMonthSlides] = useState<Date[]>(
        eachMonthOfInterval({
            start: sub(firstDayOfCurrentMonth, { months: 2 }),
            end: add(firstDayOfCurrentMonth, { months: 2 }),
        })
    );

    useEffect(() => {
        setCurrentDate(date);
    }, [date]);

    return (
        <div className={cx()}>
            <div className={cx("__container")}>
                <Swiper
                    slidesPerView={1}
                    centeredSlides
                    initialSlide={INITIAL_SLIDE}
                >
                    {0 < monthSlides.length &&
                        monthSlides.map((month) => (
                            <SwiperSlide
                                key={`${month.getFullYear()}-${month.getMonth()}`}
                            >
                                <Month
                                    month={month}
                                    setCurrentDate={setCurrentDate}
                                    onDateClick={onDateClick}
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Calendar;
