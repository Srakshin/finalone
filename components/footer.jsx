import { FaGithub, FaPhone } from "react-icons/fa";
import { SiGmail } from "react-icons/si"; 

const Footer = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-10 px-8 relative overflow-hidden">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-2">Our GitHub</h2>
        <div className="flex flex-col gap-2">
          <a href="https://github.com/Srakshin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-400 transition">
            <FaGithub /> Srakshin Chityala
          </a>
          <a href="https://github.com/dwarak726" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-400 transition">
            <FaGithub /> Dwarak Golconda
          </a>
          <a href="https://github.com/itssaii07" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-400 transition">
            <FaGithub /> Sai Srinivas
          </a>
          <a href="https://github.com/hem02201" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-400 transition">
            <FaGithub /> Hemanth Naga
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-2">Contact</h2>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          
          <div className="space-y-3">
            <h3 className="font-extrabold">Emails</h3>
            <p className="flex items-center gap-2"><SiGmail /> bsrakshin@gmail.com</p>
            <p className="flex items-center gap-2"><SiGmail /> dwarak.golconda7@gmail.com</p>
            <p className="flex items-center gap-2"><SiGmail /> sai.magan07@gmail.com</p>
            <p className="flex items-center gap-2"><SiGmail /> hemjihit2@gmail.com</p>
          </div>

          {/* Phone Numbers - Right */}
          <div className="space-y-3">
            <h3 className="font-extrabold">Phone</h3>
            <p className="flex items-center gap-2"><FaPhone /> 8341606749</p>
            <p className="flex items-center gap-2"><FaPhone /> 9014029964</p>
            <p className="flex items-center gap-2"><FaPhone /> 9123456789</p>
            <p className="flex items-center gap-2"><FaPhone /> 7981806457</p>
          </div>
        </div>
      </div>

   
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold mb-2">Quick Links</h2>
        <ul className="flex flex-col gap-2">
          <li>
            <a href="/resources" className="hover:text-gray-400 transition">Resources</a>
          </li>
          <li>
            <a href="/explore" className="hover:text-gray-400 transition">Explore Tools</a>
          </li>
          <li>
            <a href="/dashboard" className="hover:text-gray-400 transition">Dashboard</a>
          </li>
        </ul>
      </div>

    </div>

    <div className="mt-12 text-center text-gray-400 text-sm">
      © {new Date().getFullYear()} FinAdvisor. All rights reserved.
    </div>
  </footer>
);

export default Footer;