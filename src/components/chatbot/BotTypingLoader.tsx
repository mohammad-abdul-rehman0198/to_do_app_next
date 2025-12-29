export const BotTypingLoader = () => {
  return (
    <div className="self-start flex items-center gap-2">
      <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-75"></div>
      <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></div>
      <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-300"></div>
    </div>
  );
};
