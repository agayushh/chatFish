const ChatWindow = ({ messages }: any) => {
  return (
    <div className="border-white border-2 h-auto w-[36vw]  rounded-md p-4">
      <div className="text-white text-4xl font-thin font-mono flex flex-col">
        ChatFish
        <span className="text-base">RoomID: 123</span>
        <span className="w-full border-b "></span>
        {/* text area */}
        <div className="border-white border-2 p-2 mt-3 h-[60vh] overflow-auto">
          {messages.map((singleMessage: any) => {
            return <div className="text-white text-lg "> -{singleMessage}</div>;
          })}
        </div>
        {/* input text */}
        <div className="flex border-white border-2 mt-4">
          <input
            className=" p-2 outline-none bg-transparent w-full text-lg h-auto"
            type="text"
          ></input>
          <div className="p-2">
            <button className="text-xl bg-white h-10 w-16 text-black ">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
