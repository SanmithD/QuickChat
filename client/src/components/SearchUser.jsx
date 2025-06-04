function SearchUser({ searchQuery, setSearchQuery }) {
  return (
    <div>
      <div>
        <label className="input flex items-center gap-2 w-full">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow bg-transparent outline-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="kbd kbd-sm hidden lg:inline">⌘</kbd>
          <kbd className="kbd kbd-sm hidden lg:inline">K</kbd>
        </label>
      </div>
    </div>
  );
}

export default SearchUser;
