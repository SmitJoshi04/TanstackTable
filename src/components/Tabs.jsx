const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.infrastructure_id}
            onClick={() => onTabChange(tab.infrastructure_id)}
            className={`py-2 px-3 sm:px-4 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap
                ${
                  activeTab === tab.infrastructure_id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-500"
                }`}
          >
            {`${tab.infrastructure_name} Tab`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
