import { useState } from "react";
import { useNavigate } from "react-router-dom";
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import step4 from "../assets/step4.png";
import step5 from "../assets/step5.png";
import step6 from "../assets/step6.png";
import Step from "../components/Step";

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

function Home() {
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

  const navigate = useNavigate();

  // read the json file
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const files = e.target.files[0];
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

    reader.readAsText(files);

    navigate("/recap", {
      state: {
        files,
      },
    });
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col justify-center items-center space-y-10 px-4 pt-20 sm:px-12 lg:px-52">
        <div className="w-full flex flex-col max-w-2xl">
          <h1 className="flex flex-col font-bold text-7xl md:text-8xl text-white pb-10 md:space-y-2">
            <span>Get your</span>
            <span className="text-red-600">Youtebe Recap</span>
            <span>for 2022</span>
          </h1>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-base">
                Upload Your Youtube watch-history.json
              </span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full text-white"
              accept="application/json"
              onChange={handleChange}
            />
            <label className="label">
              <span className="label-text-alt text-base">
                Tips: You can also drag and drop the file
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center w-full pt-20">
          <h2 className="text-center w-full text-4xl font-bold text-white">
            How to retrieve the data
          </h2>
          <ul className="steps steps-vertical min-h-screen text-white max-w-2xl overflow-x-hidden">
            <Step
              img={step1}
              description="Visit Google takeout and select Youtube on 'Select Data to
            include'"
              step1={true}
            />

            <Step
              img={step2}
              description="Under 'Multiple formats', select 'JSON' for history"
            />
            <Step
              img={step3}
              description="Under 'All Youtube data included, select 'history'"
            />
            <Step img={step4} description="Click on 'Create export'" />
            <Step
              img={step5}
              description="After a few minutes, check your email and download the data
            report"
            />
            <Step
              img={step6}
              description="Unzip the file and you can find the watch-history inside Takeout
            =&gt; Youtube &amp; Youtube Music =&gt; watch-history"
              step6={true}
            />
          </ul>
        </div>
      </div>
      <footer className="footer footer-center p-4 text-base-content">
        <div>
          <p>
            Inspired by{" "}
            <a href="https://videorecap.viewodyssey.com/">Anthony Teo</a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Home;
