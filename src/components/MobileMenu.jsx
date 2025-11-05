import { useState } from 'react';

function MobileMenu({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'staking', label: '🥩 Staking' },
    { id: 'lending', label: '🏦 Lending' },
  ];

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-tapir-cyan focus:outline-none"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-20 left-0 right-0 bg-tapir-dark/95 backdrop-blur-md border-b-2 border-tapir-cyan/50 z-50 p-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-6 py-4 rounded-xl mb-2 font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-tapir-cyan text-tapir-darkest'
                    : 'bg-tapir-dark/30 text-tapir-green border border-tapir-cyan/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MobileMenu;