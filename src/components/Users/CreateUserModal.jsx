import React from "react";
import UserForm from "./UserForm";

const CreateUserModal = ({ showModal, setShowModal, currUser, refreshTable }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => setShowModal(false)}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl p-8 md:p-10 animate-in zoom-in-95 duration-300 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* Header */}
        <header className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Onboard New Worker</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Configure security and personnel details</p>
          </div>
          <button 
            onClick={() => setShowModal(false)}
            className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Form Integration */}
        <div className="mt-2">
            <UserForm 
              currUser={currUser} 
              mode="create" 
              refreshTable={() => {
                refreshTable();
                setShowModal(false);
              }} 
            />
        </div>

        {/* Footer info */}
        <footer className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Enterprise Access Control v2.4</p>
        </footer>
      </div>
    </div>
  );
};

export default CreateUserModal;