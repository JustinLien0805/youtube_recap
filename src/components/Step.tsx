import { useRef } from "react";
import { useInView } from "framer-motion";

interface StepProps {
  img: string;
  description: string;
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
        <h3 className="text-xl">{description}</h3>
        {step1 && (
          <a
            className="btn w-64"
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
