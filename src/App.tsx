import { useState } from "react";
import step1 from "./assets/step1.png";
import step2 from "./assets/step2.png";
import step3 from "./assets/step3.png";
import step4 from "./assets/step4.png";
import step5 from "./assets/step5.png";
import step6 from "./assets/step6.png";
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
      size: "96px",
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
  const [top10Creator, setTop10Creator] = useState<Top3Creator>([
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
        backgroundColor: "#f87171",
        borderColor: "#fca5a5",
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

  // create a function that format the text length
  const formatTextLength = (text: string, length: number) => {
    if (text.length > length) {
      return text.slice(0, length) + "...";
    }
    return text;
  };

  // smooth scroll back to the top of the page
  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center space-y-10 px-4 py-20 sm:px-20 lg:px-52">
      <div className="w-full flex flex-col max-w-2xl">
        <h1 className="flex flex-col font-bold text-7xl md:text-8xl text-white pb-10 md:space-y-2">
          <span>Get your</span>
          <span className="text-red-600">Youtebe Recap</span>
          <span>for 2022</span>
        </h1>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-xl">
              Upload Your Youtube watch-history.json
            </span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="application/json"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full pt-20">
        <h2 className="text-center w-full text-4xl font-bold text-white">
          How to retrieve the data
        </h2>
        <ul className="steps steps-vertical min-h-screen text-white max-w-2xl">
          <li className="step step-primary">
            <div className="flex flex-col gap-4 items-center w-full my-20">
              <div className="w-11/12 max-w-xl">
                <img src={step1} alt="" className="object-cover" />
              </div>
              <h3 className="text-xl">
                Visit Google takeout and select Youtube on "Select Data to
                include"
              </h3>
              <a
                className="btn w-64"
                target="_blank"
                href="https://takeout.google.com/"
              >
                Go to Google Takeout
              </a>
            </div>
          </li>
          <li className="step step-primary">
            <div className="flex flex-col gap-4 items-center w-full">
              <div className="w-11/12 max-w-xl">
                <img src={step2} alt="" className="object-cover" />
              </div>
              <h3 className="text-xl">
                Under "Multiple formats", select "JSON" for history
              </h3>
            </div>
          </li>
          <li className="step step-primary">
            <div className="flex flex-col gap-4 items-center w-full my-20">
              <div className="w-11/12 max-w-xl">
                <img src={step3} alt="" className="object-cover" />
              </div>
              <h3 className="text-xl">
                Under 'All Youtube data included, select "history"
              </h3>
            </div>
          </li>
          <li className="step step-primary">
            <div className="flex flex-col gap-4 items-center w-full my-20">
              <div className="w-11/12 max-w-xl">
                <img src={step4} alt="" className="object-cover" />
              </div>
              <h3 className="text-xl">Click on "Create export."</h3>
            </div>
          </li>
          <li className="step step-primary">
            <div className="flex flex-col gap-4 items-center w-full my-20">
              <div className="w-11/12 max-w-xl">
                <img src={step5} alt="" className="object-cover" />
              </div>
              <h3 className="text-xl">
                After a few minutes, check your email and download the data
                report.
              </h3>
            </div>
          </li>
          <li className="step step-primary">
            <div className="flex flex-col gap-4 items-center w-full my-20">
              <div className="w-11/12 max-w-xl">
                <img src={step6} alt="" className="w-full" />
              </div>
              <h3 className="text-xl">
                Unzip the file and you can find the watch-history inside Takeout
                =&gt; Youtube &amp; Youtube Music =&gt; watch-history
              </h3>
              <button
                className="btn btn-primary text-white"
                onClick={backToTop}
              >
                Upload Your File
              </button>
            </div>
          </li>
        </ul>
      </div>

      {/* 
      <div className="stats shadow text-white">
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">Total Video Watched in 2022</div>
          <div className="stat-value">{totalVideoCount}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>
      <div className="stats shadow text-white">
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">Unique Creator watched</div>
          <div className="stat-value">{creatorCount}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>
      <div className="stats shadow text-white  md:grid-flow-col grid-flow-row">
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">#1</div>
          <div className="stat-value">{top10Creator[0][0]}</div>
          <div className="stat-value">{top10Creator[0][1]} Videos</div>
        </div>
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">#2</div>
          <div className="stat-value">{top10Creator[1][0]}</div>
          <div className="stat-value">{top10Creator[1][1]} Videos</div>
        </div>
        <div className="stat bg-base-300 gap-2">
          <div className="stat-title">#3</div>
          <div className="stat-value">{top10Creator[2][0]}</div>
          <div className="stat-value">{top10Creator[2][1]} Videos</div>
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-5 gap-4 text-xl">
        {top10Creator.map((creator, index) => (
          <>
            <h2 key={index} className="text-center">
              <span>{index + 1}. </span>
              {formatTextLength(creator[0], 20)}
            </h2>
          </>
        ))}
      </div>
      <div className="w-[80vw]">
        <Line className="w-full" options={options} data={data} />
      </div>
      <div className="md:w-[90vw] w-screen h-48">
        <ResponsiveCalendar
          data={videoCountPerDay}
          from="2022-01-01"
          to="2022-12-31"
          emptyColor="#eeeeee"
          // direction="vertical"
          colors={["#fecaca", "#ef4444", "#b91c1c", "#7f1d1d"]}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          yearSpacing={40}
          yearLegend={function (year) {
            return year;
          }}
          monthBorderColor="gray"
          dayBorderWidth={2}
          dayBorderColor="gray"
          theme={{
            labels: { text: { fill: "gray" } },
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
      </div> */}
    </div>
  );
}

export default App;
