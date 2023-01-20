import { useRef } from "react";
import { useInView } from "framer-motion";

interface StepProps {
  img: string;
  description?: string;
  step1?: boolean;
  step6?: boolean;
}

const Step = ({
  img,
  description,
  step1 = false,
  step6 = false,
}: StepProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  // smooth scroll back to the top of the page
  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <li className="step step-primary">
      <div
        className="flex flex-col gap-4 items-center w-full my-20"
        ref={ref}
        style={{
          transform: isInView ? "none" : "translateY(100px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.3s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
        }}
      >
        <div className="w-11/12 max-w-xl">
          <img src={img} alt="" className="w-full" />
        </div>
        {step6 ? (
          <div className="breadcrumbs text-xl max-w-sm sm:max-w-xl">
            <p>Unzip the file and you can find the watch-history inside</p>
            <ul>
              <li>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mr-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    ></path>
                  </svg>
                  Takeout
                </a>
              </li>
              <li>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mr-2 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    ></path>
                  </svg>
                  Youtube and Youtebe Music
                </a>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 mr-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                watch-history
              </li>
            </ul>
          </div>
        ) : (
          <h3 className="text-xl">{description}</h3>
        )}
        {step1 && (
          <a
            className="btn w-64 text-white"
            target="_blank"
            href="https://takeout.google.com/"
          >
            Go to Google Takeout
          </a>
        )}
        {step6 && (
          <button className="btn btn-primary text-white" onClick={backToTop}>
            Upload Your File
          </button>
        )}
      </div>
    </li>
  );
};

export default Step;
