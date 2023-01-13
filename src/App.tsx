import { useState, useEffect } from "react";

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
          console.log(typeof acc);
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
      console.log(top3);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center space-y-10">
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
        <div className="stat bg-base-300">
          <div className="stat-title">Total Video Watched in 2022</div>
          <div className="stat-value">{totalVideoCount}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>
      <div className="stats shadow text-white">
        <div className="stat bg-base-300">
          <div className="stat-title">#1 {top3Creator[0][0]}</div>
          <div className="stat-value">{top3Creator[0][1]} Videos</div>
        </div>
        <div className="stat bg-base-300">
          <div className="stat-title">#2 {top3Creator[1][0]}</div>
          <div className="stat-value">{top3Creator[1][1]} Videos</div>
        </div>
        <div className="stat bg-base-300">
          <div className="stat-title">#3 {top3Creator[2][0]}</div>
          <div className="stat-value">{top3Creator[2][1]} Videos</div>
        </div>
      </div>
    </div>
  );
}

export default App;
