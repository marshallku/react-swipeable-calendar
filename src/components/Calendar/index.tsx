import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type SwiperClass from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { add, eachMonthOfInterval, format, parse, sub } from "date-fns";
import { classNames } from "@utils";
import { Month } from "@components";
import styles from "./index.module.scss";

interface CalendarProps {
    date?: Date;
    onDateClick?(date: Date): void;
    onMonthChange?(date: Date): void;
}

const INITIAL_SLIDE = 2;
const MONTH_FORMAT = "yyyy-MM";

const cx = classNames(styles, "calendar");

function Calendar({
    date = new Date(),
    onDateClick,
    onMonthChange,
}: CalendarProps) {
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
    const indexCache = useRef(INITIAL_SLIDE);

    const handleMonthTransitionChange = useCallback(
        (swiper: SwiperClass, date?: Date) => {
            if (!swiper) {
                MediaElementAudioSourceNode;
            }

            if (indexCache.current === swiper.realIndex && !date) {
                return;
            }

            indexCache.current = swiper.realIndex;
            setMonthSlides((prev) => {
                const { realIndex: startIndex } = swiper;
                const currentDate = date || prev[startIndex];
                const newInterval = eachMonthOfInterval({
                    start: sub(currentDate, { months: 2 }),
                    end: add(currentDate, { months: 2 }),
                });
                const nextState: typeof prev = [];

                for (let i = 0, max = prev.length; i < max; ++i) {
                    const currentIndex = (startIndex + i) % max;
                    const SWIPER_INDEX = [2, 3, 4, 0, 1];
                    nextState[currentIndex] = newInterval[SWIPER_INDEX[i]];
                }

                console.log(nextState.map((x) => x.getMonth() + 1));

                onMonthChange?.(nextState[startIndex]);

                return nextState;
            });
        },
        [onMonthChange]
    );

    useEffect(() => {
        setCurrentDate(date);
    }, [date]);

    return (
        <div className={cx()}>
            <div className={cx("__container")}>
                <Swiper
                    slidesPerView={1}
                    loop
                    centeredSlides
                    initialSlide={INITIAL_SLIDE}
                    onTransitionEnd={handleMonthTransitionChange}
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
