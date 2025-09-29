import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className=" h-screen">
        <Header />
      
      <div className=" flex ">
        
           <Sidebar />
  
       
        <main className="flex-1 p-6">
          <div className='border border-gray-300 py-3 px-4 bg-white shadow'>
            <Outlet />
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default Layout;
