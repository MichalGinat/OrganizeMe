import { FaCircleNotch } from 'react-icons/fa';


function LoadingComponent() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-blue-500">
          <FaCircleNotch className="text-6xl animate-spin" />
        </div>
      </div>
    );
  }

  export default LoadingComponent