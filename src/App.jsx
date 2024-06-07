import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Spinner from "./Spinner";
import toast from "react-hot-toast";

const App = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [Prompt, setPrompt] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
  };

  const fileToGenerativePart = (file, mimeType) => {
    return {
      inlineData: {
        data: file,
        mimeType,
      },
    };
  };

  const handleRun = async () => {
    if(!Prompt || !file) {
      toast.error("please enter all fields");
      return;
    }
    setIsLoading(true);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = await genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = Prompt;
    // const prompt = "Find the value of all the angles of the triangle";

    const imagePart = fileToGenerativePart(await readFileAsBase64(file), "image/jpeg");

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = await response.text();
    setOutput(text);
    setIsLoading(false);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  return (
    <div className="w-full h-fit flex items-center flex-col gap-5 justify-center p-8">
      <h1 className="mx-auto text-center bg-clip-text text-transparent pb-2 font-bold md:text-6xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Solve maths problems using AI</h1>

      <div className="w-full h-fit flex flex-wrap md:flex-nowrap items-center gap-5 justify-center">

        {/* input */}
        <div className="border-2 md:w-[70%] w-full flex flex-col gap-3 items-center justify-center min-h-80 border-dotted rounded-md shadow p-3 bg-gray-50">
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4 p-2" type="file" onChange={handleFileChange} />
          {fileURL && <img src={fileURL} alt="Uploaded" width="200" />}
          <textarea rows={8} className="w-full border p-2 rounded-md" value={Prompt} placeholder="Your question?" onChange={e => setPrompt(e.target.value)}></textarea>
          <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-md hover:shadow-lg px-4 py-2 rounded-md" onClick={handleRun} disabled={isLoading}>
            {isLoading ? "Finding..." : "Run"}
          </button>
        </div>

        {/* output */}
        {
          isLoading
            ?
            <div className="border-2 bg-gray-50 w-full min-h-80 flex items-center justify-center border-dotted rounded-md shadow p-3">
              <Spinner />
            </div>
            :
            <div className="border-2 bg-gray-50 overflow-auto w-full min-h-80 border-dotted rounded-md shadow p-3">
              <pre>{output}</pre>
            </div>
        }

      </div>

    </div>
  );


};

export default App;
