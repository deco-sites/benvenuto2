import { Table } from "../../../static/MockedTableObject.tsx";

interface SliderComponentProps {
  rotation: number;
  handleSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tableInfo: Table;
  offsetX?: number;
  offsetY?: number;
}

const SliderComponent: React.FC<SliderComponentProps> = (
  { rotation, handleSliderChange, tableInfo, offsetX = 0, offsetY = 0 },
) => {
  return (
    <div
      className="w-[11%] text-[1.6vw] lg:text-[0.8vw] select-none flex flex-col items-center justify-center bg-white rounded-sm lg:rounded-md shadow-md"
      style={{
        zIndex: 2,
        aspectRatio: "1/0.450",
        position: "absolute",
        left: `${tableInfo.x - 3 + offsetX}%`,
        top: `${tableInfo.y + 4.6 + offsetY}%`,
        height: "auto",
      }}
    >
      <input
        type="range"
        min="0"
        max="360"
        value={rotation}
        step="5"
        onInput={handleSliderChange}
        className="slider"
      />
      <p>{rotation}º</p>
      <style>
        {`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 90%;
            aspect-ratio: 1/0.1;
            background: transparent;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 70%;
            background: #ddd;
            border-radius: 5px;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16%;
            margin-top: 0;
            aspect-ratio: 1/1;
            top: -25%;
            left: -1%;
            background: #0075FF;
            cursor: pointer;
            border-radius: 50%;
            position: relative;
            z-index: 1;
          }
          input[type="range"]::before {
            content: '';
            position: absolute;
            margin-top: 0;
            top: 15%;
            left: 5%;
            height: 21%;
            background: #0075FF;
            border-radius: 5px;
            width: calc((var(--value) - var(--min)) / (var(--max) - var(--min)) * 89%);
            z-index: 0;
          }
          input[type="range"]::-moz-range-track {
            width: 100%;
            height: 3px;
            background: #ddd;
          }
          input[type="range"]::-moz-range-thumb {
            width: 25px;
            height: 25px;
            background: #4CAF50;
            cursor: pointer;
            border-radius: 50%;
            position: relative;
            z-index: 1;
          }
          input[type="range"]::-moz-range-progress {
            background: #4CAF50;
            height: 3px;
          }
          input[type="range"]::-ms-track {
            width: 100%;
            height: 3px;
            background: transparent;
            border-color: transparent;
            color: transparent;
          }
          input[type="range"]::-ms-thumb {
            width: 25px;
            height: 25px;
            background: #4CAF50;
            cursor: pointer;
            border-radius: 50%;
            position: relative;
            z-index: 1;
          }
          input[type="range"]::-ms-fill-lower {
            background: #4CAF50;
            height: 3px;
          }
          input[type="range"] {
            --value: ${rotation};
            --min: 0;
            --max: 360;
          }
        `}
      </style>
    </div>
  );
};

export default SliderComponent;
