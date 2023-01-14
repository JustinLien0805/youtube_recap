import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ResponsiveCalendar } from "@nivo/calendar";
import { Line } from "react-chartjs-2";
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Video Count Per Month",
      color: "#fff",
    },
  },
  scales: {
    y: {
      ticks: {
        color: "#a5adba",
        beginAtZero: true,
      },
    },
    x: {
      ticks: {
        color: "#a5adba",
        beginAtZero: true,
      },
    },
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

type Top3Creator = Array<[string, number]>;

function App() {
  const [totalVideoCount, setTotalVideoCount] = useState<number>(0);
  const [top3Creator, setTop3Creator] = useState<Top3Creator>([
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
  // data for line chart
  const data = {
    labels: videoCountPerMonth.map((item) => item[0]),
    datasets: [
      {
        label: "Videos Watched",
        data: videoCountPerMonth.map((item) => item[1]),
        fill: false,
        backgroundColor: "#e879f999",
        borderColor: "#e879f9",
      },
    ],
  };
  // read the json file
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
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
        } else {
          acc[creator] = 1;
        }
        return acc;
      }, {});
      // turn object to array and sort
      const top3 = Object.entries(allCreatorVideosCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      setTop3Creator(top3);

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
      console.log(videoCountPerMonth);
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
      console.log(videoCountPerDay);
      let newVideoCountPerDay = Object.entries(videoCountPerDay).map(
        ([k, v]) => ({
          value: v,
          day: k,
        })
      );
      console.log(newVideoCountPerDay.length);
      setVideoCountPerDay(newVideoCountPerDay);
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center space-y-10 my-20">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Pick a file</span>
          <span className="label-text-alt">Alt label</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          accept="application/json"
          onChange={handleChange}
        />
      </div>

      <div className="stats shadow text-white">
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">Total Video Watched in 2022</div>
          <div className="stat-value">{totalVideoCount}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>
      <div className="stats shadow text-white md:grid-flow-col grid-flow-row">
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">#1</div>
          <div className="stat-value">{top3Creator[0][0]}</div>
          <div className="stat-value">{top3Creator[0][1]} Videos</div>
        </div>
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">#2</div>
          <div className="stat-value">{top3Creator[1][0]}</div>
          <div className="stat-value">{top3Creator[1][1]} Videos</div>
        </div>
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">#3</div>
          <div className="stat-value">{top3Creator[2][0]}</div>
          <div className="stat-value">{top3Creator[2][1]} Videos</div>
        </div>
      </div>
      <div className="w-[80vw] h-[50vh]">
        <Line className="w-full" options={options} data={data} />
      </div>
      <div className="md:w-[90vw] w-screen h-[100vh]">
        <ResponsiveCalendar
          data={videoCountPerDay}
          from="2022-01-01"
          to="2022-12-31"
          emptyColor="#eeeeee"
          colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          yearLegend={function (year) {
            return year;
          }}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          theme={{
            labels: { text: { fill: "#fff" } },
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
  );
}

export default App;
