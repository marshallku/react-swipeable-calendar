import {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type SwiperClass from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { add, eachMonthOfInterval, format, parse, sub } from "date-fns";
import { classNames } from "@utils";
import { Month } from "@components";
import styles from "./index.module.scss";
import { weekDays } from "@constants";

type CalendarMode = "month-full" | "month-medium" | "week";

interface CalendarProps {
    date?: Date;
    onDateClick?(date: Date): void;
    onMonthChange?(date: Date): void;
    content?: ReactNode;
}

const INITIAL_SLIDE = 2;
const MONTH_FORMAT = "yyyy-MM";
const SWIPER_INDEX = [2, 3, 4, 0, 1];

const cx = classNames(styles, "calendar");

function Calendar({
    date = new Date(),
    onDateClick,
    onMonthChange,
    content,
}: CalendarProps) {
    const [mode, setMode] = useState<CalendarMode>("month-full");
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
        <div className={cx("", `--mode-${mode}`)}>
            <div className={cx("__container")}>
                <div className={cx("__week-days")}>
                    {weekDays.map((x) => (
                        <span key={x}>{x}</span>
                    ))}
                </div>
                <Swiper
                    slidesPerView={1}
                    loop
                    centeredSlides
                    initialSlide={INITIAL_SLIDE}
                    onTransitionEnd={handleMonthTransitionChange}
                >
                    {monthSlides.map((month) => (
                        <SwiperSlide
                            key={`${month.getFullYear()}-${month.getMonth()}`}
                        >
                            <Month
                                month={month}
                                setCurrentDate={setCurrentDate}
                                onDateClick={(date) => {
                                    onDateClick?.(date);
                                    setMode((prev) =>
                                        prev === "month-full"
                                            ? "month-medium"
                                            : prev
                                    );
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div
                className={cx("__content")}
                onClick={() => {
                    setMode("week");
                }}
                onDoubleClick={() => {
                    setMode("month-full");
                }}
            >
                {content}
            </div>
        </div>
    );
}

export default Calendar;
