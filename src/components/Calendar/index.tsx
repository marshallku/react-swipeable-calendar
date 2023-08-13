import {
    MouseEvent,
    ReactNode,
    TouchEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type SwiperClass from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    add,
    eachMonthOfInterval,
    eachWeekOfInterval,
    format,
    parse,
    sub,
} from "date-fns";
import { classNames, fit } from "@utils";
import { weekDays } from "@constants";
import { Month } from "..";
import "swiper/css";
import styles from "./index.module.scss";
import { Mode, Nullable } from "@types";

export interface CalendarProps {
    date?: Date;
    onDateClick?(date: Date): void;
    onMonthChange?(date: Date): void;
    content?: ReactNode;
}

const INITIAL_SLIDE = 2;
const MONTH_FORMAT = "yyyy-MM";
/**
 * 해당 index에서 제일 빠른 날짜가 위치하는 index
 */
const SWIPER_INDEX = [2, 1, 0, 4, 3];
const DEFAULT_MODE = "FULL";
const MINIMUM_SWIPE_DISTANCE = 100;

const cx = classNames(styles, "calendar");

function Calendar({
    date = new Date(),
    onDateClick,
    onMonthChange,
    content,
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

    const [mode, setMode] = useState<Mode>(DEFAULT_MODE);
    const [transitionedMode, setTransitionedMode] =
        useState<Mode>(DEFAULT_MODE);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartCoordinate = useRef<Nullable<number>>(null);
    const touchEndCoordinate = useRef<Nullable<number>>(null);

    const indexCache = useRef(INITIAL_SLIDE);

    const updateSlide = useCallback(
        (index = indexCache.current, date?: Date, mode?: Mode) => {
            setMonthSlides((prev) => {
                const currentDate = date || prev[index];
                const newInterval =
                    mode === "WEEK"
                        ? eachWeekOfInterval({
                              start: sub(currentDate, { weeks: 2 }),
                              end: add(currentDate, { weeks: 2 }),
                          })
                        : eachMonthOfInterval({
                              start: sub(currentDate, { months: 2 }),
                              end: add(currentDate, { months: 2 }),
                          });
                const nextState: typeof prev = [];

                for (let i = 0, max = prev.length; i < max; ++i) {
                    const currentIndex = (SWIPER_INDEX[index] + i) % max;
                    nextState[i] = newInterval[currentIndex];
                }

                onMonthChange?.(nextState[index]);

                return nextState;
            });
        },
        [onMonthChange]
    );

    const handleMonthTransitionChange = useCallback(
        (swiper: SwiperClass, date?: Date) => {
            if (!swiper) {
                MediaElementAudioSourceNode;
            }

            if (indexCache.current === swiper.realIndex && !date) {
                return;
            }

            indexCache.current = swiper.realIndex;
            updateSlide(swiper.realIndex, undefined, transitionedMode);
        },
        [transitionedMode, updateSlide]
    );

    const handleTransitionEnd = useMemo(
        () =>
            fit(() => {
                if (mode === "WEEK" && transitionedMode !== "WEEK") {
                    updateSlide(indexCache.current, currentDate, mode);
                }

                setTransitionedMode(mode);
            }),
        [currentDate, mode, transitionedMode, updateSlide]
    );

    const handleSwipe = useCallback(
        (direction: "UP" | "DOWN") => {
            setMode((prev) => {
                if (direction === "DOWN") {
                    if (prev === "WEEK") {
                        console.log("WEEK");
                        const nextMode = "MEDIUM";
                        setTransitionedMode(nextMode);
                        updateSlide(indexCache.current, currentDate, nextMode);
                        return nextMode;
                    }

                    if (prev === "MEDIUM") {
                        return "FULL";
                    }

                    return prev;
                }

                if (prev === "FULL") {
                    return "MEDIUM";
                }

                if (prev === "MEDIUM") {
                    return "WEEK";
                }

                return prev;
            });
        },
        [currentDate, updateSlide]
    );
    const handleTouchStart = useCallback(({ touches }: TouchEvent) => {
        touchEndCoordinate.current = null;
        touchStartCoordinate.current = touches[0].clientY;
    }, []);
    const handleTouchMove = useCallback(({ touches }: TouchEvent) => {
        touchEndCoordinate.current = touches[0].clientY;
    }, []);
    const handleMouseDown = useCallback(({ clientY }: MouseEvent) => {
        touchEndCoordinate.current = null;
        touchStartCoordinate.current = clientY;
    }, []);
    const handleMouseMove = useCallback(({ clientY }: MouseEvent) => {
        touchEndCoordinate.current = clientY;
    }, []);
    const handleTouchEnd = useCallback(() => {
        if (
            touchStartCoordinate.current == null ||
            touchEndCoordinate.current == null
        ) {
            return;
        }

        const touchStart = +touchStartCoordinate.current;
        const touchEnd = +touchEndCoordinate.current;
        const diff = touchEnd - touchStart;

        touchStartCoordinate.current = null;
        touchEndCoordinate.current = null;

        if (MINIMUM_SWIPE_DISTANCE < Math.abs(diff)) {
            handleSwipe(0 < diff ? "DOWN" : "UP");
        }
    }, [handleSwipe]);

    useEffect(() => {
        setCurrentDate(date);
    }, [date]);

    return (
        <div
            className={cx("", `--${mode}`)}
            onTouchMove={handleTouchMove}
            onMouseMove={handleMouseMove}
            onTouchEnd={handleTouchEnd}
            onMouseUp={handleTouchEnd}
        >
            <div className={cx("__container")}>
                <div className={cx("__week-days")}>
                    {weekDays.map((x) => (
                        <span key={x}>{x}</span>
                    ))}
                </div>
                <div
                    className={cx("__swiper")}
                    ref={containerRef}
                    onTransitionEnd={handleTransitionEnd}
                    onTouchStart={handleTouchStart}
                    onMouseDown={handleMouseDown}
                >
                    <Swiper
                        slidesPerView={1}
                        loop
                        centeredSlides
                        initialSlide={INITIAL_SLIDE}
                        onTransitionEnd={handleMonthTransitionChange}
                    >
                        {monthSlides.map((month) => (
                            <SwiperSlide key={`${month.getTime()}`}>
                                <Month
                                    month={month}
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    onDateClick={(date) => {
                                        onDateClick?.(date);
                                        setMode((prev) =>
                                            prev === "FULL" ? "MEDIUM" : prev
                                        );
                                    }}
                                    mode={mode}
                                    transitionedMode={transitionedMode}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className={cx("__content")}>{content}</div>
            </div>
        </div>
    );
}

export default Calendar;
