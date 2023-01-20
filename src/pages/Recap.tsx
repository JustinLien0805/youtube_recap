import { useState, useEffect, useRef } from "react";
import { useInView, useSpring, useScroll, motion } from "framer-motion";

import { useLocation } from "react-router-dom";
import CreatorRanking from "../components/CreatorRanking";
import Tilt from "react-parallax-tilt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ResponsiveCalendar } from "@nivo/calendar";
import { Bar } from "react-chartjs-2";
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      ticks: {
        color: "#fff",
        beginAtZero: true,
      },
    },
    x: {
      ticks: {
        color: " #fff",
        beginAtZero: true,
      },
    },
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type WatchHistory = {
  title: string;
  subtitles: Array<Subtitle>;
  time: string;
  [key: string]: any;
};
type Subtitle = {
  name: string;
  url: string;
};

type TopCreator = Array<[string, number]>;

const Recap = () => {
  const location = useLocation();
  const [totalVideoCount, setTotalVideoCount] = useState<number>(0);
  const [top10Creator, setTop10Creator] = useState<TopCreator>([
    ["", 0],
    ["", 0],
    ["", 0],
  ]);
  const [videoCountPerMonth, setVideoCountPerMonth] = useState(
    [] as Array<[string, number]>
  );
  const [videoCountPerDay, setVideoCountPerDay] = useState(
    [] as Array<{ value: number; day: string }>
  );
  const [creatorCount, setCreatorCount] = useState<number>(0);

  useEffect(() => {
    // read the json file
    if (!location.state.files) return;
    const file = location.state.files;
    const reader = new FileReader();
    reader.onload = (e) => {
      const videos: Array<WatchHistory> = JSON.parse(
        e.target?.result as string
      );
      const videoCount2022: Array<WatchHistory> = videos.filter((video) => {
        const date = new Date(video.time);
        return date.getFullYear() === 2022;
      });
      setTotalVideoCount(videoCount2022.length);

      // calculate the all creator video count
      const allCreatorVideosCount = videoCount2022.reduce<{
        [key: string]: number;
      }>((acc, video) => {
        if (!video.subtitles) return acc;
        const creator = video.subtitles[0]?.name;
        if (acc[creator]) {
          acc[creator] += 1;
          setCreatorCount((prev) => prev + 1);
        } else {
          acc[creator] = 1;
        }
        return acc;
      }, {});

      // turn object to array and sort
      const top10 = Object.entries(allCreatorVideosCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      setTop10Creator(top10);

      // count how many videos watched for each month format mm
      const videoCountPerMonth = videoCount2022.reduce<{
        [key: string]: number;
      }>((acc, video) => {
        const date = new Date(video.time);
        const month = date.getMonth() + 1;
        const key = month;
        if (acc[key]) {
          acc[key] += 1;
        } else {
          acc[key] = 1;
        }
        return acc;
      }, {});
      setVideoCountPerMonth(Object.entries(videoCountPerMonth));

      let videoCountPerDay = videoCount2022.reduce<{
        [key: string]: number;
      }>((acc, video) => {
        const date = new Date(video.time);
        const year = date.getFullYear();
        let month: string | number = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        let day: string | number = date.getDate();
        day = day < 10 ? `0${day}` : day;
        const key = `${year}-${month}-${day}`;
        if (acc[key]) {
          acc[key] += 1;
        } else {
          acc[key] = 1;
        }
        return acc;
      }, {});

      let newVideoCountPerDay = Object.entries(videoCountPerDay).map(
        ([k, v]) => ({
          value: v,
          day: k,
        })
      );
      setVideoCountPerDay(newVideoCountPerDay);
    };

    reader.readAsText(file);
  }, [location.state.files]);

  // create a function that format the text length
  const formatTextLength = (text: string, length: number) => {
    if (text.length > length) {
      return text.slice(0, length) + "...";
    }
    return text;
  };

  // data for line chart
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Videos Watched",
        data: videoCountPerMonth.map((item) => item[1]),
        fill: false,
        backgroundColor: "#dc2626",
        borderColor: "#dc262699",
      },
    ],
  };

  const ref = useRef(null);
  const topCreatorRef = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen w-full flex flex-col justify-cener items-center px-4 sm:px-20 lg:px-48 overflow-hidden snap-y snap-mandatory">
      <motion.div
        style={{ scaleX }}
        className="fixed h-1 left-0 right-0 bottom-12 bg-white z-50"
      />
      <Tilt
        className="flex flex-col w-full justify-center min-h-screen items-center group snap-center snap-always"
        tiltMaxAngleY={10}
        tiltMaxAngleX={10}
      >
        <h1 className="flex flex-col font-bold text-6xl text-white pb-10 md:space-y-2">
          <span>In 2022...</span>
          <span>You Watched</span>
          <span className="text-red-600">
            <span className="group-hover:z-10 text-[60px] mr-2 md:text-[100px] md:mr-4 lg:text-[200px] tracking-[-.05em] leading-tight text-primary lg:mr-6 inline">
              {totalVideoCount}
            </span>
            <span className="text-white text-6xl"> videos</span>
          </span>
          <span>
            From
            <span className="text-red-600"> {creatorCount} </span>
            Creators
          </span>
        </h1>
      </Tilt>

      <div className="font-bold text-6xl text-white text-center min-h-screen flex justify-center items-center snap-center snap-always">
        <h2
          ref={ref}
          style={{
            transform: isInView ? "none" : "translateY(100px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.1s cubic-bezier(0.17, 0.55, 0.55, 1) 0.1s",
          }}
        >
          Let's look at your favorite creators
        </h2>
      </div>

      <CreatorRanking
        rankNumber="#001"
        name={top10Creator[0][0]}
        videoCount={top10Creator[0][1]}
      />
      <CreatorRanking
        rankNumber="#002"
        name={top10Creator[1][0]}
        videoCount={top10Creator[1][1]}
      />
      <CreatorRanking
        rankNumber="#003"
        name={top10Creator[2][0]}
        videoCount={top10Creator[2][1]}
      />
      <div
        className="min-h-screen flex flex-col justify-center items-center text-2xl font-bold text-white gap-6"
        ref={topCreatorRef}
        style={{
          transform: isInView ? "none" : "translateY(100px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
      >
        <h2 className="col-span-2 text-5xl">Top Creators</h2>
        <div className="grid grid-flow-col grid-rows-5 gap-6 h-full">
          {top10Creator.map((creator, index) => (
            <h2 key={index} className="text-center max-w-xl">
              <span>{index + 1}. </span>
              <span className="text-red-600 text-3xl">
                {formatTextLength(creator[0], 20)}
              </span>
              <span> {creator[1]} videos</span>
            </h2>
          ))}
        </div>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <h2 className="text-6xl font-bold mb-10  w-full text-center">
          Video Counts per Month
        </h2>
        <div className="md:w-[50vw] w-[80vw] h-96">
          <Bar className="w-full h-full" options={options} data={data} />
        </div>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <h2 className="text-6xl font-bold mb-10 w-full text-center">
          Your year in <span className="text-red-600">videos</span>
        </h2>
        <div className="md:w-[90vw] w-screen h-48">
          <ResponsiveCalendar
            data={videoCountPerDay}
            from="2022-01-01"
            to="2022-12-31"
            emptyColor="#eeeeee"
            colors={["#fecaca", "#ef4444", "#b91c1c", "#7f1d1d"]}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="white"
            dayBorderWidth={2}
            dayBorderColor="white"
            theme={{
              labels: { text: { fill: "white" } },
              tooltip: { container: { background: "white", color: "black" } },
            }}
            legends={[
              {
                anchor: "bottom-right",
                direction: "row",
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: "right-to-left",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Recap;
