

interface BranchOptionProps {
    title: string
    icon: React.ReactNode
    description: string
    onClick: () => void
  }
  
  function BranchOption({ title, icon, description, onClick,}: BranchOptionProps) {
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center p-6  rounded-lg transition-all duration-300 ease-in-out transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
           'bg-blue-500  ring-2 ring-white scale-105'
        }`}
      >
        {icon}
        <h2 className="text-2xl font-bold mb-5">{title}</h2>
        <p className="text-center ">{description}</p>
      </button>
    )
};
export default BranchOption